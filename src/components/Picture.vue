<script setup lang="ts">
// 图片组件，自动生成 avif 和 webp 格式的备用源，提供现代图片格式支持
defineProps<{
  src: string
  loading: 'lazy' | 'eager'
  alt?: string
}>()
</script>

<template>
  <picture>
    <source :srcset="`${src}.avif`" type="image/avif">
    <source :srcset="`${src}.webp`" type="image/webp">
    <img
      :src="src"
      :loading="loading"
      :alt="alt"
      block w-full h-full object="[inherit]" aspect-inherit
      rounded-inherit
    >
  </picture>
</template>
