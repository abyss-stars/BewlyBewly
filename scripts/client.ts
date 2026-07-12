/**
 * Vite HMR 客户端脚本
 * 负责建立 WebSocket 连接、处理热更新消息、管理模块热替换上下文。
 * 基于 Vite 内置 HMR 客户端，针对扩展开发环境做定制（自定义端口 3303）。
 */
import type { ErrorPayload, HMRPayload, InferCustomEventPayload, Update } from 'vite'

/** Vite 热更新上下文接口，提供模块热替换的 API */
interface ViteHotContext {
  readonly data: any
  accept: (() => void) & ((cb: (mod: any) => void) => void) & ((dep: string, cb: (mod: any) => void) => void) & ((deps: readonly string[], cb: (mods: any[]) => void) => void)
  acceptExports: (exportNames: string | readonly string[], cb?: (mod: any) => void) => void
  dispose: (cb: (data: any) => void) => void
  prune: (cb: (data: any) => void) => void
  invalidate: (message?: string) => void
  on: (event: string, cb: (payload: any) => void) => void
  off: (event: string, cb: (payload: any) => void) => void
  send: (event: string, data?: any) => void
}

// Vite v3 doesn't export overlay
// import { ErrorOverlay, overlayId } from 'vite/src/client/overlay'

console.debug('[vite] connecting...')

// WebSocket 连接配置（扩展开发环境使用固定端口 3303）
const socketProtocol = location.protocol === 'https:' ? 'wss' : 'ws'
const socketHost = 'localhost:3303'
const base = '/'
const messageBuffer: string[] = []
const enableOverlay = true

// 热更新模块映射表：模块路径 -> HotModule
const hotModulesMap = new Map<string, HotModule>()
// dispose 回调映射表：模块卸载时调用
const disposeMap = new Map<string, (data: any) => void | Promise<void>>()
// prune 回调映射表：模块被裁剪时调用
const pruneMap = new Map<string, (data: any) => void | Promise<void>>()
// 模块上下文数据映射表
const dataMap = new Map<string, any>()
// 全局自定义事件监听器映射表
const customListenersMap = new Map<string, ((data: any) => void)[]>()
// 上下文专属事件监听器映射表
const ctxToListenersMap = new Map<string, Map<string, ((data: any) => void)[]>>()

let socket: WebSocket
try {
  socket = new WebSocket(`${socketProtocol}://${socketHost}`, 'vite-hmr')

  // 监听服务端推送的 HMR 消息
  socket.addEventListener('message', async ({ data }) => {
    handleMessage(JSON.parse(data))
  })

  // 连接断开时轮询等待服务端重启
  socket.addEventListener('close', async ({ wasClean }) => {
    if (wasClean)
      return
    console.log('[vite] server connection lost. polling for restart...')
    await waitForSuccessfulPing()
    location.reload()
  })
}
catch (error) {
  console.error(`[vite] failed to connect to websocket (${error}). `)
}

/** 模块 fetch 失败时的警告提示 */
function warnFailedFetch(err: Error, path: string | string[]) {
  if (!err.message.match('fetch'))
    console.error(err)

  console.error(
    `[hmr] Failed to reload ${path}. `
    + 'This could be due to syntax errors or importing non-existent '
    + 'modules. (see errors above)',
  )
}

/** 清理 URL，移除 `direct` 查询参数 */
function cleanUrl(pathname: string): string {
  const url = new URL(pathname, location.toString())
  url.searchParams.delete('direct')
  return url.pathname + url.search
}

let isFirstUpdate = true

/**
 * 处理服务端推送的 HMR 消息
 * - connected: 连接建立，发送缓冲消息并启动心跳
 * - update: 模块更新，执行 JS/CSS 热替换
 * - custom: 自定义事件透传
 * - full-reload: 全量刷新
 * - prune: 裁剪不再使用的模块
 * - error: 服务端编译错误展示
 */
