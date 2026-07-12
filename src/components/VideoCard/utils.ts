// 视频卡片工具函数：获取作者跳转链接、获取视频当前播放时间、构造视频 URL
import type { Author, Video } from './types'

// 获取作者跳转链接，优先使用 authorUrl，否则使用 mid 构造 space 链接
export function getAuthorJumpUrl(author?: Author) {
  if (!author)
    return ''

  return author.authorUrl || (author.mid ? `//space.bilibili.com/${author.mid}` : '')
}

// 获取 video 元素的当前播放时间
export function getCurrentTime(videoElement: Ref<HTMLVideoElement | null>) {
  if (videoElement.value) {
    return videoElement.value.currentTime
  }
  return null
}

// 构造视频跳转 URL，播放超过 5 秒则带上时间戳参数 t
export function getCurrentVideoUrl(video: Video, videoCurrentTime: Ref<number | null>) {
  const baseUrl = `https://www.bilibili.com/video/${video.bvid ?? `av${video.aid}`}`
  const currentTime = videoCurrentTime.value
  return currentTime && currentTime > 5 ? `${baseUrl}/?t=${currentTime}` : baseUrl
}
