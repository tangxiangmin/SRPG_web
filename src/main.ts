import {createApp, h} from 'vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// @ts-ignore
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

app.mount('#app')
