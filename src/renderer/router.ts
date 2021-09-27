import { createRouter, createMemoryHistory } from 'vue-router'
import Home from './views/Home.vue'
import Gacha from './views/Gacha.vue'
import {
  GachaAnalysisPage,
  Overview,
  GachaAnalysis
} from './views/gacha-analysis'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/gacha',
      name: 'gacha',
      component: Gacha
    },
    {
      path: '/gacha/analysis',
      name: 'gacha-analysis',
      component: GachaAnalysisPage,
      children: [
        {
          // 总览
          path: 'overview',
          component: Overview
        },
        {
          // 角色池
          path: 'character-event',
          component: GachaAnalysis
        },
        {
          // 武器池
          path: 'weapon-event',
          component: GachaAnalysis
        },
        {
          // 常驻池
          path: 'permanent',
          component: GachaAnalysis
        },
        {
          // 新手池
          path: 'novice',
          component: GachaAnalysis
        }
      ]
    }
  ]
})

export default router
