import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Introduce Bootstrap 5 styles and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Introduce the Bootstrap Icons icon library
import 'bootstrap-icons/font/bootstrap-icons.css'
// Introduce custom ecosystem theme styles
import './assets/styles.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
