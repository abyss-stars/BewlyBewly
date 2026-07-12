// 组件自动注册入口，使用 import.meta.glob 扫描所有 .vue 组件并批量注册
import type { App, Plugin } from 'vue'

const paths: Record<string, { default: Component }> = import.meta.glob(['./*/*.vue', './*.vue', './OverlayScrollbarsComponent.ts'], { eager: true })

export default {
  install: (app: App) => {
    // 遍历所有匹配到的组件文件，自动注册到 Vue 应用中
    for (const path in paths) {
      const splitPath = path.split('/')
      const name = splitPath[splitPath.length - 1].replace('.vue', '').replace('.ts', '')
      app.component(name, paths[path].default)
    }
  },
} as Plugin
