<template>
  <div class="min-h-screen bg-slate-100 font-sans antialiased flex flex-col">
    
    <!-- HEADER -->
    <header class="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="/src/assets/logo.png" alt="Mi Turnero" class="w-12 h-12 object-contain" />
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900">Mi Turnero</h1>
          <span class="text-xs text-slate-500">Selección de Especialidad</span>
        </div>
      </div>
      <button @click="router.push('/home')" class="text-sm font-semibold text-teal-600 hover:underline">← Volver al Menú</button>
    </header>

    <!-- FORMULARIO -->
    <main class="flex-grow max-w-md w-full mx-auto p-6 flex flex-col justify-center">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800 mb-2">¿Qué especialidad requiere?</h2>
        <p class="text-xs text-slate-400 mb-4">Seleccione un área médica para ver los profesionales disponibles.</p>
        
        <form @submit.prevent="avanzarAProfesionales" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Especialidades disponibles</label>
            <!-- Vinculamos con las especialidades reales de tu store -->
            <select v-model="especialidadSeleccionada" required class="w-full border border-slate-300 p-2.5 rounded text-sm bg-slate-50 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700 block">
              <option value="" disabled>-- Elija una especialidad --</option>
              <option v-for="esp in store.especialidades" :key="esp" :value="esp">{{ esp }}</option>
            </select>
          </div>

          <button type="submit" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded transition-colors text-sm shadow-sm">
            Continuar a Profesionales →
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTurnosStore } from '../stores/turnos'

const router = useRouter()
const store = useTurnosStore()

// Mapeado exacto a tu "turnoProceso.especialidad"
const especialidadSeleccionada = ref(store.turnoProceso?.especialidad || '')

const avanzarAProfesionales = () => {
  store.turnoProceso.especialidad = especialidadSeleccionada.value
  router.push('/profesionales')
}
</script>