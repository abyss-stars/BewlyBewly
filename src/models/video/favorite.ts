/** Bilibili 收藏 API 返回模型 */

export interface FavoritesResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 收藏夹数据 */
export interface Data {
  info: Info
  medias: Media[]
  has_more: boolean
  ttl: number
}

/** 收藏夹基本信息 */
export interface Info {
  id: number
  fid: number
  mid: number
  attr: number
  title: string
  cover: string
  upper: InfoUpper
  cover_type: number
  cnt_info: InfoCntInfo
  type: number
  intro: string
  ctime: number
  mtime: number
  state: number
  fav_state: number
  like_state: number
  media_count: number
}

/** 收藏夹计数 */
export interface InfoCntInfo {
  collect: number
  play: number
  thumb_up: number
  share: number
}

/** 收藏夹创建者 */
export interface InfoUpper {
  mid: number
  name: string
  face: string
  followed: boolean
  vip_type: number
  vip_statue: number
}

/** 收藏的媒体条目 */
export interface Media {
  id: number
  type: number
  title: string
  cover: string
  intro: string
  page: number
  duration: number
  upper: MediaUpper
  attr: number
  cnt_info: MediaCntInfo
  link: string
  ctime: number
  pubtime: number
  fav_time: number
  bv_id: string
  bvid: string
  season: null
  ogv: null
  ugc: Ugc
}

/** 媒体计数 */
export interface MediaCntInfo {
  collect: number
  play: number
  danmaku: number
  vt: number
  play_switch: number
  reply: number
  view_text_1: string
}

export interface Ugc {
  first_cid: number
}

/** 媒体 UP 主 */
export interface MediaUpper {
  mid: number
  name: string
  face: string
}
