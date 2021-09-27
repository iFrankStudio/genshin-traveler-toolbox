<template>
  <div class="flex h-full w-full">
    <div class="flex-none bg-parchment m-10 p-12">
      <h3 class="text-base ml-2 mt-1 mb-2">
        抽卡总计
        <strong>{{ analysised.count.total }}</strong> 次
      </h3>
      <n-tree
        block-line
        :data="overviewTree.data"
        :default-expanded-keys="overviewTree.defaultExpandedKeys"
        :selectable="false"
        virtual-scroll
      />
    </div>
    <div class="flex-grow mt-6 mx-6">
      <OverviewPieChart
        :rank5Roles="analysised.count.roles.rank5"
        :rank4Roles="analysised.count.roles.rank4"
        :rank5Weapons="analysised.count.weapons.rank5"
        :rank4Weapons="analysised.count.weapons.rank4"
        :rank3Weapons="analysised.count.weapons.rank3"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GachaAnalysisOverview'
})
</script>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { NTree, TreeOption } from 'naive-ui'
import bgUrl from '/@/assets/bg_parchment.png?url'
import { GachaLogsAnalyser, useGacha } from '/@/composables'
import OverviewPieChart from '/@/components/charts/OverviewPieChart.vue'

const bg_parchment = `url(../${bgUrl})`

const { wishes } = useGacha()
// console.log(wishes.value)
const analysised = GachaLogsAnalyser.OverviewOfAll(wishes.value)

const overviewTree: {
  data: Array<TreeOption>
  defaultExpandedKeys: Array<string | number>
} = {
  data: [
    {
      key: 'roles',
      label: `角色数量：${analysised.count.roles.total}`,
      children: [
        {
          key: 'roles-5stars',
          label: `五星角色：${analysised.count.roles.rank5}`
        },
        {
          key: 'roles-4stars',
          label: `四星角色：${analysised.count.roles.rank4}`
        }
      ]
    },
    {
      key: 'weapons',
      label: `武器数量：${analysised.count.weapons.total}`,
      children: [
        {
          key: 'weapons-5stars',
          label: `五星武器：${analysised.count.weapons.rank5}`
        },
        {
          key: 'weapons-4stars',
          label: `四星武器：${analysised.count.weapons.rank4}`
        },
        {
          key: 'weapons-3stars',
          label: `三星武器：${analysised.count.weapons.rank3}`
        }
      ]
    }
  ],
  defaultExpandedKeys: ['roles', 'weapons']
}
</script>

<style scoped>
.bg-parchment {
  width: 280px;
  background-image: v-bind(bg_parchment);
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  background-position: center;
}
</style>
