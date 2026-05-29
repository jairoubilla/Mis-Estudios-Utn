<script setup>
import { ref } from 'vue';
// 1. IMPORTA TUS ICONOS (Asegúrate de que los archivos existan en src/assets/)
import icono1 from '../assets/ventas.svg';
import icono2 from '../assets/ecomerce.svg';
import icono3 from '../assets/configuracion.svg';
import icono4 from '../assets/uiux.svg';
import icono5 from '../assets/watch.svg';

const titulo = 'Desarrollador Full Stack';
const fecha = 'Desde Marzo 2025 / Noviembre 2025';

// 2. USA LAS VARIABLES IMPORTADAS EN 'src'
const experiencias = ref([
    { id: 1, src: icono1, parrafo: 'Lideré un equipo de 5 desarrolladores en la creación de una plataforma de comercio electrónico que incrementó las ventas en un 35% durante el primer año.' },
    { id: 2, src: icono2, parrafo: 'Diseñé y desarrollé aplicaciones web utilizando Node.js, React y MongoDB, logrando reducir el tiempo de carga de las páginas en un 50%.' },
    { id: 3, src: icono3, parrafo: 'Implementé soluciones de autenticación y autorización, mejorando la seguridad del sitio web y reduciendo los intentos de acceso no autorizado en un 20%.' },
    { id: 4, src: icono4, parrafo: 'Colaboré con diseñadores de UX/UI para crear interfaces de usuario atractivas y fáciles de usar, aumentando la satisfacción del cliente en un 15%.' },
    { id: 5, src: icono5, parrafo: 'Automaticé procesos de despliegue continuo utilizando Jenkins y Docker, reduciendo los tiempos de despliegue en un 40%.' },
]);
</script>

<template>
    <div class="card">
        <h3 class="titulo">{{ titulo.toLocaleUpperCase() }}</h3>
        <p class="fecha">{{ fecha }}</p>
        <ul class="listado">
            <li class="item" v-for="experiencia in experiencias" :key="experiencia.id">
                <img class="imagen-svg" :src="experiencia.src" width="45rem" :alt="experiencia.parrafo">
                <p>{{ experiencia.parrafo }}</p>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    background-color: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 15px;
}

.titulo {
    font-size: 1.5rem;
    color: var(--color-heading);
    margin-bottom: 0.5rem;
}

.fecha {
    font-size: 1rem;
    color: var(--color-accent);
    margin-bottom: 1.5rem;
    font-weight: 500;
}

.listado {
    display: flex;
    flex-direction: column;
}

.item {
    align-items: center;
    display: flex;
    padding: 1rem;
    gap: 1.5rem;
}

/* ESTILOS PARA LOS ICONOS SVG */
.imagen-svg {
    filter: invert(1); 
    filter: invert(36%) sepia(76%) saturate(1994%) hue-rotate(338deg) brightness(91%) contrast(105%); 
}

p {
    color: var(--color-text);
}
</style>