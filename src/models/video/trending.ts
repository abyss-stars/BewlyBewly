/** Bilibili 热门趋势 API 返回模型 */
// https://app.quicktype.io/?l=ts

export interface TrendingResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 热门趋势数据 */
export interface Data {
  list: List[]
  no_more: boolean
}

/** 热门视频条目 */
export interface List {
  aid: number
  videos: number
  tid: number
  tname: string
  copyright: number
  pic: string
  title: string
  pubdate: number
  ctime: number
  desc: string
  state: number
  duration: number
  mission_id?: number
  rights: { [key: string]: number }
  owner: Owner
  stat: { [key: string]: number }
  dynamic: string
  cid: number
  dimension: Dimension
  season_id?: number
  short_link_v2: string
  first_frame: string
  pub_location: string
  bvid: string
  season_type: number
  is_ogv: boolean
  ogv_info: null
  enable_vt: number
  ai_rcmd: null
  rcmd_reason: RcmdReason
  up_from_v2?: number
}

/** 视频尺寸 */
export interface Dimension {
  width: number
  height: number
  rotate: number
}

/** UP 主信息 */
export interface Owner {
  mid: number
  name: string
  face: string
}

/** 推荐理由 */
export interface RcmdReason {
  content: string
  corner_mark: number
}
