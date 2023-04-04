import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/common.css'

import routers from './router/index'

import store from './store'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app  = createApp(App)


// 注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)

app.use(routers)

app.use(store)
app.mount('#app')



