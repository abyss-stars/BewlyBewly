<script lang="ts" setup>
// 视频作者名称组件，支持单人作者和联合投稿显示
import type { Author } from '../../types'

import { getAuthorJumpUrl } from '~/components/VideoCard/utils'

defineProps<{
  author?: Author | Author[]
}>()
</script>

<template>
  <a
    class="channel-name"
    un-text="hover:$bew-text-1"
    cursor-pointer mr-4
    :href="getAuthorJumpUrl(Array.isArray(author) ? author[0] : author)"
    target="_blank"
    @click.stop=""
  >
    <span>
      <span v-if="Array.isArray(author) && author.length > 1">
        {{ $t('video_card.group_contribution', { firstAuthor: author[0].name, num: author.length }) }}
      </span>
      <span v-else>
        {{ Array.isArray(author) ? author[0].name : author?.name }}
      </span>
    </span>
  </a>
</template>
