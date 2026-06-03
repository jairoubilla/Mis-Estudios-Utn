<template>
  <nav class="bg-teal-600 text-white px-6 py-3 shadow flex justify-between items-center font-sans">
    <div class="flex items-center space-x-2 cursor-pointer" @click="router.push('/home')">
      <img src="/src/assets/logo.png" alt="" class="w-7 h-7 object-contain brightness-0 invert" />
      <span class="text-lg font-bold tracking-tight">Mi Turnero</span>
    </div>
    <div class="flex space-x-6 text-sm font-medium">
      <router-link to="/mis-turnos" class="hover:opacity-80 transition-opacity">Mis turnos</router-link>
      <router-link to="/" class="hover:opacity-80 transition-opacity">Mi cuenta</router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>