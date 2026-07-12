/**
 * 后台 Service Worker 入口文件
 * 负责扩展安装初始化、Firefox 下请求头改写、注册所有消息监听器
 */
import browser from 'webextension-polyfill'

import { setupApiMsgLstnrs } from './messageListeners/api'
import { setupTabMsgLstnrs } from './messageListeners/tabs'

// 扩展安装/更新时的回调
browser.runtime.onInstalled.addListener(async () => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

/** 判断给定 URL 是否属于扩展自身（用于区分扩展页面请求与外部请求） */
function isExtensionUri(url: string) {
  return new URL(url).origin === new URL(browser.runtime.getURL('')).origin
}

// Firefox 环境下拦截所有请求，改写 Origin/Referer 头以绕过跨域限制
// eslint-disable-next-line node/prefer-global/process
if (process.env.FIREFOX) {
  browser.webRequest.onBeforeSendHeaders.addListener(
    async (details: any) => {
      const requestHeaders: browser.WebRequest.HttpHeaders = []
      if (details.documentUrl) {
        const url = new URL(details.documentUrl)
        const extensionUri = isExtensionUri(details.documentUrl)
        details.requestHeaders = details.requestHeaders || []
        for (let i = 0; i < details.requestHeaders.length; i++) {
          if (details.requestHeaders[i].name.toLowerCase() === 'origin' || details.requestHeaders[i].name.toLowerCase() === 'referer')
            requestHeaders.push({ name: details.requestHeaders[i].name, value: extensionUri ? 'https://www.bilibili.com' : url.origin })
          else
            requestHeaders.push(details.requestHeaders[i])

          if (details.requestHeaders[i].name === 'firefox-multi-account-cookie') {
            requestHeaders.push({ name: 'cookie', value: details.requestHeaders[i].value })
          }
        }

        return { ...details, requestHeaders }
      }
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders'],
  )
}

// 注册所有消息监听器（API + 标签页）
setupApiMsgLstnrs()
setupTabMsgLstnrs()
