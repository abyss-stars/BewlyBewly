/**
 * 设置页面类型定义
 * 定义设置菜单项和 Bewly 页面的枚举与接口
 */

/** 设置菜单类型 */
export enum MenuType {
  General = 'General',
  DesktopAndDock = 'DesktopAndDock',
  Appearance = 'Appearance',
  BewlyPages = 'BewlyPages',
  Compatibility = 'Compatibility',
  BilibiliSettings = 'BilibiliSettings',
  About = 'About',
}

export enum BewlyPage {
  Home = 'Home',
  Search = 'Search',
}

export interface MenuItem {
  value: MenuType
  title: string
  icon: string
  iconActivated: string
}
