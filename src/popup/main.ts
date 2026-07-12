/**
 * 弹出页入口文件
 * 创建 Vue 应用实例，挂载 Popup 组件到 #app
 */
import { createApp } from 'vue'

import App from './Popup.vue'

import '../styles'

/** 创建并挂载 Vue 应用 */
const app = createApp(App)
app.mount('#app')
