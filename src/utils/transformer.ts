/**
 * CSS 变换器 (Transformer)
 * 将 CSS transform 转换为 top/left 定位样式，便于在非 Chromium 环境使用。
 * 通过监听元素可见性和 DOM 挂载状态，动态更新定位样式。
 */
import type { MaybeElement } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import { unrefElement, useElementVisibility } from '@vueuse/core'

/** 居中配置 */
interface TransformerCenter {
  x?: boolean
  y?: boolean
}

/** 变换器参数 */
export interface Transformer {
  x: number | string
  y: number | string
  centerTarget?: TransformerCenter
  notrigger?: boolean
}

/**
 * 创建变换器，将 transform 属性转换为 top/left 定位
 * 适用于非 Chromium 或不支持 CSS transform 的环境
 * @param trigger - 触发器元素引用
 * @param transformer - 变换参数（x/y 偏移和居中选项）
 * @returns 目标元素的模板引用
 */
export function createTransformer(trigger: Ref<MaybeElement>, transformer: Transformer) {
  const target = ref<MaybeElement>()
  const style = ref<CSSProperties>({})

  // 当 trigger 元素变化时，如果不使用 trigger 则直接赋值 target
  watch(trigger, () => {
    if (transformer.notrigger) {
      target.value = unrefElement(trigger)
    }
  }, { immediate: true })

  /** 根据 transformer 参数计算并更新 style（top/left 定位值） */
  function update() {
    let x = '0px'
    let y = '0px'

    if (typeof transformer.x === 'number') {
      x = `${transformer.x}px`
    }
    else {
      x = transformer.x
    }

    if (typeof transformer.y === 'number') {
      y = `${transformer.y}px`
    }
    else {
      y = transformer.y
    }

    // 如果需要居中，使用 calc 减去目标元素一半宽/高
    if (target.value && transformer.centerTarget) {
      const el = unrefElement(target.value)
      const targetRect = el!.getBoundingClientRect()

      if (transformer.centerTarget.x) {
        x = `calc(${transformer.x} - ${targetRect.width / 2}px)`
      }

      if (transformer.centerTarget.y) {
        y = `calc(${transformer.y} - ${targetRect.height / 2}px)`
      }
    }

    style.value = {
      transform: 'none !important',
      top: y,
      left: x,
    }

    //   // nothing, use inherit transform
    //   style.value = {
    //     transform: `translate3d(${x}, ${y}, 0) !important`,
    //   }
  }

  /** 将 style 对象合并到已有的 style 字符串中 */
  function generateStyle(originStyle: string | undefined | null): string {
    const s = (originStyle || '')
      .split(';')
      .map((item) => {
        const [key, value] = item.split(':').map(item => item.trim())

        if (!key || !value) {
          return {}
        }

        return {
          [key]: value,
        }
      })
      .reduce((acc, item) => {
        return {
          ...acc,
          ...item,
        }
      }, {})

    for (const key in style.value) {
      // @ts-expect-error ignore
      s[key] = style.value[key]
    }

    return Object.keys(s).map(key => `${key}:${s[key]}`).join(';')
  }

  // 监听目标元素可见性（v-show 切换触发），可见时重新计算位置
  const targetVisibility = useElementVisibility(() => unrefElement(target))
  watch(targetVisibility, (visible) => {
    if (visible) {
      const targetElement = unrefElement(target)
      if (targetElement) {
        update()
        const style = targetElement.getAttribute('style')
        targetElement.setAttribute('style', generateStyle(style))
      }
    }
  }, { flush: 'pre' })

  // 监听目标元素挂载（v-if 切换触发），挂载后重新计算位置
  watch(() => unrefElement(target), (targetElement) => {
    if (targetElement) {
      update()
      const style = targetElement.getAttribute('style')
      targetElement.setAttribute('style', generateStyle(style))
    }
  }, { flush: 'pre' })

  return target
}
