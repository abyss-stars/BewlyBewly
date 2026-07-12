/**
 * 定时器工具
 * 按指定间隔重复执行函数指定次数。
 */

/**
 * 按固定间隔重复执行函数指定次数
 * @param fn - 要执行的函数（支持同步或异步）
 * @param times - 执行次数
 * @param interval - 执行间隔（毫秒），默认 1000ms
 * @returns 定时器 ID，可用于取消
 */
export function executeTimes(fn: () => void | Promise<void>, times: number, interval: number = 1000) {
  let count = 0
  let timer: NodeJS.Timeout
  // eslint-disable-next-line prefer-const
  timer = setInterval(async () => {
    await fn()
    count++
    if (count >= times) {
      clearInterval(timer)
    }
  }, interval)

  return timer
}
