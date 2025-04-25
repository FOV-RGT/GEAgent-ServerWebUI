import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './main.css'
import './style.css'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
