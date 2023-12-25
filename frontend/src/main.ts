import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import BaiduMap from 'vue-baidu-map-3x'


const app= createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(BaiduMap,{
    ak:'P6zmLD4D4VtQ5IVlVZ1CYN4r4bS56r6n'
  })
app.use(Router)
app.use(ElementPlus)
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')