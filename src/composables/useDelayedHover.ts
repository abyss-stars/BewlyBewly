/**
 * 延迟悬停 Composable
 * 为元素添加延迟触发鼠标悬停/离开事件的功能，避免快速划过时频繁触发。
 * 触摸屏优化模式下自动禁用。
 */
import { settings } from '~/logic'

/**
 * 为元素绑定延迟悬停事件
 * @param options - 配置项
 * @param options.enterDelay - 鼠标进入延迟（毫秒），默认 300
 * @param options.leaveDelay - 鼠标离开延迟（毫秒），默认 300
 * @param options.beforeEnter - 进入前回调
 * @param options.enter - 进入时回调（延迟后触发）
 * @param options.beforeLeave - 离开前回调
 * @param options.leave - 离开时回调（延迟后触发）
 * @returns 模板引用，绑定到目标元素
 */
export function useDelayedHover({ enterDelay = 300, leaveDelay = 300, beforeEnter, enter, beforeLeave, leave }:
{ enterDelay?: number, leaveDelay?: number, beforeEnter?: (...args: any[]) => any, enter: (...args: any[]) => any, beforeLeave?: (...args: any[]) => any, leave: (...args: any[]) => any }) {
  const el = ref<HTMLElement>()

  let enterTimer: any | undefined
  let leaveTimer: any | undefined

  function handleMouseEnter() {
    if (beforeEnter)
      beforeEnter()

    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    enterTimer = setTimeout(() => {
      enter()
    }, enterDelay)
  }
  function handleMouseLeave() {
    if (beforeLeave)
      beforeLeave()

    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    leaveTimer = setTimeout(() => {
      leave()
    }, leaveDelay)
  }

  watch(el, (el, _, onCleanup) => {
    if (el) {
      if (!settings.value.touchScreenOptimization) {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      }
    }

    onCleanup(() => {
      if (el) {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      }
    })
  }, { flush: 'post' })

  watch(() => settings.value.touchScreenOptimization, (newValue) => {
    if (newValue) {
      el.value?.removeEventListener('mouseenter', handleMouseEnter)
      el.value?.removeEventListener('mouseleave', handleMouseLeave)
    }
    else {
      el.value?.addEventListener('mouseenter', handleMouseEnter)
      el.value?.addEventListener('mouseleave', handleMouseLeave)
    }
  }, { immediate: true })

  return el
}