async function handleMessage(payload: HMRPayload) {
  switch (payload.type) {
    case 'connected':
      console.debug('[vite] connected.')
      sendMessageBuffer()
      // 代理环境下 ws 可能超时，定期发送心跳包保持连接
      setInterval(() => socket.send('{"type":"ping"}'), 5000)
      break
    case 'update':
      notifyListeners('vite:beforeUpdate', payload)
      // 首次更新时，如果页面存在错误遮罩，说明之前的编译错误导致模块加载失败，
      // 此时热更新无法正常工作，需要强制刷新页面
      if (isFirstUpdate && hasErrorOverlay()) {
        window.location.reload()
        return
      }
      else {
        clearErrorOverlay()
        isFirstUpdate = false
      }
      payload.updates.forEach((update) => {
        if (update.type === 'js-update') {
          queueUpdate(fetchUpdate(update))
        }
        else {
          // css-update
          // this is only sent when a css file referenced with <link> is updated
          const { path, timestamp } = update
          const searchUrl = cleanUrl(path)
          // can't use querySelector with `[href*=]` here since the link may be
          // using relative paths so we need to use link.href to grab the full
          // URL for the include check.
          const el = Array.from(document.querySelectorAll<HTMLLinkElement>('link')).find(e =>
            cleanUrl(e.href).includes(searchUrl),
          )
          if (el) {
            const newPath = `${base}${searchUrl.slice(1)}${searchUrl.includes('?') ? '&' : '?'}t=${timestamp}`
            el.href = new URL(newPath, el.href).href
          }
          console.log(`[vite] css hot updated: ${searchUrl}`)
        }
      })
      break
    case 'custom': {
      notifyListeners(payload.event, payload.data)
      break
    }
    case 'full-reload':
      notifyListeners('vite:beforeFullReload', payload)
      if (payload.path && payload.path.endsWith('.html')) {
        // if html file is edited, only reload the page if the browser is
        // currently on that page.
        const pagePath = decodeURI(location.pathname)
        const payloadPath = base + payload.path.slice(1)
        if (
          pagePath === payloadPath
          || payload.path === '/index.html'
          || (pagePath.endsWith('/') && `${pagePath}index.html` === payloadPath)
        ) {
          location.reload()
        }
      }
      else {
        location.reload()
      }
      break
    case 'prune':
      notifyListeners('vite:beforePrune', payload)
      // After an HMR update, some modules are no longer imported on the page
      // but they may have left behind side effects that need to be cleaned up
      // (.e.g style injections)
      // TODO Trigger their dispose callbacks.
      payload.paths.forEach((path) => {
        const fn = pruneMap.get(path)
        if (fn)
          fn(dataMap.get(path))
      })
      break
    case 'error': {
      notifyListeners('vite:error', payload)
      const err = payload.err
      if (enableOverlay)
        createErrorOverlay(err)
      else console.error(`[vite] Internal Server Error\n${err.message}\n${err.stack}`)

      break
    }
    default: {
      // handle `vite:pong` and other Vite internal message types

    }
  }
}

/** 通知所有自定义事件监听器 */
function notifyListeners<T extends string>(event: T, data: InferCustomEventPayload<T>): void
function notifyListeners(event: string, data: any): void {
  const cbs = customListenersMap.get(event)
  if (cbs)
    cbs.forEach(cb => cb(data))
}

/** 创建错误遮罩（当前禁用，使用 Vite 内置 overlay） */
function createErrorOverlay(_err: ErrorPayload['err']) {
  if (!enableOverlay)
    return
  clearErrorOverlay()
}

/** 清除错误遮罩 */
function clearErrorOverlay() {
}

/** 检查是否存在错误遮罩 */
function hasErrorOverlay() {
  return false
}

let pending = false
let queued: Promise<(() => void) | undefined>[] = []

/**
 * 将多个由同一文件变更触发的热更新请求排队，
 * 按发送顺序依次执行（避免因 HTTP 请求往返时间不同导致顺序错乱）
 */
async function queueUpdate(p: Promise<(() => void) | undefined>) {
  queued.push(p)
  if (!pending) {
    pending = true
    await Promise.resolve()
    pending = false
    const loading = [...queued]
    queued = [];
    (await Promise.all(loading)).forEach(fn => fn && fn())
  }
}

