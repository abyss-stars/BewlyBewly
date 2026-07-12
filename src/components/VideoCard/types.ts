// 视频卡片相关类型定义，包括视频信息接口和作者信息接口
import type { ThreePointV2 } from '~/models/video/appForYou'

export interface Video {
  id: number
  duration?: number
  durationStr?: string
  title: string
  desc?: string
  cover: string

  /** `author` for individual submissions by UP; `authorList` for collaborative submissions by UP */
  // author: 单人投稿为单个对象，联合投稿为数组
  author?: Author | Author[]

  view?: number
  viewStr?: string
  danmaku?: number
  danmakuStr?: string

  publishedTimestamp?: number
  capsuleText?: string

  bvid?: string
  aid?: number
  // used for live
  roomid?: number
  epid?: number
  goto?: string
  /** After set the `url`, clicking the video will navigate to this url. It won't be affected by aid, bvid or epid */
  // 设置 url 后点击视频将直接跳转该地址，不再通过 aid/bvid/epid 构造
  url?: string
  /** Better to provide cid, otherwise video preview will need to call another API to get it */
  // 建议提供 cid，否则视频预览需要额外请求获取
  cid?: number

  followed?: boolean
  liveStatus?: number

  tag?: string
  rank?: number
  type?: 'horizontal' | 'vertical' | 'bangumi'
  threePointV2: ThreePointV2[]

  badge?: {
    bgColor: string
    color: string
    iconUrl?: string
    text: string
  }
}

// 作者信息接口
export interface Author {
  name?: string
  /** After set the `authorUrl`, clicking the author's name or avatar will navigate to this url. It won't be affected by mid */
  // 设置 authorUrl 后点击作者直接跳转该地址，不再通过 mid 构造
  authorUrl?: string
  authorFace: string
  followed?: boolean | undefined
  mid?: number
}
