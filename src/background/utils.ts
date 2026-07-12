/**
 * 后台工具函数
 * 提供通用的 API 请求处理机制：fetch 前置处理 + 后处理管道
 * 核心概念：将每个 API 定义为 { url, _fetch, params, afterHandle } 结构，
 * 通过 apiListenerFactory 工厂函数自动生成消息监听器
 *
 * 后处理流（AHS）说明：
 * - J_D: JSON 解析 → 直接返回 data（用于不需要 sendResponse 的请求）
 * - J_S: JSON 解析 → sendResponse（用于需要手动 sendResponse 的请求，如登录）
 * - S:   直接 sendResponse（不解析 JSON）
 */
import type Browser from 'webextension-polyfill'

/** 后处理函数类型 */
type FetchAfterHandler = ((data: Response) => Promise<any>) | ((data: any) => any)

/** 将 Response 转为 JSON */
function toJsonHandler(data: Response): Promise<any> {
  return data.json()
}
/** 透传 data（配合 toJsonHandler 使用，提取 response.data） */
function toData(data: Promise<any>): Promise<any> {
  return data
}

/** 创建 sendResponse 后处理函数，将结果通过 Chrome 消息通道返回 */
function sendResponseHandler(sendResponse: (...args: any[]) => any) {
  return (data: any) => sendResponse(data)
}

/** 预定义的后处理流组合 */
const AHS: {
  J_D: FetchAfterHandler[]
  J_S: FetchAfterHandler[]
  S: FetchAfterHandler[]
} = {
  J_D: [toJsonHandler, toData],
  J_S: [toJsonHandler, sendResponseHandler],
  S: [sendResponseHandler],
}

/** 从 content script 发来的消息结构 */
interface Message {
  contentScriptQuery: string
  [key: string]: any
}

/** fetch 请求的配置（method、headers、body） */
interface _FETCH {
  method: string
  headers?: {
    [key: string]: any
  }
  body?: any
}

/** 单个 API 的定义结构 */
interface API {
  url: string
  _fetch: _FETCH
  params?: {
    [key: string]: any
  }
  afterHandle: ((response: Response) => Response | Promise<Response>)[]
}
/** API 也可以是自定义函数（用于复杂场景，如登录流程） */
type APIFunction = (message: Message, sender?: any, sendResponse?: (...args: any[]) => any) => any
export type APIType = API | APIFunction
/** contentScriptQuery → API 定义的映射表 */
interface APIMAP {
  [key: string]: APIType
}
/**
 * 工厂函数：根据 API_MAP 创建一个消息监听器
 * 收到 content script 消息后，查找对应的 API 定义并执行 fetch 请求
 */
function apiListenerFactory(API_MAP: APIMAP) {
  return async (message: Message, sender?: Browser.Runtime.MessageSender, sendResponse?: (...args: any[]) => any) => {
    const contentScriptQuery = message.contentScriptQuery
    // 检测是否有contentScriptQuery
    if (!contentScriptQuery || !API_MAP[contentScriptQuery])
      return console.error(`Cannot find this contentScriptQuery: ${contentScriptQuery}`)
    if (typeof API_MAP[contentScriptQuery] === 'function')
      return (API_MAP[contentScriptQuery] as APIFunction)(message, sender, sendResponse)

    const api = API_MAP[contentScriptQuery] as API

    // eslint-disable-next-line node/prefer-global/process
    if (process.env.FIREFOX && sender && sender.tab && sender.tab.cookieStoreId) {
      const cookies = await browser.cookies.getAll({ storeId: sender.tab.cookieStoreId })
      return doRequest(message, api, sendResponse, cookies)
    }

    return doRequest(message, api, sendResponse)
  }
}

/**
 * 执行实际的 fetch 请求
 * 将 message 中的参数合并到 API 定义的 params/body 中，处理后处理管道
 */
function doRequest(message: Message, api: API, sendResponse?: (...args: any[]) => any, cookies?: Browser.Cookies.Cookie[]) {
  try {
    let { contentScriptQuery, ...rest } = message
    // rest 中的字段将按优先级合并到 body 或 params
    rest = rest || {}

    let { _fetch, url, params = {}, afterHandle } = api
    const { method, headers = {}, body } = _fetch as _FETCH
    const isGET = method.toLocaleLowerCase() === 'get'
    // 合并 message 中的参数：优先覆盖 body，其次覆盖 params
    const targetParams = Object.assign({}, params)
    let targetBody = Object.assign({}, body)
    Object.keys(rest).forEach((key) => {
      if (body && body[key] !== undefined)
        targetBody[key] = rest[key]
      else
        targetParams[key] = rest[key]
    })

    // 将 params 拼接为 URL 查询字符串
    if (Object.keys(targetParams).length) {
      const urlParams = new URLSearchParams()
      for (const key in targetParams)
        targetParams[key] && urlParams.append(key, targetParams[key])
      url += `?${urlParams.toString()}`
    }
    // 生成请求体：根据 Content-Type 决定序列化方式
    if (!isGET) {
      targetBody = (headers && headers['Content-Type'] && headers['Content-Type'].includes('application/x-www-form-urlencoded'))
        ? new URLSearchParams(targetBody)
        : JSON.stringify(targetBody)
    }
    // Firefox 容器标签页：将 cookies 合并到请求头
    if (cookies) {
      const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
      headers['firefox-multi-account-cookie'] = cookieStr
    }
    // GET 请求不能带 body
    const fetchOpt = { method, headers }
    !isGET && Object.assign(fetchOpt, { body: targetBody })
    // 执行 fetch 并依次应用后处理函数链
    let baseFunc = fetch(url, {
      ...fetchOpt,
    })
    afterHandle.forEach((func) => {
      if (func.name === sendResponseHandler.name && sendResponse)
        // sendResponseHandler 需要注入 sendResponse 参数
        baseFunc = baseFunc.then(sendResponseHandler(sendResponse))
      else
        baseFunc = baseFunc.then(func)
    })
    baseFunc.catch(console.error)
    return baseFunc
  }
  catch (e) {
    console.error(e)
  }
}

export {
  type _FETCH,
  AHS,
  type API,
  apiListenerFactory,
  type APIMAP,
  type FetchAfterHandler,
  type Message,
  sendResponseHandler,
  toData,
  toJsonHandler,
}
