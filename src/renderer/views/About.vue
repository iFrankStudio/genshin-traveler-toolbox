<template>
  <div class="w-full h-full px-10 pt-10 pb-5 flex flex-col">
    <header class="mx-auto my-2 flex justify-center">
      <img :src="logo" alt="logo" width="60" />
      <div class="mx-4 my-auto">
        <h1 class="text-3xl">旅行者工具箱</h1>
        <a
          href="#"
          class="no-drag"
          @click="
            open('https://github.com/iFrankStudio/genshin-traveler-toolbox')
          "
        >
          <n-icon class="mr-1 align-middle">
            <Github />
          </n-icon>
          iFrankStudio/genshin-traveler-toolbox
        </a>
      </div>
    </header>
    <main class="max-w-md mx-auto flex-grow flex flex-col justify-evenly">
      <p class="my-1 text-center">
        当前版本：v{{ version }} |
        <a
          href="#"
          class="no-drag"
          @click="
            open(
              'https://github.com/iFrankStudio/genshin-traveler-toolbox/releases'
            )
          "
        >
          更新记录
        </a>
      </p>
      <div
        class="no-drag max-h-28 overflow-auto hide-scrollbar"
        v-if="
          updateState === 'update-available' ||
          updateState === 'downloading' ||
          updateState === 'downloaded'
        "
      >
        <h2 class="font-bold">*新版本：{{ toVersionString(updateInfo) }}</h2>
        <div class="prose-sm" v-html="updateInfo?.releaseNotes" />
      </div>
      <div class="text-center">
        <template v-if="updateState === 'init'">
          <n-button
            class="w-60 mx-auto my-2"
            type="primary"
            @click="updater.check()"
          >
            检查更新
          </n-button>
        </template>
        <template v-else-if="updateState === 'checking'">
          <n-button class="w-60 mx-auto my-2" disabled>正在获取更新</n-button>
        </template>
        <template v-else-if="updateState === 'update-not-available'">
          <n-button class="w-60 mx-auto my-2" @click="updater.check()">
            当前软件已是最新版本
          </n-button>
        </template>
        <template v-else-if="updateState === 'update-available'">
          <n-button
            class="w-60 mx-auto my-2"
            @click="updater.download"
            type="success"
          >
            升级
          </n-button>
        </template>
        <template v-else-if="updateState === 'downloading'">
          <n-progress
            type="line"
            :percentage="downloadPercent"
            :indicator-placement="'inside'"
            processing
          />
        </template>
        <template v-else-if="updateState === 'downloaded'">
          <n-button
            class="w-60 mx-auto my-2"
            type="info"
            @click="updater.install"
          >
            安装
          </n-button>
        </template>
      </div>
    </main>
    <footer class="flex justify-around">
      <span
        class="
          no-drag
          underline
          cursor-pointer
          text-gray-500
          hover:text-gray-800
        "
        @click="showCredits = true"
      >
        记仇本
      </span>
      <span
        class="
          no-drag
          underline
          cursor-pointer
          text-gray-500
          hover:text-gray-800
        "
        @click="showLicense = true"
      >
        License
      </span>
    </footer>
    <n-modal v-model:show="showCredits">
      <n-card
        id="credits-card"
        class="no-drag w-4/5 h-full"
        title="记仇本"
        :bordered="false"
        size="small"
        closable
        @close="showCredits = false"
      >
        <n-list>
          <template #header>
            <p class="text-xs text-gray-400">旅行者们对我做过很多事，比如...</p>
          </template>
          <template #footer>
            <p class="text-xs text-gray-400 text-right">这些仇，我都记下了！</p>
          </template>
          <n-list-item>
            <template #prefix>
              <a href="#" @click="open('https://weibo.com/u/5991550266')">
                <n-icon class="mr-1 align-middle"> <Weibo /> </n-icon>
                我叫南瓜_Pumpkin
              </a>
            </template>
            授权使用「丘丘人」logo图片
            <template #suffix>
              <a
                href="#"
                @click="open('https://weibo.com/5991550266/KtqXNc5nh')"
              >
                原图
              </a>
            </template>
          </n-list-item>
        </n-list>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showLicense">
      <n-card
        id="license-card"
        class="no-drag w-4/5 h-full"
        title="License"
        :bordered="false"
        size="small"
        closable
        @close="showLicense = false"
      >
        <n-list>
          <template #header>
            <p class="text-xs text-gray-400">
              此项目使用MIT协议发布<br />
              基于
              <a href="#" @click="open('https://www.electronjs.org/')">
                Electron
              </a>
              以及包括但不限于以下开源项目
            </p>
          </template>
          <template #footer>
            <p class="text-xs text-gray-400 text-right">
              「原神®」、「GENSHIN®」、「GENSHIN
              IMPACT®」及原神相关图片素材版权<br />
              由
              <a
                class="font-bold"
                href="#"
                @click="open('https://www.mihoyo.com/')"
              >
                上海米哈游网络科技股份有限公司
              </a>
              所有
            </p>
          </template>
          <n-list-item v-for="project in projects" :key="project.text">
            <a href="#" @click="open(project.link)">
              {{ project.text }}
            </a>
            <template #suffix v-if="project.note">
              {{ project.note }}
            </template>
          </n-list-item>
        </n-list>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'AboutPage'
})
</script>

