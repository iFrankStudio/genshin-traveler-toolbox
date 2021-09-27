import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'vfonts/Lato.css' // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体
import router from './router'
import store, { key } from './store'

const app = createApp(App).use(router).use(store, key)

app.mount('#app')
