<template>
  <div>
    <div
      :class="`
        no-drag
        ${validGachaLog === '' ? 'cursor-not-allowed' : 'cursor-pointer'}
        box-content
        w-80
        h-20
        pr-4
        flex-none
        rounded-full
        flex
        relative
        border-2 ${
          validGachaLog === undefined
            ? null
            : validGachaLog === ''
            ? 'border-warning'
            : 'border-success'
        }
        ${
          validGachaLog === undefined
            ? 'shadow-md'
            : validGachaLog === ''
            ? 'shadow-warning hover:shadow-warning-strong'
            : 'shadow-success hover:shadow-success-strong'
        }
        bg-white bg-opacity-40
        hover:bg-opacity-60
      `"
      @click="emit('clickOnClient')"
      @mouseenter="launcher && (logo = logoLaunch)"
      @mouseleave="logo = logoDefault"
    >
      <img
        :src="logo"
        alt="Genshin Impack logo"
        class="h-20 rounded-full object-cover"
      />
      <div class="my-3 mx-4">
        <h3 class="whitespace-nowrap">
          <span class="text-base font-bold">{{ title }}</span>
          <span class="text-xs mx-1">v{{ version }}</span>
          <span
            class="
              float-right
              text-xs
              px-1
              bg-green-500
              text-white
              rounded-sm
              ring ring-green-500 ring-opacity-50
            "
            v-if="international"
            >国际服</span
          >
        </h3>
        <p class="text-xs overflow-elision-2 text-gray-400">{{ gamePath }}</p>
      </div>
    </div>
    <div class="mt-6 w-72 mx-auto">
      <n-alert type="warning" v-if="validGachaLog === ''">
        未找到有效的日志文件或日志文件中没有祈愿记录页面地址
        <strong class="no-drag cursor-pointer" @click="emit('recheck')">
          <u>重新检查</u>
        </strong>
      </n-alert>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GenshinClientCard'
})
</script>

<script setup lang="ts">
import {
  defineComponent,
  defineEmits,
  defineProps,
  ref,
  withDefaults
} from 'vue'
import { NAlert } from 'naive-ui'
import logoDefault from '/@/assets/Genshin_Impact.jpg'
import logoLaunch from '/@/assets/Genshin_Impact_Launch.png'

const props = withDefaults(
  defineProps<{
    title?: string
    version: string
    launcherPath: string
    gamePath: string
    international?: boolean
    validGachaLog?: string
    launcher?: boolean
  }>(),
  {
    title: '原神',
    international: false,
    validGachaLog: undefined,
    launcher: false
  }
)

const logo = ref<string>(logoDefault)

const emit = defineEmits(['recheck', 'clickOnClient'])
</script>

<style scoped>
.overflow-elision-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
