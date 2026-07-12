/** Bilibili 番剧时间表 API 返回模型 */

export interface TimetableResult {
  code: number
  message: string
  result: Result[]
}

/** 按天分组的时间表 */
export interface Result {
  date: string
  date_ts: number
  day_of_week: number
  episodes: Episode[]
  is_today: number
}

/** 当天更新的剧集信息 */
export interface Episode {
  cover: string
  delay: number
  delay_id: number
  delay_index: string
  delay_reason: string
  enable_vt: boolean
  ep_cover: string
  episode_id: number
  follow: number
  follows: string
  icon_font: IconFont
  plays: string
  pub_index: string
  pub_time: string
  pub_ts: number
  published: number
  season_id: number
  square_cover: string
  title: string
}

export interface IconFont {
  name: string
  text: string
}
