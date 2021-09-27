<template>
  <div class="w-full h-full p-20 flex flex-col mx-0">
    <header>
      <h1 class="text-3xl font-bold inline-block">旅行者工具箱</h1>
      <div
        class="no-drag ml-2 inline-block hover:cursor-pointer"
        @click="activeAboutWindow"
      >
        <span>{{ version }}</span>
        <n-icon v-if="updateAvailable" class="ml-1 align-middle text-green-600">
          <arrow-alt-circle-up-regular />
        </n-icon>
      </div>
    </header>
    <p class="mt-20 ml-12 text-lg font-semibold">已安装客户端：</p>
    <div class="mt-12 flex justify-around px-16 space-x-20 flex-1">
      <genshin-client-card
        v-for="client in clients"
        :key="client.type"
        :title="client.type === 'GenshinImpact' ? 'Genshin Impact' : '原神'"
        :version="client.game.version"
        :launcherPath="client.launcher.exePath"
        :gamePath="client.game.exePath"
        :international="client.type === 'GenshinImpact'"
        @click="runClient(client.game.exePath)"
        launcher
      />
    </div>
    <div
      class="
        no-drag
        flex
        justify-between
        filter
        drop-shadow-lg
        hover:cursor-pointer
      "
    >
      <div
        class="btn btn-roles hover:drop-shadow-md"
        name="角色信息"
        @click="infoUnsupport"
      ></div>
      <router-link
        to="/gacha"
        class="btn btn-gacha hover:drop-shadow-md"
        name="祈愿记录"
      ></router-link>
      <div
        class="btn btn-strategy hover:drop-shadow-md"
        name="观测枢"
        @click="open('https://bbs.mihoyo.com/ys/strategy/')"
      ></div>
      <div
        class="btn btn-map hover:drop-shadow-md"
        name="大地图"
        @click="open('https://webstatic.mihoyo.com/app/ys-map-cn/index.html')"
      ></div>
      <div
        class="btn btn-bbs hover:drop-shadow-md"
        name="米游社"
        @click="open('https://bbs.mihoyo.com/ys/')"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import GenshinClientCard from '/@/components/GenshinClientCard.vue'
import { GenshinClient } from '/@shared/GenshinClientTypes'
import buttonImgUrl from '/@/assets/button.png?url'
import { useService, useShell, useUpdater } from '/@/composables'
import { NIcon, useMessage } from 'naive-ui'
import { ArrowAltCircleUpRegular } from '@vicons/fa'

const open = useShell().openExternal

const style_btn_bg = `url(../${buttonImgUrl})`

const { getBasicInformation, createAboutWindow } =
  useService<'AppService'>('AppService')
const { getGenshinClientInstalled: getClients, runClient } =
  useService<'GenshinClientService'>('GenshinClientService')

const aboutWindowActived = ref(false)
const activeAboutWindow = () => {
  // 防止窗口创建前再次触发创建窗口操作
  if (!aboutWindowActived.value) {
    aboutWindowActived.value = true
    createAboutWindow()
    setTimeout(() => {
      aboutWindowActived.value = false
    }, 500)
  }
}

const message = useMessage()

const clients: Ref<GenshinClient[]> = ref([])
const version = ref('')
const updateAvailable = ref<boolean>(false)

const updater = useUpdater({
  onUpdateAvailable: () => {
    updateAvailable.value = true
  }
})

onMounted(async () => {
  clients.value = await getClients()
  version.value = 'v' + (await getBasicInformation()).version

  updater.check(true)
})

function infoUnsupport() {
  function random() {
    return Math.floor(Math.random() * 2.999)
  }
  const messages = [
    '尚未完成的功能',
    '开发鸽鸽发出了咕咕咕的声音',
    '这是个饼，画的'
  ]
  message.info(messages[random()])
}
</script>

<style scoped>
.btn {
  width: 127px;
  height: 44px;
  background: v-bind(style_btn_bg) no-repeat;
  background-size: cover;
}
.btn-roles {
  background-position: top left;
}
.btn-roles:hover {
  background-position: top -44px left;
}
.btn-gacha {
  background-position: top -88px left;
}
.btn-gacha:hover {
  background-position: top -132px left;
}
.btn-strategy {
  background-position: top -176px left;
}
.btn-strategy:hover {
  background-position: top -220px left;
}
.btn-map {
  background-position: top -263px left;
}
.btn-map:hover {
  background-position: top -307px left;
}
.btn-bbs {
  background-position: top -351px left;
}
.btn-bbs:hover {
  background-position: top -395px left;
}
</style>
