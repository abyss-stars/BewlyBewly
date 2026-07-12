// 异步加载 OverlayScrollbars 组件，避免初始加载时的性能开销
import 'overlayscrollbars/overlayscrollbars.css'

export default defineAsyncComponent(async () => {
  const { OverlayScrollbarsComponent } = await import('overlayscrollbars-vue')
  return OverlayScrollbarsComponent
})
