<template>
  <div class="app">
    <div class="absolute top-2 right-2">
      <n-icon
        class="framebtn text-gray-600 hover:text-gray-800 mr-2"
        size="16"
        @click="close()"
      >
        <Close />
      </n-icon>
    </div>
    <n-message-provider>
      <about-page />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { NMessageProvider, NIcon } from 'naive-ui'
import { Close } from '@vicons/ionicons5'
import { useBrowserWindowOperation } from '/@/composables'
import AboutPage from '/@/views/About.vue'

const { close } = useBrowserWindowOperation()
</script>

<style>
.app {
  -webkit-app-region: drag;
  height: 100%;
  background: #fff1e5;
}
</style>
