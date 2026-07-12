/**
 * 构建准备脚本
 * 为开发模式生成占位 index.html，复制资源文件，并写入 manifest.json
 * 同时监听源码变化以自动更新
 */
// generate stub index.html files for dev entry
import { execSync } from 'node:child_process'

import chokidar from 'chokidar'
import fs from 'fs-extra'

import { isDev, isFirefox, isSafari, log, r } from './utils'

/**
 * 生成占位 index.html 文件供 Vite 开发服务器使用
 * 将原始 HTML 中的入口路径替换为 Vite 服务路径
 */
async function stubIndexHtml() {
  const views = [
    'options',
    'popup',
  ]

  for (const view of views) {
    await fs.ensureDir(r(
      isFirefox
        ? `extension-firefox/dist/${view}`
        : isSafari ? `extension-safari/dist/${view}` : `extension/dist/${view}`,
    ))
    let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8')
    data = data
      .replace('"./main.ts"', `"/${view}/main.ts.js"`)
      .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')
    await fs.writeFile(r(
      isFirefox
        ? `extension-firefox/dist/${view}/index.html`
        : isSafari ? `extension-safari/dist/${view}/index.html` : `extension/dist/${view}/index.html`,
    ), data, 'utf-8')
    log('PRE', `stub ${view}`)
  }
}

/** 执行 manifest 生成脚本 */
function writeManifest() {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

/** 确保目标扩展目录存在，复制资源文件，生成 manifest */
fs.ensureDirSync(r(isFirefox ? 'extension-firefox' : isSafari ? 'extension-safari' : 'extension'))
fs.copySync(r('assets'), r(isFirefox ? 'extension-firefox/assets' : isSafari ? 'extension-safari/assets' : 'extension/assets'))
writeManifest()

if (isDev) {
  stubIndexHtml()
  /** 监听 HTML 文件变化，自动重新生成占位文件 */
  chokidar.watch(r('src/**/*.html'))
    .on('change', () => {
      stubIndexHtml()
    })
  /** 监听 manifest 和 package.json 变化，自动重新生成 manifest */
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
}
