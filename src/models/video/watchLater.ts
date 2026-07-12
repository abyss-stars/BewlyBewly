/** Bilibili 稍后再看 API 返回模型 */

export interface WatchLaterResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 稍后再看数据 */
export interface Data {
  count: number
  list: List[]
}

/** 单条稍后再看条目 */
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
  rights: { [key: string]: number }
  owner: Owner
  stat: { [key: string]: number }
  dynamic: Dynamic
  dimension: Dimension
  short_link_v2: string
  up_from_v2?: number
  first_frame: string
  pub_location: string
  page: Page
  count: number
  cid: number
  progress: number
  add_at: number
  bvid: string
  uri: string
  enable_vt: number
  view_text_1: string
  card_type: number
  left_icon_type: number
  left_text: string
  right_icon_type: number
  right_text: string
  arc_state: number
  pgc_label: string
  show_up: boolean
  forbid_fav: boolean
  forbid_sort: boolean
  season_id?: number
  mission_id?: number
}

export interface Dimension {
  width: number
  height: number
  rotate: number
}

export enum Dynamic {
  Empty = '',
  后期鸽看了看自己暗淡无光的羽毛又看了看你们手里闪闪发光的硬币 = '后期鸽看了看自己暗淡无光的羽毛，又看了看你们手里闪闪发光的硬币',
}

/** UP 主信息 */
export interface Owner {
  mid: number
  name: string
  face: string
}

/** 分P 信息 */
export interface Page {
  cid: number
  page: number
  from: From
  part: string
  duration: number
  vid: string
  weblink: string
  dimension: Dimension
  first_frame: string
}

export enum From {
  Vupload = 'vupload',
}
