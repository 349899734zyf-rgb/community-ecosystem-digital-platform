// import './assets/main.css'
// import './style.css'
//import 'bootstrap/dist/css/bootstrap.min.css'

//import { createApp } from 'vue'
//import App from './App.vue'

//createApp(App).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'

// 1. 引入 Bootstrap 样式
import 'bootstrap/dist/css/bootstrap.min.css'

// 2. 引入 PrimeVue 配置与 Aura 主题
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)

// 3. 注册 PrimeVue 插件并使用 Aura 预设主题
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
