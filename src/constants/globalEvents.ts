/**
 * 全局自定义事件常量
 * 定义 BewlyBewly 扩展中使用的所有自定义事件名称，用于跨组件通信
 */

/** 顶部栏可见性变化事件 */
export const TOP_BAR_VISIBILITY_CHANGE = 'topBarVisibilityChange'
/** 自定义滚动条滚动事件 */
export const OVERLAY_SCROLL_BAR_SCROLL = 'overlayScrollBarScroll'
/** BewlyBewly 挂载完成事件 */
export const BEWLY_MOUNTED = 'bewlyMounted'
/** 抽屉视频进入全页模式事件 */
export const DRAWER_VIDEO_ENTER_PAGE_FULL = 'drawerVideoEnterPageFull'
/** 抽屉视频退出全页模式事件 */
export const DRAWER_VIDEO_EXIT_PAGE_FULL = 'drawerVideoExitPageFull'
/** iframe 页面切换到 BewlyBewly 视图事件 */
export const IFRAME_PAGE_SWITCH_BEWLY = 'iframePageSwitchBewly'
/** iframe 页面切换到 Bilibili 原始视图事件 */
export const IFRAME_PAGE_SWITCH_BILI = 'iframePageSwitchBili'
