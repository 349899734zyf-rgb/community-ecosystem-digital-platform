import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

// 引入 Firebase SDK
import { initializeApp } from 'firebase/app'

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAWAzNgjaf6yi988q2IQ9ow_dJbZV3icPA",
  authDomain: "fit5032-ca055.firebaseapp.com",
  projectId: "fit5032-ca055",
  storageBucket: "fit5032-ca055.firebasestorage.app",
  messagingSenderId: "1003232417828",
  appId: "1:1003232417828:web:9872da205712f089fea0b1"
}

// 初始化 Firebase
initializeApp(firebaseConfig)

const app = createApp(App)

app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
