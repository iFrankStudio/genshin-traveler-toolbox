<template>
  <n-avatar
    round
    size="small"
    style="--size: 1.6em"
    :src="img"
    :color="bgColor"
    @error="setDefaultAvatar"
  />
</template>

<script lang="ts">
export default defineComponent({
  name: 'GenshinIcon'
})
</script>

<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue'
import { NAvatar } from 'naive-ui'
import { useService } from '/@/composables'
import HilichurlAvatar from '/@/assets/Hilichurl_Author_我叫南瓜_Pumpkin.png'

const { getPublicPath } = useService<'AppService'>('AppService')

const props = defineProps<{
  id: string
  name?: string
  type: 'character' | 'weapon'
  bgColor?: string
}>()

function toEntityType(type: string) {
  switch (type) {
    case 'character':
      return 'characters'
    case 'weapon':
      return 'weapons'
  }
  return type
}

const img = ref(
  await getPublicPath(`images/${toEntityType(props.type)}/${props.id}/icon`)
)
const setDefaultAvatar = () => {
  img.value = HilichurlAvatar
}
</script>
