/** Bilibili 顶栏直播动态模型 */
// https://app.quicktype.io/?l=ts

export interface TopBarLiveMomentResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 直播动态数据 */
export interface Data {
  results: number
  page: string
  pagesize: string
  list: List[]
}

/** 单个直播条目 */
export interface List {
  cover: string
  face: string
  uname: string
  title: string
  roomid: number
  pic: string
  online: number
  link: string
  uid: number
  parent_area_id: number
  area_id: number
}
