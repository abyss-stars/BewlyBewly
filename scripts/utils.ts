/**
 * 构建脚本通用工具
 * 提供路径解析、环境检测和日志输出等工具函数
 */
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { bgCyan, black } from 'kolorist'

/** 开发服务器端口 */
export const port = Number.parseInt(process.env.PORT || '') || 3303
/** 相对于项目根目录的路径解析函数 */
export const r = (...args: string[]) => resolve(dirname(fileURLToPath(import.meta.url)), '..', ...args)
/** 是否为开发模式 */
export const isDev = process.env.NODE_ENV !== 'production'
/** 是否为 Windows 平台 */
export const isWin = process.platform === 'win32'
/** 是否为 Firefox 构建目标 */
export const isFirefox = process.env.FIREFOX === 'true'
/** 是否为 Safari 构建目标 */
export const isSafari = process.env.SAFARI === 'true'

/** 输出带前缀标签的彩色日志 */
export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message)
}
