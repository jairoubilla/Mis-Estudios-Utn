<script setup>
import { ref } from 'vue';
// FondoLava se eliminó de aquí porque debe ir en App.vue para ser global.

const intereses = ref([
    'Desarrollo de Software de Código Abierto: Contribuyo a proyectos en GitHub, colaborando con otros desarrolladores para mejorar herramientas y librerías populares.',
    'Deportes al Aire Libre: Disfruto del senderismo y el ciclismo de montaña, actividades que practico regularmente para mantener un equilibrio entre el trabajo y la vida personal.',
    'Tecnología de Innovación: Me apasiona explorar nuevas tendencias tecnológicas como la inteligencia artificial y el desarrollo de aplicaciones móviles.',
    'Fotografía: Practico la fotografía como un hobby, lo que me ayuda a mantener una perspectiva creativa tanto en mi vida profesional como personal.'
]);
</script>

<template>
    <div class="intereses-contenedor">
        <ul class="contenedor-lista">
            <li class="item" v-for="interes in intereses" :key="interes">
                {{ interes }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.intereses-contenedor {
    display: flex;
    position: relative;
    margin: 0 auto;
    max-width: 85%;
    padding: 1rem;
}

.contenedor-lista {
    list-style-type: none;
    padding: 1rem;
    margin-bottom: .5rem;
    color: var(--color-text); /* Usa el color de texto gris claro del tema */
    font-size: 1.2rem; /* Un poco más pequeño para mejor lectura */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Sombra más sutil */
}

.item {
    margin-bottom: 1.5rem; /* Más espacio entre ítems */
    position: relative; /* Para poder posicionar el bullet point personalizado */
    padding-left: 1.5rem; /* Espacio para el bullet point */
}

/* Bullet point personalizado rojo */
.item::before {
    content: "•";
    color: var(--color-accent); /* Rojo del tema */
    font-size: 2rem;
    position: absolute;
    left: 0;
    top: -0.5rem; /* Ajuste fino vertical */
}
</style>