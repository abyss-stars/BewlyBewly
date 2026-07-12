/**
 * 标签页消息监听器
 * 处理与浏览器标签页相关的消息，如后台打开链接
 */
import browser from 'webextension-polyfill'

interface Message {
  contentScriptQuery: string
  [key: string]: any
}

/** 标签页相关的消息类型枚举 */
export enum TABS_MESSAGE {
  OPEN_LINK_IN_BACKGROUND = 'openLinkInBackground',
}

/** 处理标签页消息：支持后台打开链接（不切换当前标签页） */
function handleMessage(message: Message) {
  if (message.contentScriptQuery === TABS_MESSAGE.OPEN_LINK_IN_BACKGROUND) {
    return browser.tabs.create({ url: message.url, active: false })
  }
}

/** 注册标签页消息监听器 */
export function setupTabMsgLstnrs() {
  browser.runtime.onMessage.removeListener(handleConnect)
  browser.runtime.onMessage.addListener(handleConnect)
}

/** 连接时重新绑定消息监听器 */
function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}
