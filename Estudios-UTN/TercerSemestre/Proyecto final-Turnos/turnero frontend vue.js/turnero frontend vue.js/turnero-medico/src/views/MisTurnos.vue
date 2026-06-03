<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <Navbar />
    <div class="max-w-xl mx-auto pt-10 px-4">
      
      <div class="bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <div class="flex items-center space-x-2 text-2xl font-bold text-slate-900 mb-6">
          <span>Turno confirmado</span>
          <span class="text-emerald-500">✅</span>
        </div>

        <div class="space-y-4 text-sm mb-8 pb-6 border-b border-slate-100">
          <div>
            <p class="font-bold text-base text-slate-800">{{ ult?.centro?.nombre || 'Hospital Juan Merenguito' }}</p>
            <p class="text-slate-500">{{ ult?.centro?.direccion || 'Avenida Pepito 113, Ciudad, Provincia' }}</p>
            <p class="text-slate-500">{{ ult?.centro?.tel || '0800-123-1234' }}</p>
          </div>

          <div class="pt-2 space-y-1.5">
            <p><strong>Profesional:</strong> {{ ult?.profesional?.nombre || 'Dra Maria Julia Perez' }}</p>
            <p><strong>Paciente:</strong> {{ store.usuario.nombre || 'Juan Perez' }}</p>
            <p><strong>Especialidad:</strong> {{ ult?.especialidad || 'Cardiología' }}</p>
            <p><strong>Día y hora:</strong> Viernes 05 de junio a las {{ ult?.hora || '08:45' }} hs</p>
          </div>
        </div>

        <div class="flex justify-center">
          <button @click="router.push('/home')" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-10 rounded text-sm transition-colors">
            Ir al inicio
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'
import { useTurnosStore } from '../stores/turnos'

const router = useRouter()
const store = useTurnosStore()

// Obtenemos el último turno que se acaba de agendar
const ult = computed(() => store.turnosConfirmados[store.turnosConfirmados.length - 1])
</script>