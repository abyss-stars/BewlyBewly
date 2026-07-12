/** Bilibili 收藏分类 API 返回模型 */

export interface FavoritesCategoryResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 收藏分类数据 */
export interface Data {
  count: number
  list: List[]
  season: null
}

/** 单个收藏分类 */
export interface List {
  id: number
  fid: number
  mid: number
  attr: number
  title: string
  fav_state: number
  media_count: number
}
