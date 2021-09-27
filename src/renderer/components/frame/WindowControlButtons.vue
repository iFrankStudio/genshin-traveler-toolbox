<template>
  <n-icon
    class="framebtn text-primary hover:text-gray-800 mr-2"
    size="22"
    @click="minimize()"
  >
    <Remove />
  </n-icon>
  <n-icon
    class="framebtn text-primary hover:text-gray-800 mr-2"
    size="22"
    @click="close()"
  >
    <Close />
  </n-icon>
</template>

<script lang="ts">
export default defineComponent({
  name: 'WindowControlButtons'
})
</script>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { useBrowserWindowOperation } from '/@/composables'
import { NIcon } from 'naive-ui'
import { Close, Remove } from '@vicons/ionicons5'

const { minimize, close } = useBrowserWindowOperation()
</script>
