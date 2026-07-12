/** Bilibili 番剧推荐 API 返回模型 */

export interface RecommendationResult {
  code: number
  message: string
  data: Data
}

/** 推荐数据 */
export interface Data {
  coursor: number
  has_next: boolean
  items: Item[]
}

/** 推荐分区 */
export interface Item {
  rank_id: number
  sub_items: ItemSubItem[]
  text: any[]
}

/** 推荐子项（单部番剧） */
export interface ItemSubItem {
  card_style: string
  cover: string
  episode_id?: number
  evaluate?: string
  hover?: Hover
  inline?: Inline
  link?: string
  rank_id: number
  rating?: string
  rating_count?: number
  report: Report
  season_id?: number
  season_type?: number
  stat?: Stat
  sub_title: string
  text: any[]
  title: string
  user_status?: UserStatus
  sub_items?: SubItemSubItem[]
}

/** hover 浮层信息 */
export interface Hover {
  img: string
  text: string[]
}

/** 即将开播/连载中信息 */
export interface Inline {
  end_time: number
  ep_id: number
  first_ep: number
  material_no: string
  scene: number
  start_time: number
}

export interface Report {
  first_ep?: number
  scene?: number
}

/** 番剧统计（弹幕、播放、时长） */
export interface Stat {
  danmaku: number
  duration: number
  view: number
}

/** 嵌套子项 */
export interface SubItemSubItem {
  card_style: string
  cover: string
  evaluate: string
  hover: Hover
  inline: Inline
  link: string
  rank_id: number
  rating?: string
  rating_count?: number
  report: Report
  season_id: number
  season_type: number
  stat: Stat
  sub_title: string
  text: any[]
  title: string
  user_status: UserStatus
}

/** 用户追番状态 */
export interface UserStatus {
  follow: number
}
