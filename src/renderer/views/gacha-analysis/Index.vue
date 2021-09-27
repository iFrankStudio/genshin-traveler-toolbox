<template>
  <div class="w-full h-full p-12">
    <header>
      <h2 class="text-xl font-bold inline-block">祈愿记录分析</h2>
      <n-spin v-if="loading" size="medium" />
      <nav v-if="!loading" class="mt-6 flex justify-evenly">
        <div v-for="tab in tabs" :key="tab.name" class="w-full">
          <button
            :name="tab.name"
            :class="`no-drag block mx-auto text-base leading-loose ${
              $route.path === tab.routePath ? 'nav-active' : null
            }`"
            @click="
              $router.replace({
                path: tab.routePath,
                query: $route.query
              })
            "
          >
            {{ tab.title }}
          </button>
        </div>
      </nav>
    </header>
    <main class="h-5/6">
      <suspense>
        <router-view v-if="!loading" v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </suspense>
    </main>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GachaAnalysisPage'
})
</script>

<script setup lang="ts">
import { defineComponent, ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { NSpin, useDialog } from 'naive-ui'
import { useGacha } from '/@/composables'

const router = useRouter()
const dialog = useDialog()

const tabs = [
  {
    name: 'character event',
    title: '角色活动祈愿',
    routePath: '/gacha/analysis/character-event'
  },
  {
    name: 'weapon event',
    title: '武器活动祈愿',
    routePath: '/gacha/analysis/weapon-event'
  },
  {
    name: 'overview',
    title: '总览',
    routePath: '/gacha/analysis/overview'
  },
  {
    name: 'permanent',
    title: '常驻祈愿',
    routePath: '/gacha/analysis/permanent'
  },
  {
    name: 'novice',
    title: '新手祈愿',
    routePath: '/gacha/analysis/novice'
  }
]

const loading = ref(true)

onMounted(async () => {
  try {
    await useGacha().updateWishes()
    loading.value = false
  } catch (e) {
    console.error(e)
    dialog.error({
      title: '获取数据失败',
      content: () => [
        '数据接口已过期，请进入游戏刷新祈愿记录页面地址后重试。',
        h('br')
      ],
      positiveText: '返回',
      maskClosable: false,
      closable: false,
      onPositiveClick: () => {
        router.back()
      }
    })
  }
})
</script>

<style scoped>
.nav-active {
  font-weight: bold;
  border-bottom: 3px #f59e0b solid;
}
</style>
