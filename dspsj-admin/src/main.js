import { createApp } from 'vue'
import App from './App.vue'
import './assets/common.css'
import routers from './router/index'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
import piniaPersist  from 'pinia-plugin-persist'
import echartsPlugin from './plugins/echart'
const app  = createApp(App)


// 注册
app.use(echartsPlugin)


// 注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(routers)

// 注册pinia插件，状态持久化
const pinia  = createPinia()
pinia.use(piniaPersist)
app.use(pinia)


app.mount('#app')



