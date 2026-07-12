/** Bilibili 关注直播列表 API 返回模型 */
// https://app.quicktype.io/?l=ts

export interface FollowingLiveResult {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 关注直播分页数据 */
export interface Data {
  title: string
  pageSize: number
  totalPage: number
  list: List[]
  count: number
  never_lived_count: number
  live_count: number
  never_lived_faces: any[]
}

/** 单个直播间信息 */
export interface List {
  roomid: number
  uid: number
  uname: string
  title: string
  face: string
  live_status: number
  record_num: number
  recent_record_id: string
  is_attention: number
  clipnum: number
  fans_num: number
  area_name: string
  area_value: string
  tags: string
  recent_record_id_v2: string
  record_num_v2: number
  record_live_time: number
  area_name_v2: string
  room_news: string
  switch: boolean
  watch_icon: string
  text_small: string
  room_cover: string
  parent_area_id: number
  area_id: number
}
