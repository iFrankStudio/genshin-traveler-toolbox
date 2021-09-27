<template>
  <div class="flex h-full w-full pt-6">
    <div class="flex-none w-1/5">
      <n-card class="bg-white bg-opacity-60" size="medium">
        <template #header>
          总计 <strong>{{ analysised.count.total }}</strong> 抽
        </template>
        <template #default>
          <template
            v-if="
              analysised.count.roles.rank5 + analysised.count.weapons.rank5 > 0
            "
          >
            五星：{{
              analysised.count.roles.rank5 + analysised.count.weapons.rank5
            }}
            <br />平均出货次数：{{ analysised.count.avgRank5 }}
            <br />距上次出货：{{ analysised.count.lastRank5 }}抽
            <n-divider dashed />
          </template>
          <template v-else> 五星：没有数据 <n-divider dashed /></template>
          <template
            v-if="
              analysised.count.roles.rank4 + analysised.count.weapons.rank4 > 0
            "
          >
            四星：{{
              analysised.count.roles.rank4 + analysised.count.weapons.rank4
            }}
            <br />平均出货次数：{{ analysised.count.avgRank4 }}
            <br />距上次出货：{{ analysised.count.lastRank4 }}抽
          </template>
          <template v-else> 四星：没有数据 </template>
        </template>
      </n-card>
    </div>
    <n-space
      vertical
      class="no-drag flex-grow mx-6 max-h-full overflow-auto hide-scrollbar"
    >
      <GachaListCard
        class="bg-white bg-opacity-60"
        title="五星"
        :list="gachaListConverted['5']"
      />
      <GachaListCard
        class="bg-white bg-opacity-60"
        title="四星"
        :list="gachaListConverted['4']"
      />
    </n-space>
    <GachaAnalysisPieChart
      class="flex-none w-1/5"
      :name="pieChartName"
      :rank5Roles="analysised.count.roles.rank5"
      :rank5Weapons="analysised.count.weapons.rank5"
      :rank4Roles="analysised.count.roles.rank4"
      :rank4Weapons="analysised.count.weapons.rank4"
      :rank3Weapons="analysised.count.weapons.rank3"
      :selectedAsDefault="pieChartSelected"
    />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GachaAnalysis'
})
</script>
<script setup lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NSpace, NDivider } from 'naive-ui'
import { GachaLogsAnalyser, useGacha } from '/@/composables'
import GachaAnalysisPieChart from '/@/components/charts/GachaAnalysisPieChart.vue'
import GachaListCard from '/@/components/GachaListCard.vue'
import { GenshinWishType } from '/@shared/GenshinApiTypes'

const route = useRoute()
const router = useRouter()

let type: GenshinWishType = GenshinWishType.CharacterEventWish
let pieChartName = ''
const pieChartSelected = reactive({
  rank5Roles: true,
  rank5Weapons: true,
  rank4Roles: true,
  rank4Weapons: true
})
switch (route.path) {
  case '/gacha/analysis/character-event':
    type = GenshinWishType.CharacterEventWish
    pieChartName = '角色祈愿'
    pieChartSelected.rank5Weapons = false
    break
  case '/gacha/analysis/weapon-event':
    type = GenshinWishType.WeaponEventWish
    pieChartName = '武器祈愿'
    pieChartSelected.rank5Roles = false
    break
  case '/gacha/analysis/permanent':
    type = GenshinWishType.PermanentWish
    pieChartName = '常驻祈愿'
    break
  case '/gacha/analysis/novice':
    type = GenshinWishType.NoviceWish
    pieChartName = '新手祈愿'
    break
  default:
    console.error('无法识别的祈愿页面地址', route.path)
    router.back()
}

const { wishes } = useGacha()

const records = wishes.value.get(type)!
const analysised = GachaLogsAnalyser.OverviewOfRecords(records)
const gachaListConverted = await GachaLogsAnalyser.ConvertToList(records)
</script>
