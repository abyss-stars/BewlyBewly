/**
 * 本地存储封装 Composable
 * 基于 VueUse 的 useStorageAsync 封装浏览器扩展的本地存储 API，
 * 提供响应式的持久化键值存储功能。
 */
import type {
  RemovableRef,
  StorageLikeAsync,
  UseStorageAsyncOptions,
} from '@vueuse/core'
import type { MaybeRef } from 'vue'
import {
  useStorageAsync,
} from '@vueuse/core'
import { storage } from 'webextension-polyfill'

/** 适配 webextension-polyfill storage.local API 为 VueUse 的 StorageLikeAsync 接口 */
const storageLocal: StorageLikeAsync = {
  removeItem(key: string) {
    return storage.local.remove(key)
  },

  setItem(key: string, value: string) {
    return storage.local.set({ [key]: value })
  },

  async getItem(key: string) {
    return (await storage.local.get(key))[key]
  },
}

/**
 * 创建响应式的本地存储变量
 * @param key - 存储键名
 * @param initialValue - 初始值
 * @param options - VueUse StorageAsync 配置项（如 mergeDefaults）
 * @returns 可移除的响应式引用
 */
export function useStorageLocal<T>(key: string, initialValue: MaybeRef<T>, options?: UseStorageAsyncOptions<T>): RemovableRef<T> {
  return useStorageAsync(key, initialValue, storageLocal, options)
}
