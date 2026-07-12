/**
 * 应用枚举定义
 * 包含语言类型、应用页面和顶部栏弹出窗口的枚举值
 */

/** 语言类型枚举，支持简体中文、繁体中文、粤语和英语 */
export enum LanguageType {
  English = 'en',
  Mandarin_CN = 'cmn-CN',
  Mandarin_TW = 'cmn-TW',
  Cantonese = 'jyut',
}

/** 应用页面枚举，标识各个主要页面 */
export enum AppPage {
  Home = 'Home',
  Search = 'Search',
  Anime = 'Anime',
  History = 'History',
  Favorites = 'Favorites',
  WatchLater = 'WatchLater',
  Moments = 'Moments',
}

/** 顶部栏弹出窗口类型枚举 */
export enum TopBarPopup {
  FavoritesPop = 'FavoritesPop',
  HistoryPop = 'HistoryPop',
  MomentsPop = 'MomentsPop',
  NotificationsPop = 'NotificationsPop',
  UploadPop = 'UploadPop',
  WatchLaterPop = 'WatchLaterPop',
}
