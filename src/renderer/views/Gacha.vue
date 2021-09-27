<template>
  <div class="w-full h-full p-20 flex flex-col mx-0">
    <header class="text-2xl font-bold">祈愿记录分析</header>
    <p class="mt-16 text-xl text-center">
      选择分析记录来源
      <n-popover trigger="hover" :delay="500">
        <template #trigger>
          <n-button
            class="ml-1"
            name="edit"
            type="primary"
            size="tiny"
            ghost
            circle
            @click="showModal = true"
          >
            <template #icon>
              <n-icon><plus /></n-icon>
            </template>
          </n-button>
        </template>
        手动输入
      </n-popover>
    </p>
    <n-modal
      class="no-drag"
      preset="dialog"
      title="请输入您的祈愿记录页面地址"
      positive-text="确认"
      negative-text="取消"
      :mask-closable="false"
      :show-icon="false"
      :show="showModal"
      @close="closeModal"
      @negative-click="closeModal"
      @positive-click="submitCallback"
    >
      <n-form-item :show-label="false" :rule="rule">
        <n-input
          v-model:value="inputUrl"
          :autosize="{ minRows: 3, maxRows: 8 }"
          type="textarea"
          placeholder="https://webstatic.mihoyo.com/..."
          clearable
        />
      </n-form-item>
    </n-modal>
    <main class="mt-12 flex justify-around px-16 space-x-20 flex-1">
      <genshin-client-card
        v-for="client in clients"
        :key="client.type"
        :title="client.type === 'GenshinImpact' ? 'Genshin Impact' : '原神'"
        :version="client.game.version"
        :launcherPath="client.launcher.exePath"
        :gamePath="client.game.exePath"
        :international="client.type === 'GenshinImpact'"
        :validGachaLog="validGachaLog[client.type]"
        @recheck="check"
        @clickOnClient="routeToAnalysisPage(validGachaLog[client.type])"
      />
    </main>
    <footer class="px-28 flex underline">
      <span>使用提示：</span>
      <p class="flex-1">
        若出现错误提示，请先启动对应游戏，在游戏中打开任意
        <strong>祈愿历史记录</strong> 页面，待页面加载完成后再返回本工具重试。
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GachaIndex'
})
</script>

<script setup lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGacha, useService } from '/@/composables'
import { ClientType } from '/@shared/GenshinClientTypes'
import {
  NButton,
  NIcon,
  NPopover,
  NModal,
  NFormItem,
  FormItemRule,
  NInput
} from 'naive-ui'
import { Plus } from '@vicons/fa'
import GenshinClientCard from '/@/components/GenshinClientCard.vue'

const validGachaLog = reactive<Record<ClientType, string | undefined>>({
  原神: undefined,
  GenshinImpact: undefined
})

const genshinLogService = useService<'GenshinLogService'>('GenshinLogService')
const { getGenshinClientInstalled } = useService<'GenshinClientService'>(
  'GenshinClientService'
)

const clients = await getGenshinClientInstalled()

const check = () => {
  clients.forEach(async client => {
    try {
      const logFilePath = await genshinLogService.detectLogFileLocale(
        client.type === 'GenshinImpact'
      )
      const url = await genshinLogService.getGachaLogPageUrlFromLogFile(
        logFilePath
      )
      validGachaLog[client.type] = url
    } catch (error) {
      validGachaLog[client.type] = ''
    }
  })
}
check()

const router = useRouter()
const { setLogPageUrl } = useGacha()
const routeToAnalysisPage = (url: string | undefined) => {
  if (url) {
    setLogPageUrl(url)
    router.push({
      path: '/gacha/analysis/overview'
      // query: { url }
    })
  }
}

// 手动输入
const showModal = ref(false)
const inputUrl = ref<string>('')
const regUrl =
  /^(https:\/\/webstatic\.mihoyo\.com\/)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
const rule: FormItemRule = {
  required: true,
  trigger: ['input', 'blur'],
  validator() {
    if (!regUrl.test(inputUrl.value)) {
      return new Error('请输入正确的链接')
    }
  }
}
function closeModal() {
  showModal.value = false
}
function submitCallback() {
  if (!regUrl.test(inputUrl.value)) return false
  routeToAnalysisPage(inputUrl.value)
}
</script>
