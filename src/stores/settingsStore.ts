/**
 * 设置 Store
 * 管理用户的自定义设置，主要是侧边导航栏各菜单项的显示/隐藏配置
 */
import type { AppPage } from '~/enums/appEnums'

import { defineStore } from 'pinia'
import { settings } from '~/logic'

/** 单个导航菜单项的配置 */
export interface DockItemConfig {
  page: AppPage
  visible: boolean
  openInNewTab: boolean
  useOriginalBiliPage: boolean
}

export const useSettingsStore = defineStore('settings', () => {
  /** 根据页面枚举获取对应导航项的配置 */
  function getDockItemConfigByPage(page: AppPage): DockItemConfig | undefined {
    return settings.value.dockItemsConfig.find(e => e.page === page)
  }

  /** 判断指定页面是否使用 B 站原始页面（而非 BewlyBewly 自定义页面） */
  function getDockItemIsUseOriginalBiliPage(page: AppPage): boolean {
    return settings.value.dockItemsConfig.find(e => e.page === page)?.useOriginalBiliPage || false
  }

  return { getDockItemConfigByPage, getDockItemIsUseOriginalBiliPage }
})
