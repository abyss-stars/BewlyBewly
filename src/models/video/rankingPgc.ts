/** Bilibili PGC（专业生产内容）排行榜 API 返回模型 */
// https://app.quicktype.io/?l=ts

export interface RankingPgcResult {
  code: number
  data: Data
  message: string
}

/** PGC 排行榜数据 */
export interface Data {
  list: List[]
  note: string
  season_type: number
}

/** PGC 榜单条目 */
export interface List {
  badge: Badge
  badge_info: BadgeInfo
  badge_type: number
  cover: string
  desc: string
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

export enum Badge {
  Empty = '',
  会员专享 = '会员专享',
  会员抢先 = '会员抢先',
  独家 = '独家',
  限时免费 = '限时免费',
}

/** 角标信息 */
export interface BadgeInfo {
  bg_color: BgColor
  bg_color_night: BgColorNight
  text: Badge
}

export enum BgColor {
  Fb7299 = '#FB7299',
  The00C0Ff = '#00C0FF',
}

export enum BgColorNight {
  Bb5B76 = '#BB5B76',
  The0B91Be = '#0B91BE',
}

export interface IconFont {
  name: Name
  text: string
}

export enum Name {
  PlaydataSquareLine500 = 'playdata-square-line@500',
}

/** 最新剧集 */
export interface NewEp {
  cover: string
  index_show: string
}

/** PGC 统计 */
export interface Stat {
  danmaku: number
  follow: number
  series_follow: number
  view: number
}
