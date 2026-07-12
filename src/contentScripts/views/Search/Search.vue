<script lang="ts" setup>
/**
 * 搜索页面组件。
 * 居中展示 Logo 和搜索栏，支持自定义壁纸和毛玻璃效果。
 */
import { settings } from '~/logic'
</script>

<template>
  <div
    flex="~ col"
    justify-center
    items-center
    w-full z-10
    m="t-20vh"
  >
    <Logo
      v-if="settings.searchPageShowLogo" :size="180" :color="settings.searchPageLogoColor === 'white' ? 'white' : 'var(--bew-theme-color)'"
      :glow="settings.searchPageLogoGlow"
      mb-12 z-1
    />
    <SearchBar
      :darken-on-focus="settings.searchPageDarkenOnSearchFocus"
      :blurred-on-focus="settings.searchPageBlurredOnSearchFocus"
      :focused-character="settings.searchPageSearchBarFocusCharacter"
    />
  </div>
</template>
