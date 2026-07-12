/**
 * 通用 Vue 应用设置
 * 初始化 Pinia、国际化、Toast 通知、组件注册等插件。
 * 适用于 popup、选项页和 content-script 等多种上下文。
 */
import type { App } from 'vue'

import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import { getCurrentContext } from 'webext-bridge'
import components from '~/components'

import { i18n } from '~/utils/i18n'
import 'vue-toastification/dist/index.css'

const pinia = createPinia()

/**
 * 为 Vue 应用安装所有必要的插件
 * @param app - Vue 应用实例
 */
export async function setupApp(app: App) {
  const context = getCurrentContext()

  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = { context }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Here you can install additional plugins for all contexts: popup, options page and content-script.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)
  app.use(i18n) // 国际化
  app
    .use(Toast, { // Toast 通知插件
      transition: 'Vue-Toastification__fade',
      maxToasts: 20,
      newestOnTop: true,
      position: POSITION.TOP_RIGHT,
    })
  app.use(components) // 全局组件注册
  app.use(pinia) // 状态管理
}
