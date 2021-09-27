<template>
  <n-card :title="title">
    <n-space>
      <div
        v-for="(item, index) in list"
        :class="
          'flex items-center rounded-full border-2 ' +
          getColorByRate(item.rate).border
        "
        :key="item.id + index"
      >
        <GenshinIcon :id="item.id" :name="item.name" :type="item.type" />
        <span class="mx-2">{{ item.name }}</span>
        <span
          v-if="item.note"
          :class="
            'pl-1 pr-2 border-l-2 text-xs ' + getColorByRate(item.rate).text
          "
          >{{ item.note }}</span
        >
      </div>
    </n-space>
  </n-card>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GachaListCard'
})
</script>

<script setup lang="ts">
import { defineComponent, defineProps } from 'vue'
import { NCard, NSpace } from 'naive-ui'
import GenshinIcon from './GenshinIcon.vue'
import { ListItem } from './GachaListCard'

const props = defineProps<{
  title: string
  list: ListItem[]
}>()

function getColorByRate(rate?: '5' | '4' | '3') {
  const color = {
    border: 'border-white',
    text: 'text-black'
  }
  switch (rate) {
    case '5':
      color.border = 'border-rate5-gold'
      color.text = 'text-rate5-gold'
      break
    case '4':
      color.border = 'border-rate4-purple'
      color.text = 'text-rate4-purple'
      break
    case '3':
      color.border = 'border-rate3-blue'
      color.text = 'text-rate3-blue'
      break
  }
  return color
}
</script>

<style scoped></style>
