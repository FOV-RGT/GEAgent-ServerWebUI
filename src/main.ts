import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './main.css'


const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(Antd)


app.mount('#app')
