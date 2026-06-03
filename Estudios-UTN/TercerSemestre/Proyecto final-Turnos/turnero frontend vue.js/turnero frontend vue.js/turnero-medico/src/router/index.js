import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Centros from '../views/Centros.vue'
import Especialidades from '../views/Especialidades.vue'
import Profesionales from '../views/Profesionales.vue'
import Confirmar from '../views/Confirmar.vue' // ← ¡Ahora sí existe!

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/centros', name: 'Centros', component: Centros },
  { path: '/especialidades', name: 'Especialidades', component: Especialidades },
  { path: '/profesionales', name: 'Profesionales', component: Profesionales },
  { path: '/confirmar', name: 'Confirmar', component: Confirmar }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router