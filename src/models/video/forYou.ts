/** Bilibili Web 端推荐 API 返回模型 */
// https://app.quicktype.io/?l=ts

export interface forYouResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** Web 推荐数据 */
export interface Data {
  item: Item[]
  side_bar_column: any[]
  business_card: null
  floor_info: null
  user_feature: null
  preload_expose_pct: number
  preload_floor_expose_pct: number
  mid: number
}

/** 推荐视频条目 */
export interface Item {
  id: number
  bvid: string
  cid: number
  goto: Goto
  uri: string
  pic: string
  pic_4_3: string
  title: string
  duration: number
  pubdate: number
  owner: Owner
  stat: Stat
  av_feature: null
  is_followed: number
  rcmd_reason: RcmdReason
  show_info: number
  track_id: string
  pos: number
  room_info: null
  ogv_info: null
  business_info: null
  is_stock: number
  enable_vt: number
  vt_display: string
}

export enum Goto {
  AV = 'av',
}

/** UP 主信息 */
export interface Owner {
  mid: number
  name: string
  face: string
}

/** 推荐理由 */
export interface RcmdReason {
  reason_type: number
  content?: string
}

/** 视频统计 */
export interface Stat {
  view: number
  like: number
  danmaku: number
  vt: number
}
