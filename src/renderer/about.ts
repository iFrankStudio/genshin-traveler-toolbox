import { createApp } from 'vue'
import App from './About.vue'
import './index.css'
import 'vfonts/Lato.css' // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体
import store, { key } from './store'

const app = createApp(App).use(store, key)

app.mount('#app')