/**
 * 轮询检测 Vite 开发服务器是否已重启
 * 对 WebSocket 地址发起 fetch 请求：成功返回 400（正常）、网络错误则重试
 */
async function waitForSuccessfulPing(ms = 1000) {
  while (true) {
    try {
      await fetch(`${location.protocol}//${socketHost}`)
      break
    }
    catch {
      await new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}

// 检测浏览器是否支持 Constructable Stylesheets（CSSStyleSheet）
const supportsConstructedSheet = (() => {
  // TODO: re-enable this try block once Chrome fixes the performance of
  // rule insertion in really big stylesheets
  // try {
  //   new CSSStyleSheet()
  //   return true
  // } catch (e) {}
  return false
})()

const sheetsMap = new Map()

/**
 * 更新/注入样式模块
 * 优先使用 Constructable Stylesheets（更高效），不支持时回退到 <style> 标签
 */
export function updateStyle(id: string, content: string): void {
  let style = sheetsMap.get(id)
  if (supportsConstructedSheet && !content.includes('@import')) {
    if (style && !(style instanceof CSSStyleSheet)) {
      removeStyle(id)
      style = undefined
    }

    if (!style) {
      style = new CSSStyleSheet()
      style.replaceSync(content)
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]
    }
    else {
      style.replaceSync(content)
    }
  }
  else {
    if (style && !(style instanceof HTMLStyleElement)) {
      removeStyle(id)
      style = undefined
    }

    if (!style) {
      style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.innerHTML = content
      document.head.appendChild(style)
    }
    else {
      style.innerHTML = content
    }
  }
  sheetsMap.set(id, style)
}

/** 移除指定 ID 的样式模块 */
export function removeStyle(id: string): void {
  const style = sheetsMap.get(id)
  if (style) {
    if (style instanceof CSSStyleSheet)
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s: CSSStyleSheet) => s !== style)

    else
      document.head.removeChild(style)

    sheetsMap.delete(id)
  }
}

/**
 * 执行模块的热更新
 * 找到受影响的模块，重新导入并执行回调
 */
