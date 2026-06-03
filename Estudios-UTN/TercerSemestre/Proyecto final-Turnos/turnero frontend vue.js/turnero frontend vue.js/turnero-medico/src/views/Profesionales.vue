<template>
  <div class="min-h-screen bg-slate-100 font-sans antialiased flex flex-col">
    
    <header class="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="/src/assets/logo.png" alt="Mi Turnero" class="w-12 h-12 object-contain" />
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900">Mi Turnero</h1>
          <span class="text-xs text-slate-500">Profesionales de la Salud</span>
        </div>
      </div>
      <button @click="router.push('/especialidades')" class="text-sm font-semibold text-teal-600 hover:underline">← Volver</button>
    </header>

    <main class="flex-grow max-w-2xl w-full mx-auto p-6">
      <div class="mb-4">
        <span class="text-xs bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full border border-teal-200">
          Especialidad buscada: {{ store.turnoProceso.especialidad || 'General' }}
        </span>
        <h2 class="text-xl font-bold text-slate-800 mt-3">Médicos Disponibles</h2>
      </div>
      
      <div class="space-y-3">
        <!-- Renderiza tu array de profesionales del store -->
        <div v-for="doc in store.profesionales" :key="doc.id" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h3 class="font-bold text-slate-900 text-lg">{{ doc.nombre }}</h3>
            <p class="text-sm text-teal-600 font-medium">Especialidad: {{ doc.especialidad }}</p>
          </div>
          <button @click="seleccionarProfesional(doc.nombre)" class="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded shadow-sm">
            Agendar Turno
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTurnosStore } from '../stores/turnos'

const router = useRouter()
const store = useTurnosStore()

const seleccionarProfesional = (medico) => {
  // Mapeamos a tus variables exactas: profesional, centro, especialidad
  store.turnoProceso.profesional = medico
  
  if (!store.turnoProceso.centro) store.turnoProceso.centro = 'Centro Médico Pepita'
  if (!store.turnoProceso.especialidad) store.turnoProceso.especialidad = 'Clínica Médica'
  
  router.push('/confirmar')
}
</script>