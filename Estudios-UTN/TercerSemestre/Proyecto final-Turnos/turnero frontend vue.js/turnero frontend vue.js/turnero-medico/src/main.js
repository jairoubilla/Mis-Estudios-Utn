import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // ← Esto importa el archivo que acabamos de crear
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router) // ← Esto activa el sistema de navegación

app.mount('#app')