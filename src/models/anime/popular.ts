/** Bilibili 热门番剧 API 返回模型 */

export interface PopularAnimeResult {
  code: number
  message: string
  result: Result
}

/** 热门番剧列表响应体 */
export interface Result {
  list: List[]
  note: string
}

/** 单部番剧条目 */
export interface List {
  badge: string
  badge_info: BadgeInfo
  badge_type: number
  copyright: string
  cover: string
  enable_vt: boolean
  icon_font: IconFont
  new_ep: NewEp
  rank: number
  rating: string
  season_id: number
  ss_horizontal_cover: string
  stat: Stat
  title: string
  url: string
}

/** 角标信息（如"会员专享"） */
export interface BadgeInfo {
  bg_color: string
  bg_color_night: string
  text: string
}

/** 图标字体 */
export interface IconFont {
  name: string
  text: string
}

/** 最新剧集信息 */
export interface NewEp {
  cover: string
  index_show: string
}

/** 番剧统计信息 */
export interface Stat {
  danmaku: number
  follow: number
  series_follow: number
  view: number
}
