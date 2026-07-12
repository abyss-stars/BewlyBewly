/**
 * 标签页工具
 * 通过发送消息到 background script 在后台打开新标签页。
 */
import browser from 'webextension-polyfill'

import { TABS_MESSAGE } from '~/background/messageListeners/tabs'

/** 在后台（不激活）打开新标签页 */
export function openLinkInBackground(url: string) {
  return browser.runtime.sendMessage({
    contentScriptQuery: TABS_MESSAGE.OPEN_LINK_IN_BACKGROUND,
    url,
  })
}
