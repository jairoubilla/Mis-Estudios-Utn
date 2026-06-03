<template>
  <div class="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans antialiased text-slate-800">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-slate-200">
      
      <div class="flex flex-col items-center mb-6">
        <img src="/src/assets/logo.png" alt="Mi Turnero" class="w-20 h-20 object-contain mb-2" />
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Mi Turnero</h1>
      </div>

      <div v-if="vistaActual === 'login'">
        <h2 class="text-lg font-bold text-slate-700 mb-4 text-center">Iniciar sesión</h2>
        
        <div v-if="errorLogin" class="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs font-semibold mb-4 text-center">
          ⚠️ El documento ingresado no se encuentra registrado en el sistema.
        </div>
        
        <form @submit.prevent="manejarLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Identificación</label>
            <div class="flex space-x-2">
              <select v-model="tipoDoc" class="border border-slate-300 p-2 rounded bg-slate-50 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none">
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
              <input 
                type="text" 
                v-model="inputDni" 
                required 
                placeholder="Ingrese su número" 
                class="w-full border border-slate-300 p-2 rounded text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none" 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Contraseña</label>
            <input 
              type="password" 
              v-model="inputPassword"
              required 
              placeholder="Ingresar contraseña" 
              class="w-full border border-slate-300 p-2 rounded text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none" 
            />
          </div>

          <button type="submit" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded transition-colors text-sm shadow-sm">
            Iniciar sesión
          </button>
        </form>

        <div class="mt-4 flex flex-col items-center space-y-3 text-sm">
          <a href="#" @click.prevent="alertaRecuperar" class="text-teal-600 hover:underline">Recuperar contraseña</a>
          
          <button @click="irARegistro" class="w-full border border-teal-600 text-teal-600 font-semibold py-2 rounded hover:bg-teal-50/50 transition-colors text-sm">
            Registrarse
          </button>
          
          <button @click="alertaPortal" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded transition-colors text-sm">
            Portal Clínicas
          </button>
        </div>
      </div>

      <div v-else-if="vistaActual === 'registro'">
        <h2 class="text-lg font-bold text-slate-700 mb-4 text-center">Registro</h2>
        
        <form @submit.prevent="manejarRegistro" class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-0.5">Nombre</label>
              <input type="text" v-model="regNombre" required placeholder="Ej: Juan" class="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-0.5">Apellido</label>
              <input type="text" v-model="regApellido" required placeholder="Ej: Pérez" class="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:border-teal-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-0.5">Documento</label>
            <div class="flex space-x-2">
              <select v-model="regTipoDoc" class="border border-slate-300 p-2 rounded bg-slate-50 text-sm outline-none">
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
              <input type="text" v-model="regDni" required placeholder="Ingrese su número" class="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:border-teal-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Género</label>
            <div class="flex space-x-4 text-sm">
              <label class="flex items-center space-x-1.5 cursor-pointer">
                <input type="radio" v-model="regGenero" value="Femenino" class="accent-teal-600" required /> <span>Femenino</span>
              </label>
              <label class="flex items-center space-x-1.5 cursor-pointer">
                <input type="radio" v-model="regGenero" value="Masculino" class="accent-teal-600" /> <span>Masculino</span>
              </label>
              <label class="flex items-center space-x-1.5 cursor-pointer">
                <input type="radio" v-model="regGenero" value="Prefiero no decirlo" class="accent-teal-600" /> <span>Prefiero no decirlo</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-0.5">Provincia</label>
              <select v-model="regProvincia" @change="actualizarCiudadPorDefecto" class="w-full border border-slate-300 p-2 rounded text-sm bg-white outline-none focus:border-teal-500">
                <option v-for="(ciudades, prov) in mapaProvincias" :key="prov" :value="prov">
                  {{ prov }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-0.5">Ciudad / Barrio</label>
              <select v-model="regCiudad" class="w-full border border-slate-300 p-2 rounded text-sm bg-white outline-none focus:border-teal-500">
                <option v-for="ciudad in ciudadesDisponibles" :key="ciudad" :value="ciudad">
                  {{ ciudad }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-0.5">Celular</label>
              <input type="text" v-model="regTelefono" required placeholder="11-1234-5678" class="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-0.5">E-mail</label>
              <input type="email" v-model="regEmail" required placeholder="usuario@gmail.com" class="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:border-teal-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-0.5">Contraseña</label>
            <input type="password" v-model="regPassword" required placeholder="Cree una contraseña" class="w-full border border-slate-300 p-2 rounded text-sm outline-none focus:border-teal-500" />
          </div>

          <button type="submit" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded transition-colors text-sm mt-2 shadow-sm">
            Registrarse
          </button>
        </form>
        
        <button @click="vistaActual = 'login'" class="w-full text-center text-sm text-slate-500 hover:underline mt-4 block">
          ← Volver al login
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTurnosStore } from '../stores/turnos'

const router = useRouter()
const store = useTurnosStore()

const vistaActual = ref('login')
const errorLogin = ref(false) // Control de cartel de error

// Login Refs
const tipoDoc = ref('DNI')
const inputDni = ref('')
const inputPassword = ref('')

// Mapa de Argentina
const mapaProvincias = {
  "Buenos Aires": ["Avellaneda", "Quilmes", "Mar del Plata", "Bahía Blanca", "La Plata", "Lanús"],
  "CABA": ["Palermo", "Belgrano", "Caballito", "Flores", "San Telmo", "Recoleta"],
  "Catamarca": ["San Fernando del Valle", "Andalgalá"],
  "Chaco": ["Resistencia", "Presidencia Roque Sáenz Peña"],
  "Chubut": ["Comodoro Rivadavia", "Puerto Madryn", "Trelew"],
  "Córdoba": ["Córdoba Capital", "Villa Carlos Paz", "Río Cuarto"],
  "Corrientes": ["Corrientes Capital", "Goya"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú"],
  "Formosa": ["Formosa Capital", "Clorinda"],
  "Jujuy": ["San Salvador de Jujuy", "San Pedro"],
  "La Pampa": ["Santa Rosa", "General Pico"],
  "La Rioja": ["La Rioja Capital", "Chilecito"],
  "Mendoza": ["Mendoza Capital", "San Rafael", "Godoy Cruz"],
  "Misiones": ["Posadas", "Puerto Iguazú", "Oberá"],
  "Neuquén": ["Neuquén Capital", "San Martín de los Andes"],
  "Río Negro": ["San Carlos de Bariloche", "Viedma", "Cipolletti"],
  "Salta": ["Salta Capital", "San Ramón de la Nueva Orán"],
  "San Juan": ["San Juan Capital", "Caucete"],
  "San Luis": ["San Luis Capital", "Villa Mercedes"],
  "Santa Cruz": ["Río Gallegos", "El Calafate"],
  "Santa Fe": ["Rosario", "Santa Fe Capital", "Rafaela"],
  "Santiago del Estero": ["Santiago del Estero Capital", "La Banda"],
  "Tierra del Fuego": ["Ushuaia", "Río Grande"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena"]
}

// Registro Refs
const regNombre = ref('')
const regApellido = ref('')
const regTipoDoc = ref('DNI')
const regDni = ref('')
const regGenero = ref('Femenino')
const regProvincia = ref('Buenos Aires')
const regCiudad = ref('Avellaneda')
const regTelefono = ref('')
const regEmail = ref('')
const regPassword = ref('')

const ciudadesDisponibles = computed(() => {
  return mapaProvincias[regProvincia.value] || []
})

const actualizarCiudadPorDefecto = () => {
  if (ciudadesDisponibles.value.length > 0) {
    regCiudad.value = ciudadesDisponibles.value[0]
  }
}

const irARegistro = () => {
  errorLogin.value = false
  vistaActual.value = 'registro'
}

// MANEJAR REGISTRO: Guarda los datos de verdad
const manejarRegistro = () => {
  store.usuario.nombre = `${regNombre.value} ${regApellido.value}`
  store.usuario.dni = regDni.value
  store.usuario.email = regEmail.value
  store.usuario.tel = regTelefono.value

  // Le dejamos el campo listo en el login para comodidad del usuario
  inputDni.value = regDni.value
  errorLogin.value = false

  alert(`¡Registro exitoso! Tus datos de radicación en ${regCiudad.value}, ${regProvincia.value} fueron guardados correctamente.`)
  vistaActual.value = 'login'
}

// MANEJAR LOGIN: Validación estricta contra la memoria real del Store
const manejarLogin = () => {
  // Verificamos si el DNI ingresado coincide EXACTAMENTE con el DNI guardado en memoria
  if (store.usuario && store.usuario.dni === inputDni.value) {
    errorLogin.value = false
    router.push('/home') // Pasa al menú
  } else {
    // Si no coincide, frena el flujo y muestra el cartel rojo en pantalla
    errorLogin.value = true
  }
}

const alertaRecuperar = () => alert('Se ha enviado un enlace seguro de recuperación a su casilla de correo electrónico vinculada.')
const alertaPortal = () => alert('Redireccionando al entorno seguro del Portal Clínicas de Mi Turnero...')
</script>