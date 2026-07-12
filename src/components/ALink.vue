// 自定义链接组件，根据用户设置控制链接的打开方式（新标签页/当前页/抽屉）
<script lang="ts" setup>
import { useBewlyApp } from '~/composables/useAppProvider'
import { settings } from '~/logic'
import { isHomePage } from '~/utils/main'

const props = withDefaults(defineProps<{
  href?: string
  title?: string
  rel?: string
  type: 'topBar' | 'videoCard'
  customClickEvent?: boolean
}>(), {
  href: '',
})

const emit = defineEmits<{
  (e: 'click', value: MouseEvent): void
}>()

const { openIframeDrawer } = useBewlyApp()

// 根据链接类型获取对应的打开模式设置
const openMode = computed(() => {
  if (props.type === 'topBar')
    return settings.value.topBarLinkOpenMode
  else if (props.type === 'videoCard')
    return settings.value.videoCardLinkOpenMode
  return 'newTab'
})

// Since BewlyBewly sometimes uses an iframe to open the original Bilibili page in the current tab
// please set the target to `_top` instead of `_self`
// 根据打开模式计算链接的 target 属性
const target = computed(() => {
  if (openMode.value === 'newTab') {
    return '_blank'
  }
  if (openMode.value === 'currentTabIfNotHomepage') {
    return isHomePage() ? '_blank' : '_top'
  }
  if (openMode.value === 'currentTab') {
    return '_top'
  }
  return '_top'
})

// 处理点击事件：组合键时走浏览器默认行为，自定义事件或抽屉模式时拦截
function handleClick(event: MouseEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey)
    return

  if (props.customClickEvent) {
    event.preventDefault()
    emit('click', event)
    return
  }

  if (openMode.value === 'drawer') {
    event.preventDefault()
    openIframeDrawer(props.href)
  }
}
</script>

<template>
  <a :href="href" :target="target" :title="title" :rel="rel" @click="handleClick">
    <slot />
  </a>
</template>
