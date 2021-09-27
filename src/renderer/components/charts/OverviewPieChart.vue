<template>
  <v-chart class="no-drag" :option="option" />
</template>

<script lang="ts">
export default defineComponent({
  name: 'OverviewPieChart'
})
</script>

<script setup lang="ts">
import { defineComponent, defineProps } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { reactive } from 'vue'
import { EChartsOption } from 'echarts'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const props = defineProps<{
  rank5Roles?: number
  rank4Roles?: number
  rank5Weapons?: number
  rank4Weapons?: number
  rank3Weapons?: number
}>()

const option = reactive<EChartsOption>({
  title: {
    text: '抽卡总览',
    left: 'center',
    show: false
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    bottom: '0',
    data: ['五星角色', '五星武器', '四星角色', '四星武器', '三星武器'],
    selected: {
      三星武器: false
    }
  },
  series: {
    name: '抽卡总览',
    type: 'pie',
    radius: '55%',
    center: ['50%', '45%'],
    label: {
      show: true,
      formatter: '{b} * {c}',
      fontSize: 14
    },
    data: [
      { value: props.rank5Roles, name: '五星角色' },
      { value: props.rank5Weapons, name: '五星武器' },
      { value: props.rank4Roles, name: '四星角色' },
      { value: props.rank4Weapons, name: '四星武器' },
      { value: props.rank3Weapons, name: '三星武器' }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }
})
</script>

<style scoped></style>
