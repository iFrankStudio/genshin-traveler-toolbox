<template>
  <v-chart class="no-drag" :option="option" />
</template>

<script lang="ts">
export default defineComponent({
  name: 'GachaAnalysisPieChart'
})
</script>

<script setup lang="ts">
import { defineComponent, defineProps, withDefaults } from 'vue'
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

const props = withDefaults(
  defineProps<{
    name: string
    rank5Roles?: number
    rank5Weapons?: number
    rank4Roles?: number
    rank4Weapons?: number
    rank3Weapons?: number
    selectedAsDefault?: {
      rank5Roles?: boolean
      rank5Weapons?: boolean
      rank4Roles?: boolean
      rank4Weapons?: boolean
      rank3Weapons?: boolean
    }
  }>(),
  {
    selectedAsDefault: () => ({
      rank5Roles: true,
      rank5Weapons: true,
      rank4Roles: true,
      rank4Weapons: true,
      rank3Weapons: false
    })
  }
)

const option = reactive<EChartsOption>({
  title: {
    text: props.name,
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
    bottom: '20%',
    data: (() => {
      const arr: string[] = []
      if (typeof props.rank5Roles === 'number') arr.push('五星角色')
      if (typeof props.rank5Weapons === 'number') arr.push('五星武器')
      if (typeof props.rank4Roles === 'number') arr.push('四星角色')
      if (typeof props.rank4Weapons === 'number') arr.push('四星武器')
      if (typeof props.rank3Weapons === 'number') arr.push('三星武器')
      return arr
    })(),
    selected: {
      五星角色: props.selectedAsDefault.rank5Roles!,
      五星武器: props.selectedAsDefault.rank5Weapons!,
      四星角色: props.selectedAsDefault.rank4Roles!,
      四星武器: props.selectedAsDefault.rank4Weapons!,
      三星武器: props.selectedAsDefault.rank3Weapons!
    }
  },
  series: {
    name: props.name,
    type: 'pie',
    // radius: '55%',
    center: ['50%', '45%'],
    label: {
      show: true,
      position: 'inside',
      formatter: '{b}\n{c}',
      fontSize: 12
    },
    data: (() => {
      const arr = []
      if (typeof props.rank5Roles === 'number')
        arr.push({ value: props.rank5Roles, name: '五星角色' })
      if (typeof props.rank5Weapons === 'number')
        arr.push({ value: props.rank5Weapons, name: '五星武器' })
      if (typeof props.rank4Roles === 'number')
        arr.push({ value: props.rank4Roles, name: '四星角色' })
      if (typeof props.rank4Weapons === 'number')
        arr.push({ value: props.rank4Weapons, name: '四星武器' })
      if (typeof props.rank3Weapons === 'number')
        arr.push({ value: props.rank3Weapons, name: '三星武器' })
      return arr
    })(),
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
