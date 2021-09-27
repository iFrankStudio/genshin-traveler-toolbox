<template>
  <div class="bg bg-center bg-no-repeat bg-cover">
    <div class="app border-8 border-double border-opacity-80 border-primary">
      <div class="absolute top-5 left-5" v-show="$route.name !== 'home'">
        <n-icon
          class="framebtn text-gray-300 hover:text-gray-600"
          size="24"
          @click="$router.back"
        >
          <chevron-left />
        </n-icon>
      </div>
      <div class="absolute top-4 right-5">
        <window-control-btns />
      </div>
      <n-dialog-provider>
        <n-message-provider>
          <suspense>
            <router-view></router-view>
          </suspense>
        </n-message-provider>
      </n-dialog-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NIcon } from 'naive-ui'
import { ChevronLeft } from '@vicons/fa'
import { NDialogProvider, NMessageProvider } from 'naive-ui'
import WindowControlBtns from '/@/components/frame/WindowControlButtons.vue'
import { useService } from '/@/composables'
import { getClientsWithLatestLauncher } from './composables/genshin'
import defaultBgImg from '/@/assets/background.png?url'

const { getGenshinClientInstalled: getClients, getLauncherBgInBase64: getBg } =
  useService<'GenshinClientService'>('GenshinClientService')
const bgImg = ref('')

onMounted(async () => {
  const clients = await getClients()
  const latest = getClientsWithLatestLauncher(clients)
  if (latest.length) {
    getBg(
      latest[0].launcher.installPath,
      latest[0].launcher.config.game_dynamic_bg_name
    ).then(base64 => {
      bgImg.value = `url(data:image/png;base64,${base64})`
    })
  } else {
    bgImg.value = `url(../${defaultBgImg})`
  }
})
</script>

<style>
.bg {
  height: 100%;
  -webkit-app-region: drag;
  background-image: v-bind(bgImg);
}
.app {
  height: 100%;
  backdrop-filter: blur(6px);
  background: rgba(240, 248, 255, 0.5);
}
</style>
