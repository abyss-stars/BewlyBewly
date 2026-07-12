/**
 * DOM 元素工具
 * 处理 Shadow DOM 中的元素查找，递归穿透多层 Shadow Root 找到真正的活动元素。
 */

/** 获取元素的 Shadow Root */
export function getShadowRoot(v: Element) {
  if (v.shadowRoot)
    return v.shadowRoot
}

/**
 * 递归查找 Shadow DOM 中最深层的活动元素
 * 当元素包含 Shadow Root 时，继续深入查找，直到找到没有 Shadow Root 的活动元素
 * @param doc - Document 或 ShadowRoot 对象
 * @returns 最终层的活动元素，若没有则返回 undefined
 */
export function findLeafActiveElement(doc: DocumentOrShadowRoot): Element | undefined {
  const active = doc?.activeElement
  if (!active)
    return

  const shadowRoot = getShadowRoot(active)
  if (shadowRoot && shadowRoot.activeElement)
    return findLeafActiveElement(shadowRoot)

  return active
}
