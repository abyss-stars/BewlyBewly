<script setup lang="ts">
// 进度条组件，根据百分比显示进度，支持自定义颜色和高度
interface Props {
  percentage: number
  color?: string
  height?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--bew-theme-color)',
})
</script>

<template>
  <div
    h="6px"
    rounded="$bew-radius"
    :style="{
      width: `${percentage}%`,
      backgroundColor: props.color,
      height:
        typeof props.height === 'number' ? `${props.height}px` : props.height,
    }"
  />
</template>

<style lang="scss" scoped></style>