<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import {
  useMessage,
  NProgress,
  NButton,
  NCard,
  NIcon,
  NModal,
  NList,
  NListItem
} from 'naive-ui'
import { Github, Weibo } from '@vicons/fa'
import { useService, useUpdater, useShell } from '/@/composables'
import logo from '/@/assets/logo.png'
import { UpdateInfo } from 'electron-updater'

const { getBasicInformation } = useService<'AppService'>('AppService')
const open = useShell().openExternal

const message = useMessage()

const version = ref('')
const updateState = ref<
  | 'init'
  | 'checking'
  | 'update-not-available'
  | 'update-available'
  | 'downloading'
  | 'downloaded'
>('init')
const updateInfo = ref<UpdateInfo | null>(null)
const downloadPercent = ref<number>(0)

const updater = useUpdater({
  onUpdateAvailable: info => {
    updateInfo.value = info
    updateState.value = 'update-available'
  },
  onUpdateNotAvailable: info => {
    updateInfo.value = info
    setTimeout(() => {
      updateState.value = 'update-not-available'
    }, 3000)
  },
  onUpdateDownloaded: info => {
    downloadPercent.value = 100
    message.success('下载完成')
    updateState.value = 'downloaded'
  },
  onDownloadProgress: info => {
    updateState.value = 'downloading'
    if (typeof info.percent !== 'number') console.log(info.percent)
    downloadPercent.value = Math.round(info.percent * 100) / 100
  },
  onCheckingForUpdate: () => {
    updateState.value = 'checking'
  },
  onUpdateCancelled: info => {
    setTimeout(() => {
      updateState.value = 'update-available'
    }, 3000)
  },
  onError: error => {
    message.error('更新歪了，可以再试试')
    updateState.value = 'init'
    console.error('Updater Error: ', error)
  }
})

const showCredits = ref(false)
const showLicense = ref(false)

const projects: { text: string; link: string; note?: string }[] = [
  {
    text: 'genshindev/api',
    link: 'https://github.com/genshindev/api',
    note: '角色/武器图片来源'
  },
  {
    text: 'biuuu/genshin-wish-export',
    link: 'https://github.com/biuuu/genshin-wish-export'
  },
  {
    text: 'ci010/electron-vue-next',
    link: 'https://github.com/ci010/electron-vue-next'
  },
  {
    text: 'Vue',
    link: 'https://v3.cn.vuejs.org/'
  },
  {
    text: 'Naive UI',
    link: 'https://www.naiveui.com/'
  },
  {
    text: 'ECharts',
    link: 'https://echarts.apache.org/'
  },
  {
    text: 'Vue-ECharts',
    link: 'https://github.com/ecomfe/vue-echarts'
  }
]

onMounted(async () => {
  const { version: _v } = await getBasicInformation()
  version.value = _v

  updater.check()
})

function toVersionString(data: UpdateInfo | null) {
  if (!data) return
  const time = new Date(data.releaseDate)
  return `v${data.version} (${time.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai'
  })})`
}
</script>

<style>
.app {
  -webkit-app-region: drag;
  height: 100%;
  background: #ffe1bb;
}
#credits-card .n-list-item__prefix {
  flex-basis: 30%;
}
#credits-card .n-list-item__suffix {
  flex-basis: 10%;
}
#license-card .n-list-item__suffix {
  flex-basis: 30%;
}
</style>
