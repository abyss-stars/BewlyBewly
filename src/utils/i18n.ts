/**
 * 国际化 (i18n) 配置
 * 创建 Vue I18n 实例，默认语言为英文，支持全局注入。
 */
import messages from '@intlify/unplugin-vue-i18n/messages'
import { createI18n } from 'vue-i18n'

/** Vue I18n 实例，使用 legacy API 模式以便通过全局属性访问 */
export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages,
})
