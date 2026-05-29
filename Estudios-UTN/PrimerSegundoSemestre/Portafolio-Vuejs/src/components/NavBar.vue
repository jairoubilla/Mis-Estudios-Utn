<template>
    <nav class="navbar">
        <div class="navbar-menu">
            <ul>
                <a v-for="nav in navegacion" :key="nav.nombre" :href="nav.enlace" class="nav-item" >{{nav.nombre}}</a>  
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue';
const navegacion= ref([
    {id:1, nombre:'Educación', enlace:'#educacion'},
    {id:2, nombre:'Experiencia', enlace:'#experiencia'},
    {id:3, nombre:'Proyectos', enlace:'#proyectos'},
    {id:4, nombre:'Habilidades', enlace:'#habilidades'},
    {id:5, nombre:'Intereses', enlace:'#intereses'}
]);
</script>

<style scoped>
.navbar {
    /* Usamos el gris oscuro para que destaque sutilmente sobre el fondo negro principal */
    background-color: var(--palette-black-secondary); 
    color: var(--palette-white);
    padding: 1rem;
    display: flex;
    justify-content: flex-end; /* Alinea todo a la derecha */
    align-items: center;
    /* Agregamos un borde inferior sutil */
    border-bottom: 1px solid var(--color-border);
    /* Opcional: hacer la barra pegajosa al hacer scroll */
    position: sticky;
    top: 0;
    z-index: 100; /* Asegura que quede por encima de otros elementos */
}

.navbar-menu {
    display: flex;
    align-items: center;
}

.navbar-menu ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1rem; /* Espacio entre los enlaces */
}

a {
    color: var(--palette-white); /* Texto blanco por defecto */
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid transparent; /* Borde transparente por defecto para evitar saltos */
    border-radius: 5px;
    transition: all 0.3s ease;
    font-weight: 500;
}

a:hover {
    /* Al pasar el mouse: borde rojo, texto rojo y fondo ligeramente rojizo */
    color: var(--color-accent);
    border-color: var(--color-accent);
    background-color: rgba(255, 59, 63, 0.1); 
}

@media (max-width: 768px) {
.navbar {
      justify-content: center; /* Centrar en móviles */
}
.navbar-menu ul {
    flex-wrap: wrap; /* Permitir que los enlaces bajen si no caben */
    justify-content: center;
    gap: 0.5rem;
}
a {
    font-size: 0.9rem; /* Un poco más pequeño en móviles */
    padding: 0.4rem 0.8rem;
}
}
</style>