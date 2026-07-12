/**
 * Bewly App 全局上下文注入
 * 通过 Vue 的 provide/inject 机制向子组件提供全局应用实例的接口。
 * 包括页面激活状态、滚动条引用、回到顶部等功能。
 */
import type { Ref } from 'vue'

import type { AppPage } from '~/enums/appEnums'

/** Bewly 应用提供者接口，定义所有全局可用的属性和方法 */
export interface BewlyAppProvider {
  activatedPage: Ref<AppPage>
  scrollbarRef: Ref<any>
  reachTop: Ref<boolean>
  mainAppRef: Ref<HTMLElement>
  handleReachBottom: Ref<(() => void) | undefined>
  handlePageRefresh: Ref<(() => void) | undefined>
  handleBackToTop: (targetScrollTop?: number) => void
  haveScrollbar: () => Promise<boolean>
  openIframeDrawer: (url: string) => void
}

/**
 * 获取 Bewly 应用全局上下文
 * 在开发环境下，如果未提供 AppProvider 则会抛出错误
 */
export function useBewlyApp(): BewlyAppProvider {
  const provider = inject<BewlyAppProvider>('BEWLY_APP')

  if (import.meta.env.DEV && !provider)
    throw new Error('AppProvider is not injected')

  return provider!
}
