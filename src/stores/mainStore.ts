/**
 * 主 Store
 * 管理侧边导航栏（Dock）的菜单项配置、首页 Tab 定义、以及当前激活的封面状态
 */
import { defineStore } from 'pinia'

import { HomeSubPage } from '~/contentScripts/views/Home/types'
import { AppPage } from '~/enums/appEnums'
import { getUserID } from '~/utils/main'

/** 侧边导航栏菜单项 */
export interface DockItem {
  i18nKey: string
  icon: string
  iconActivated: string
  page: AppPage
  openInNewTab: boolean
  useOriginalBiliPage: boolean
  url: string
  hasBewlyPage: boolean // Whether BewlyBewly has a page for this item
}

/** 首页顶部 Tab 标签 */
export interface HomeTab {
  i18nKey: string
  page: HomeSubPage
}

export const useMainStore = defineStore('main', () => {
  /** 侧边导航栏菜单项列表 */
  const dockItems = computed((): DockItem[] => {
    return [
      {
        i18nKey: 'dock.home',
        icon: 'i-mingcute:home-5-line',
        iconActivated: 'i-mingcute:home-5-fill',
        page: AppPage.Home,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: 'https://www.bilibili.com',
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.search',
        icon: 'i-mingcute:search-2-line',
        iconActivated: 'i-mingcute:search-2-fill',
        page: AppPage.Search,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: 'https://search.bilibili.com/all',
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.anime',
        icon: 'i-mingcute:tv-2-line',
        iconActivated: 'i-mingcute:tv-2-fill',
        page: AppPage.Anime,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: 'https://www.bilibili.com/anime',
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.favorites',
        icon: 'i-mingcute:star-line',
        iconActivated: 'i-mingcute:star-fill',
        page: AppPage.Favorites,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: `https://space.bilibili.com/${getUserID()}/favlist`,
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.history',
        icon: 'i-mingcute:time-line',
        iconActivated: 'i-mingcute:time-fill',
        page: AppPage.History,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: `https://www.bilibili.com/history`,
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.watch_later',
        icon: 'i-mingcute:carplay-line',
        iconActivated: 'i-mingcute:carplay-fill',
        page: AppPage.WatchLater,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: `https://www.bilibili.com/watchlater/list`,
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.moments',
        icon: 'i-tabler:windmill',
        iconActivated: 'i-tabler:windmill-filled',
        page: AppPage.Moments,
        openInNewTab: false,
        useOriginalBiliPage: true,
        url: `https://t.bilibili.com`,
        hasBewlyPage: false,
      },
    ]
  })

  /** 首页顶部 Tab 标签列表（只读） */
  const homeTabs = shallowReadonly<HomeTab[]>(
    [
      {
        i18nKey: 'home.for_you',
        page: HomeSubPage.ForYou,
      },
      {
        i18nKey: 'home.following',
        page: HomeSubPage.Following,
      },
      {
        i18nKey: 'home.subscribed_series',
        page: HomeSubPage.SubscribedSeries,
      },
      {
        i18nKey: 'home.trending',
        page: HomeSubPage.Trending,
      },
      {
        i18nKey: 'home.ranking',
        page: HomeSubPage.Ranking,
      },
      {
        i18nKey: 'home.live',
        page: HomeSubPage.Live,
      },
    ],
  )

  /** 当前激活的封面图片 URL */
  const activatedCover = ref<string>('')

  /** 根据页面枚举获取对应的 B 站原始 URL */
  function getBiliWebPageURLByPage(page: AppPage): string {
    const dockItem = dockItems.value.find(e => e.page === page)
    return dockItem?.url || ''
  }

  /** 根据页面枚举获取对应的导航菜单项 */
  function getDockItemByPage(page: AppPage): DockItem | undefined {
    return dockItems.value.find(e => e.page === page)
  }

  /** 设置当前激活的封面（在下一帧更新，避免布局抖动） */
  function setActivatedCover(cover: string) {
    requestAnimationFrame(() => {
      activatedCover.value = cover
    })
  }

  /** 获取当前激活的封面 URL */
  function getActivatedCover(): string {
    return activatedCover.value
  }

  return { dockItems, homeTabs, getBiliWebPageURLByPage, getDockItemByPage, setActivatedCover, getActivatedCover }
})
