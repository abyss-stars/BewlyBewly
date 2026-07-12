/**
 * 全局事件总线
 * 基于 mitt 库创建的轻量级事件发射器，用于组件间通信。
 */
import type { Emitter } from 'mitt'
import mitt from 'mitt'

const emitter: Emitter<any> = mitt()
export default emitter
