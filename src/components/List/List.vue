<script setup lang="ts">
// 列表容器组件，支持首项高亮和首项置顶
withDefaults(defineProps<{
  highlightFirst?: boolean
  pinTop?: boolean
}>(), {
  highlightFirst: false,
})
</script>

<template>
  <div
    class="b-list"
    :class="{ 'highlight-first': highlightFirst, 'pin-top': pinTop }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.b-list {
  &.highlight-first :deep(.b-list-item:first-child) {
    --uno: "!bg-$bew-fill-2 !font-bold";
  }

  &.pin-top :deep(.b-list-item:first-child) {
    --uno: "sticky top-0 z-1";
  }
}
</style>