async function fetchUpdate({ path, acceptedPath, timestamp }: Update) {
  let mod = hotModulesMap.get(path)
  if (!mod) {
    mod = hotModulesMap.get(path.replace(/\.js$/, ''))

    if (!mod) {
      // 代码分割项目中，尚未加载的模块无法热更新
      return
    }

    path = path.replace(/\.js$/, '')
    acceptedPath = acceptedPath.replace(/\.js$/, '')
  }

  const moduleMap = new Map()
  const isSelfUpdate = path === acceptedPath

  // 去重，确保每个依赖只导入一次
  const modulesToUpdate = new Set<string>()
  if (isSelfUpdate) {
    modulesToUpdate.add(path)
  }
  else {
    // dep update
    for (const { deps } of mod.callbacks) {
      deps.forEach((dep) => {
        if (acceptedPath === dep)
          modulesToUpdate.add(dep)
      })
    }
  }

  // determine the qualified callbacks before we re-import the modules
  const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => {
    return deps.some(dep => modulesToUpdate.has(dep))
  })

  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      const disposer = disposeMap.get(dep)
      if (disposer)
        await disposer(dataMap.get(dep))
      const [path, query] = dep.split('?')
      try {
        const newMod = await import(
          /* @vite-ignore */
          normalizeScriptUrl(`${base + path.slice(1)}.js${query ? `_${query}` : ''}`, timestamp),
        )
        moduleMap.set(dep, newMod)
      }
      catch (e: any) {
        warnFailedFetch(e, dep)
      }
    }),
  )

  return () => {
    for (const { deps, fn } of qualifiedCallbacks) fn(deps.map(dep => moduleMap.get(dep)))

    const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`
    console.log(`[vite] hot updated: ${loggedPath}`)
  }
}

/** 确保脚本 URL 以 .js 结尾并追加时间戳用于缓存破坏 */
function normalizeScriptUrl(url: string, timestamp: number) {
  if (!url.endsWith('.js') && !url.endsWith('.mjs'))
    url = `${url}.js`
  return `${url}?t=${timestamp}`
}

/** 发送缓冲区中积压的消息 */
function sendMessageBuffer() {
  if (socket.readyState === 1) {
    messageBuffer.forEach(msg => socket.send(msg))
    messageBuffer.length = 0
  }
}

interface HotModule {
  id: string
  callbacks: HotCallback[]
}

interface HotCallback {
  // the dependencies must be fetchable paths
  deps: string[]
  fn: (modules: object[]) => void
}

/**
 * 为指定模块创建热更新上下文
 * 每个模块在热更新时会创建新上下文，清理旧的回调函数和事件监听器
 */
export function createHotContext(ownerPath: string): ViteHotContext {
  if (!dataMap.has(ownerPath))
    dataMap.set(ownerPath, {})

  // 热更新时清除该模块的旧回调
  const mod = hotModulesMap.get(ownerPath)
  if (mod)
    mod.callbacks = []

  // 清除该模块的旧自定义事件监听器
  const staleListeners = ctxToListenersMap.get(ownerPath)
  if (staleListeners) {
    for (const [event, staleFns] of staleListeners) {
      const listeners = customListenersMap.get(event)
      if (listeners) {
        customListenersMap.set(
          event,
          listeners.filter(l => !staleFns.includes(l)),
        )
      }
    }
  }

  const newListeners = new Map()
  ctxToListenersMap.set(ownerPath, newListeners)

  function acceptDeps(deps: string[], callback: HotCallback['fn'] = () => { }) {
    const mod: HotModule = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: [],
    }
    mod.callbacks.push({
      deps,
      fn: callback,
    })
    hotModulesMap.set(ownerPath, mod)
  }

  const hot: ViteHotContext = {
    get data() {
      console.log('ViteHotContext data', { dataMap, ownerPath })
      return dataMap.get(ownerPath)
    },

    accept(deps?: any, callback?: any) {
      if (typeof deps === 'function' || !deps) {
        // self-accept: hot.accept(() => {})
        acceptDeps([ownerPath], ([mod]) => deps && deps(mod))
      }
      else if (typeof deps === 'string') {
        // explicit deps
        acceptDeps([deps], ([mod]) => callback && callback(mod))
      }
      else if (Array.isArray(deps)) {
        acceptDeps(deps, callback)
      }
      else {
        throw new TypeError('invalid hot.accept() usage.')
      }
    },

    dispose(cb: (data: any) => void | Promise<void>) {
      disposeMap.set(ownerPath, cb)
    },

    prune(cb: (data: any) => void) {
      pruneMap.set(ownerPath, cb)
    },

    invalidate() {
      // TODO should tell the server to re-perform hmr propagation
      // from this module as root
      location.reload()
    },

    // custom events
    on(event: string, cb: (payload: any) => void) {
      const addToMap = (map: Map<string, any[]>) => {
        const existing = map.get(event) || []
        existing.push(cb)
        map.set(event, existing)
      }
      addToMap(customListenersMap)
      addToMap(newListeners)
    },

    send(event: string, data?: any) {
      messageBuffer.push(JSON.stringify({ type: 'custom', event, data }))
      sendMessageBuffer()
    },

    acceptExports() {},
    off() {},
  }

  return hot
}

/**
 * 向动态 import 的 URL 中注入额外查询参数
 * 用于不能静态分析的动态导入路径，追加时间戳实现缓存破坏
 */
export function injectQuery(url: string, queryToInject: string): string {
  // 跳过非相对/绝对路径的 URL（外部 CDN 等）
  if (!url.startsWith('.') && !url.startsWith('/'))
    return url

  const pathname = url.replace(/#.*$/, '').replace(/\?.*$/, '')
  const { search, hash } = new URL(url, 'http://vitejs.dev')

  return `${pathname}?${queryToInject}${search ? `&${search.slice(1)}` : ''}${hash || ''}`
}
