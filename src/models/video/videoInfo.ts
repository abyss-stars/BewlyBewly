/** Bilibili 视频信息 API 返回模型 */
// https://app.quicktype.io/?l=ts

export interface VideoInfo {
  code: number
  message: string
  ttl: number
  data: Data
}

/** 视频详情数据 */
export interface Data {
  bvid: string
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
  desc_v2: DescV2[]
  state: number
  duration: number
  mission_id: number
  rights: { [key: string]: number }
  owner: Owner
  stat: Stat
  argue_info: ArgueInfo
  dynamic: string
  cid: number
  dimension: Dimension
  premiere: null
  teenage_mode: number
  is_chargeable_season: boolean
  is_story: boolean
  is_upower_exclusive: boolean
  is_upower_play: boolean
  enable_vt: number
  vt_display: string
  no_cache: boolean
  pages: Page[]
  subtitle: Subtitle
  staff: Staff[]
  is_season_display: boolean
  user_garb: UserGarb
  honor_reply: HonorReply
  like_icon: string
  need_jump_bv: boolean
  disable_show_up_info: boolean
}

/** 争议/申诉信息 */
export interface ArgueInfo {
  argue_msg: string
  argue_type: number
  argue_link: string
}

/** 新版视频简介 */
export interface DescV2 {
  raw_text: string
  type: number
  biz_id: number
}

export interface Dimension {
  width: number
  height: number
  rotate: number
}

/** 荣誉回复 */
export interface HonorReply {
  honor: Honor[]
}

export interface Honor {
  aid: number
  type: number
  desc: string
  weekly_recommend_num: number
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
  from: string
  part: string
  duration: number
  vid: string
  weblink: string
  dimension: Dimension
}

/** 联合投稿/Staff 信息 */
export interface Staff {
  mid: number
  title: string
  name: string
  face: string
  vip: Vip
  official: Official
  follower: number
  label_style: number
}

/** 官方认证信息 */
export interface Official {
  role: number
  title: string
  desc: string
  type: number
}

/** 大会员信息 */
export interface Vip {
  type: number
  status: number
  due_date: number
  vip_pay_type: number
  theme_type: number
  label: Label
  avatar_subscript: number
  nickname_color: string
  role: number
  avatar_subscript_url: string
  tv_vip_status: number
  tv_vip_pay_type: number
  tv_due_date: number
}

export interface Label {
  path: string
  text: string
  label_theme: string
  text_color: string
  bg_style: number
  bg_color: string
  border_color: string
  use_img_label: boolean
  img_label_uri_hans: string
  img_label_uri_hant: string
  img_label_uri_hans_static: string
  img_label_uri_hant_static: string
}

/** 视频统计信息 */
export interface Stat {
  aid: number
  view: number
  danmaku: number
  reply: number
  favorite: number
  coin: number
  share: number
  now_rank: number
  his_rank: number
  like: number
  dislike: number
  evaluation: string
  vt: number
}

/** 字幕信息 */
export interface Subtitle {
  allow_submit: boolean
  list: List[]
}

export interface List {
  id: number
  lan: string
  lan_doc: string
  is_lock: boolean
  subtitle_url: string
  type: number
  id_str: string
  ai_type: number
  ai_status: number
  author: Author
}

/** 字幕作者 */
export interface Author {
  mid: number
  name: string
  sex: string
  face: string
  sign: string
  rank: number
  birthday: number
  is_fake_account: number
  is_deleted: number
  in_reg_audit: number
  is_senior_member: number
}

/** 用户装扮 */
export interface UserGarb {
  url_image_ani_cut: string
}
