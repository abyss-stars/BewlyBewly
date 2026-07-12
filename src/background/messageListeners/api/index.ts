/**
 * API 消息监听器汇总模块
 * 将所有子模块的 API 定义合并为一个完整映射，通过工厂函数生成统一的消息监听器
 * 每次 content script 连接时重新注册监听器，确保消息通道正确
 */
import browser from 'webextension-polyfill'

import { apiListenerFactory } from '../../utils'
import API_ANIME from './anime'
import API_AUTH from './auth'
import API_FAVORITE from './favorite'
import API_HISTORY from './history'
import API_LIVE from './live'
import API_MOMENT from './moment'
import API_NOTIFICATION from './notification'
import API_RANKING from './ranking'
import API_SEARCH from './search'
import API_USER from './user'
import API_VIDEO from './video'
import API_WATCHLATER from './watchLater'

/** 所有 API 模块的集合，支持迭代 */
export const API_COLLECTION = {
  AUTH: API_AUTH,
  ANIME: API_ANIME,
  HISTORY: API_HISTORY,
  FAVORITE: API_FAVORITE,
  MOMENT: API_MOMENT,
  NOTIFICATION: API_NOTIFICATION,
  RANKING: API_RANKING,
  SEARCH: API_SEARCH,
  USER: API_USER,
  VIDEO: API_VIDEO,
  WATCHLATER: API_WATCHLATER,
  LIVE: API_LIVE,

  [Symbol.iterator]() {
    return Object.values(this).values()
  },
}

// 将所有 API 模块合并为一个完整的映射表
const FullAPI = Object.assign({}, ...API_COLLECTION)
// 生成统一的消息处理器
const handleMessage = apiListenerFactory(FullAPI)

/** 注册 API 消息监听器（在 content script 连接时触发） */
export function setupApiMsgLstnrs() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}

/** 连接时重新绑定消息监听器，避免重复注册 */
function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}
