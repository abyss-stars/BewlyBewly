/**
 * 首页相关类型定义。
 * 包含首页子页面枚举、排行榜类型和网格布局图标类型。
 */
import type { GridLayoutType } from '~/logic'

/** 首页子页面枚举 */
export enum HomeSubPage {
  ForYou = 'ForYou',
  Following = 'Following',
  SubscribedSeries = 'SubscribedSeries',
  Trending = 'Trending',
  Ranking = 'Ranking',
  Live = 'Live',
}

/** 排行榜分类类型：支持 rid（视频分区）和 seasonType（番剧类型） */
export interface RankingType {
  id: number
  name: string
  rid?: number
  seasonType?: number
  type?: string
}

/** 网格布局切换图标配置 */
export interface GridLayoutIcon {
  icon: string
  iconActivated: string
  value: GridLayoutType
}
