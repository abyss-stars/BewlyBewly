/** Bilibili 历史记录 API 返回模型 */

export interface HistoryResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 历史记录数据 */
export interface Data {
  cursor: Cursor
  tab: Tab[]
  list: List[]
}

/** 分页游标 */
export interface Cursor {
  max: number
  view_at: number
  business: Business | string
  ps: number
}

/** 业务类型 */
export enum Business {
  ARCHIVE = 'archive',
  PGC = 'pgc',
  LIVE = 'live',
  ARTICLE = 'article',
  ARTICLE_LIST = 'article-list',
}

/** 单条历史记录 */
export interface List {
  title: string
  long_title: string
  cover: string
  covers: null
  uri: string
  history: History
  videos: number
  author_name: string
  author_face: string
  author_mid: number
  view_at: number
  progress: number
  badge: string
  show_title: string
  duration: number
  current: string
  total: number
  new_desc: string
  is_finish: number
  is_fav: number
  kid: number
  tag_name: string
  live_status: number
}

/** 历史记录详细信息（oid、bvid、cid 等） */
export interface History {
  oid: number
  epid: number
  bvid: string
  page: number
  cid: number
  part: string
  business: Business
  dt: number
}

/** Tab 分类标签 */
export interface Tab {
  type: string
  name: string
}
