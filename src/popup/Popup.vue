<script setup lang="ts">
/**
 * 弹出页组件
 * 点击扩展图标时显示的弹出窗口，可快速打开选项页
 */
import Logo from '~/components/Logo.vue'
import { storageDemo } from '~/logic/storage'

/** 打开扩展的选项页 */
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:+</span> {{ storageDemo }}
    </div>
  </main>
</template>
