<template>
  <div class="min-h-screen bg-slate-100 font-sans antialiased flex flex-col items-center justify-center p-4">
    
    <!-- PANTALLA DE ERROR: Solo se muestra si falta el DNI o el Nombre en el Store -->
    <div v-if="errorDeMemoria" class="bg-white w-full max-w-md rounded-2xl shadow-md border border-red-200 overflow-hidden text-center p-6 space-y-4">
      <div class="text-red-500 text-5xl">⚠️</div>
      <h2 class="text-xl font-bold text-slate-800">Error de Autenticación / Flujo</h2>
      <p class="text-sm text-slate-600">
        No se encontraron datos del paciente o del turno en la memoria del sistema. Debe iniciar sesión y seleccionar su centro médico primero.
      </p>
      <button @click="redirigirAlLogin" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-sm transition-colors shadow-sm">
        Volver al Inicio / Login
      </button>
    </div>

    <!-- PANTALLA OPERATIVA: Solo se renderiza si los datos de memoria existen realmente -->
    <div v-else class="bg-white w-full max-w-md rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      
      <!-- ENCABEZADO -->
      <div class="bg-slate-900 text-white p-6 text-center relative">
        <div class="flex justify-center mb-2">
          <img src="/src/assets/logo.png" alt="Logo Mi Turnero" class="w-16 h-16 object-contain" />
        </div>
        <h2 class="text-xl font-bold tracking-tight">Resumen de su Turno</h2>
        <p class="text-xs text-slate-400 mt-1">Complete la fecha y hora para asentar la reserva institucional</p>
      </div>

      <!-- CUERPO DEL TICKET -->
      <form @submit.prevent="confirmarYFinalizar" class="p-6 space-y-4 text-sm">
        
        <!-- SECCIÓN PACIENTE (DATOS REALES DE TU MEMORIA) -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Datos del Paciente</h3>
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <p class="text-slate-800"><span class="font-semibold text-slate-500">Nombre:</span> {{ store.usuario.nombre }}</p>
            <p class="text-slate-800"><span class="font-semibold text-slate-500">DNI:</span> {{ store.usuario.dni }}</p>
            <p class="text-slate-800"><span class="font-semibold text-slate-500">Email:</span> {{ store.usuario.email }}</p>
            <p v-if="store.usuario.tel" class="text-slate-800"><span class="font-semibold text-slate-500">Teléfono:</span> {{ store.usuario.tel }}</p>
          </div>
        </div>

        <!-- SECCIÓN DETALLES MÉDICOS -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Detalles de la Cita</h3>
          <div class="bg-teal-50/50 p-3 rounded-lg border border-teal-100 space-y-1">
            <p class="text-slate-800"><span class="font-semibold text-teal-700">Centro:</span> {{ store.turnoProceso.centro }}</p>
            <p class="text-slate-800"><span class="font-semibold text-teal-700">Especialidad:</span> {{ store.turnoProceso.especialidad }}</p>
            <p class="text-slate-800"><span class="font-semibold text-teal-700">Profesional:</span> {{ store.turnoProceso.profesional }}</p>
          </div>
        </div>

        <!-- ASIGNACIÓN DE FECHA Y HORA -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Asignación de Turno</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Elegir Fecha</label>
              <input 
                type="date" 
                v-model="inputFecha" 
                required 
                class="w-full border border-slate-300 p-2 rounded text-sm bg-slate-50 outline-none focus:border-teal-500 text-slate-700"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Elegir Horario</label>
              <input 
                type="time" 
                v-model="inputHora" 
                required 
                class="w-full border border-slate-300 p-2 rounded text-sm bg-slate-50 outline-none focus:border-teal-500 text-slate-700"
              />
            </div>
          </div>
        </div>

        <!-- BOTÓN FINAL -->
        <div class="pt-2">
          <button type="submit" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded text-sm transition-colors shadow-sm text-center block">
            Confirmar y Guardar Turno
          </button>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTurnosStore } from '../stores/turnos'

const router = useRouter()
const store = useTurnosStore()

// VALIDACIÓN ESTRICTA: 
// Da error si el nombre del usuario está vacío (no pasó por registro/login) 
// o si no completó los pasos previos (centro o especialidad en null)
const errorDeMemoria = computed(() => {
  return !store.usuario.nombre || !store.turnoProceso.centro || !store.turnoProceso.especialidad
})

const inputFecha = ref(store.turnoProceso.fecha || '')
const inputHora = ref(store.turnoProceso.hora || '')

const redirigirAlLogin = () => {
  router.push('/')
}

const confirmarYFinalizar = () => {
  // Por seguridad, si de alguna forma saltan la vista, no los deja guardar datos corruptos
  if (errorDeMemoria.value) return

  // Guardamos la fecha y hora reales elegidas por el usuario
  store.turnoProceso.fecha = inputFecha.value
  store.turnoProceso.hora = inputHora.value

  // Llama a tu función nativa del store (pushea a turnosConfirmados y limpia el proceso)
  store.confirmarTurnoActual()
  
  alert('¡Turno guardado con éxito en su historial institucional!')
  router.push('/home')
}
</script>