// 搜索历史管理模块，通过 Bilibili 的跨域 iframe 消息通信存储搜索历史
import { LazyValue } from '~/utils/lazyLoad'

const SEARCH_HISTORY_LIMIT = 20

export interface HistoryItem {
  value: string
  timestamp: number
}
export interface SuggestionItem {
  value: string
  term: string
  name: string
  type: string
  ref: number
  spid: number
  timestamp: number
}
export interface SuggestionResponse {
  code: number
  exp_str: string
  result: {
    tag: SuggestionItem[]
  }
  stoken: string
}

// 按时间戳降序排列搜索历史
function historySort(historyItems: HistoryItem[]) {
  historyItems.sort((a, b) => b.timestamp - a.timestamp)
  return historyItems
}

export interface BilibiliStorageEvent {
  type: 'COLS_RES'
  id?: string
  key: string
  value: string
}

// Bilibili 存储提供者，通过 Bilibili 的 cols iframe 进行跨域存储操作
class BilibiliStorageProvider {
  static BILIBILI_HISTORY_KEY = 'search_history:search_history'

  private readonly iframe = new LazyValue<HTMLIFrameElement>(() => Array.from(document.getElementsByTagName('iframe')).find(i => i.src.includes('https://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html'))!)

  private async operate(type: 'COLS_GET'): Promise<BilibiliStorageEvent>
  private async operate(type: 'COLS_SET', value: string): Promise<void>
  private async operate(type: 'COLS_CLR'): Promise<void>
  private async operate(type: 'COLS_GET' | 'COLS_CLR' | 'COLS_SET', value?: string) {
    const iframe = this.iframe.value

    switch (type) {
      case 'COLS_GET':
        return new Promise<BilibiliStorageEvent>((resolve) => {
          iframe.contentWindow!.postMessage({ type: 'COLS_GET', key: BilibiliStorageProvider.BILIBILI_HISTORY_KEY }, iframe!.src)
          window.addEventListener('message', (e: MessageEvent<BilibiliStorageEvent>) => {
            if (e.origin === 'https://s1.hdslb.com' && e.data && e.data?.type === 'COLS_RES' && e.data?.key === BilibiliStorageProvider.BILIBILI_HISTORY_KEY)
              resolve(e.data)
          }, { once: true })
        })
      case 'COLS_CLR':
        return iframe.contentWindow!.postMessage({ type: 'COLS_CLR', key: 'search_history' }, iframe.src)
      case 'COLS_SET':
        return iframe.contentWindow!.postMessage({ type: 'COLS_SET', key: BilibiliStorageProvider.BILIBILI_HISTORY_KEY, value }, iframe.src)
    }
  }

  getSearchHistory() {
    return this.operate('COLS_GET')
  }

  clearSearchHistory() {
    return this.operate('COLS_CLR')
  }

  addSearchHistory(value: string) {
    return this.operate('COLS_SET', value)
  }

  removeSearchHistory(value: string) {
    return this.operate('COLS_SET', value)
  }
}

const provider = new BilibiliStorageProvider()

// 获取搜索历史
export async function getSearchHistory(): Promise<HistoryItem[]> {
  const e = await provider.getSearchHistory()

  if (!e)
    return []

  try {
    const history = JSON.parse(e.value)
    return historySort(history)
  }
  catch {
    return []
  }
}

// 添加搜索历史，已存在的项更新时间戳，超出上限的项会被丢弃
export async function addSearchHistory(historyItem: HistoryItem) {
  let history = await getSearchHistory()

  let hasSameValue = false
  history.forEach((item) => {
    if (item.value === historyItem.value) {
      item.timestamp = historyItem.timestamp
      hasSameValue = true
    }
  })
  if (!hasSameValue)
    history.unshift(historyItem)

  // if out of limit, remove overflow items
  history = history.filter((item, index) => {
    if (index < SEARCH_HISTORY_LIMIT)
      return item
    else
      return false
  })

  provider.addSearchHistory(JSON.stringify(history))
  return history
}

// 删除指定搜索历史项
export async function removeSearchHistory(value: string) {
  let history = await getSearchHistory()
  history = history.filter(item => item.value !== value)
  provider.removeSearchHistory(JSON.stringify(history))
  return history
}

// 清空所有搜索历史
export async function clearAllSearchHistory() {
  return provider.clearSearchHistory()
}
