<script lang="ts" setup>
/**
 * 用户筛选规则表格
 * 支持添加、编辑、删除按用户名或 UID 筛选的规则
 */

import { onKeyStroke } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { settings } from '~/logic'

const { t } = useI18n()
const toast = useToast()

const addingFilter = ref<{ keyword: string, remark: string }>({ keyword: '', remark: '' })
const editingFilter = ref<{ keyword: string, remark: string }>({ keyword: '', remark: '' })
const editingIndex = ref<number>(-1) // -1: add new, >= 0: edit index
const keywordRef = ref<HTMLInputElement | null>(null)
const remarkRef = ref<HTMLInputElement | null>(null)

/** 添加新用户筛选规则，检查重复后插入到列表头部 */
function handleAddFilter() {
  if (!addingFilter.value.keyword.trim())
    return

  const hasDuplicate = settings.value.filterByUser.find(
    (item, itemIndex) => item.keyword === addingFilter.value.keyword.trim() && itemIndex !== editingIndex.value,
  )
  if (hasDuplicate) {
    toast.warning(t('settings.filter_item_already_exist'))
    return
  }
  addingFilter.value.keyword = addingFilter.value.keyword.trim()
  addingFilter.value.remark = addingFilter.value.remark.trim()
  settings.value.filterByUser.unshift({ ...addingFilter.value })
  nextTick(() => {
    handleClearAddingFilter()
  })
}

/** 清空添加筛选的输入框 */
function handleClearAddingFilter() {
  addingFilter.value = { keyword: '', remark: '' }
}

/** 进入编辑模式，复制数据到编辑变量并聚焦指定输入框 */
async function handleEditFilter(index: number, focusItem: 'keyword' | 'remark' = 'keyword') {
  editingIndex.value = index
  editingFilter.value = { ...settings.value.filterByUser[index] }
  await nextTick()

  const inputElement = focusItem === 'keyword' ? keywordRef.value : remarkRef.value
  if (Array.isArray(inputElement)) {
    inputElement[0]?.focus()
  }
  else {
    inputElement?.focus()
  }
}

/** 确认编辑，检查重复后保存修改 */
function handleConfirmFilter(index: number) {
  if (!editingFilter.value.keyword.trim())
    return

  const hasDuplicate = settings.value.filterByUser.find(
    (item, itemIndex) => item.keyword === editingFilter.value.keyword.trim() && itemIndex !== index,
  )
  if (hasDuplicate) {
    toast.warning('This title filter already exist!!!')
    return
  }
  settings.value.filterByUser[index] = { ...editingFilter.value }
  if (index !== -1)
    editingIndex.value = -1
}

/** 删除指定位置的筛选规则 */
function handleDeleteFilter(index: number) {
  settings.value.filterByUser.splice(index, 1)
}

onKeyStroke('Escape', (e: KeyboardEvent) => {
  e.preventDefault()
  editingIndex.value = -1
})
</script>

<template>
  <div>
    <div flex="~ gap-1" bg="$bew-fill-1" p-2 mb-2 rounded="$bew-radius">
      <Input
        v-model="addingFilter.keyword"
        size="small"
        :placeholder="$t('settings.filter_by_user_table.username_or_mid')"
        w-full
        @click="editingIndex = -1"
        @enter="handleAddFilter"
      />
      <Input
        v-model="addingFilter.remark"
        size="small"
        :placeholder="$t('common.table.remark')"
        w-full
        @click="editingIndex = -1"
        @enter="handleAddFilter"
      />

      <Button
        size="small" type="primary"
        shrink-0
        style="--b-button-width: 80px"
        @click="handleAddFilter"
      >
        <template #left>
          <i i-mingcute:add-line />
        </template>
        {{ $t('common.operation.add') }}
      </Button>
    </div>
    <List
      highlight-first
      pin-top
      w-full max-h-400px overflow-overlay
    >
      <ListItem min-h-44px>
        <div max-w-50px>
          {{ $t('common.table.index') }}
        </div>
        <div>{{ $t('settings.filter_by_user_table.username_or_mid') }}</div>
        <div>{{ $t('common.table.remark') }}</div>
        <div max-w-80px>
          {{ $t('common.table.operations') }}
        </div>
      </ListItem>

      <ListItem
        v-for="(item, index) in settings.filterByUser" :key="item.keyword"
        :style="{
          background: editingIndex === index ? 'var(--bew-theme-color-20) !important' : '',
        }"
      >
        <div max-w-50px>
          {{ index }}
        </div>
        <template v-if="editingIndex === index">
          <Input
            ref="keywordRef"
            v-model="editingFilter.keyword"
            size="small"
            :placeholder="$t('settings.filter_by_user_table.username_or_mid')"
            w-full
            @enter="handleConfirmFilter(index)"
          />
          <Input
            ref="remarkRef"
            v-model="editingFilter.remark"
            size="small"
            :placeholder="$t('common.table.remark')"
            w-full
            @enter="handleConfirmFilter(index)"
          />
        </template>
        <template v-else>
          <div break-anywhere @dblclick="handleEditFilter(index, 'keyword')">
            {{ item.keyword }}
          </div>
          <div break-anywhere @dblclick="handleEditFilter(index, 'remark')">
            {{ item.remark }}
          </div>
        </template>
        <div flex="~ gap-1" max-w-80px>
          <template v-if="editingIndex === index">
            <Button size="small" type="tertiary" @click="handleConfirmFilter(index)">
              <template #left>
                <i i-mingcute:check-line />
              </template>
            </Button>
            <Button size="small" type="tertiary" @click="editingIndex = -2">
              <template #left>
                <i i-mingcute:close-line />
              </template>
            </Button>
          </template>
          <template v-else>
            <Button size="small" type="tertiary" @click="handleEditFilter(index)">
              <template #left>
                <i i-mingcute:edit-2-line />
              </template>
            </Button>
            <Button size="small" type="tertiary" @click="handleDeleteFilter(index)">
              <template #left>
                <i i-mingcute:delete-2-line />
              </template>
            </Button>
          </template>
        </div>
      </ListItem>
    </List>
  </div>
</template>
