<script setup>
import { ref } from 'vue';

const fechaColor = ref([
  { color: '#ff3b3f' }, /* Rojo primario */
  { color: '#d32f2f' }, /* Rojo oscuro */
  { color: '#e0e0e0' }, /* Gris claro */
  { color: '#a0a0a0' }, /* Gris medio */
  { color: '#1e1e1e' }  /* Negro secundario */
]);

const educacion = ref([
  {
    fecha: '2025',
    title: 'Técnicatura Universitaria en Programación',
    descripcion: 'Incumbencias Profesionales: Operación y programación de computadoras, desarrollo de programas en distintos lenguajes, análisis y control de sistemas informáticos.',
    enlace: 'https://www.frsr.utn.edu.ar/'
  },
  {
    fecha: '2024',
    title: 'Desarrollador Full Stack',
    descripcion: 'Curso intensivo de desarrollo web con tecnologías modernas como JavaScript, Node.js, React y bases de datos SQL/NoSQL.',
    enlace: '#'
  }
  
]);
</script>

<template>
  <ul>
    <li v-for="(item, index) in educacion" :key="index" :style="{ '--fecha-color': fechaColor[index % fechaColor.length].color }">
      <div class="fecha">{{ item.fecha }}</div>
      <h3 class="title">{{ item.title }}</h3>
      <div class="descripcion">{{ item.descripcion }}</div>
      <a class="enlace" :href="item.enlace" target="_blank">Saber más</a>
    </li>
  </ul>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap");

/* Estilos Generales del Componente */
ul {
  margin-top: 2rem;
  --col-gap: 2rem;
  --row-gap: 2rem;
  --line-w: 0.25rem;
  display: grid;
  grid-template-columns: var(--line-w) 1fr;
  grid-auto-columns: max-content;
  column-gap: var(--col-gap);
  list-style: none;
  width: min(60rem, 90%);
  margin-inline: auto;
}

/* Línea vertical */
ul::before {
  content: "";
  grid-column: 1;
  grid-row: 1 / span 20;
  background: var(--color-border); /* Usa el color de borde global */
  border-radius: calc(var(--line-w) / 2);
}

/* Ítems de la lista */
ul li {
  grid-column: 2;
  --inlineP: 1.5rem;
  margin-inline: var(--inlineP);
  grid-row: span 2;
  display: grid;
  grid-template-rows: min-content min-content min-content;
}

ul li:not(:last-child) {
  margin-bottom: var(--row-gap);
}

/* Fecha */
ul li .fecha {
  --dateH: 3rem;
  height: var(--dateH);
  margin-inline: calc(var(--inlineP) * -1);
  text-align: center;
  background-color: var(--fecha-color);
  color: var(--palette-white); /* Texto blanco para contraste en fecha */
  font-size: 1.25rem;
  font-weight: 700;
  display: grid;
  place-content: center;
  position: relative;
  border-radius: calc(var(--dateH) / 2) 0 0 calc(var(--dateH) / 2);
}

/* Triángulo debajo de la fecha */
ul li .fecha::before {
  content: "";
  width: var(--inlineP);
  aspect-ratio: 1;
  background: var(--fecha-color);
  background-image: linear-gradient(rgba(0, 0, 0, 0.2) 100%, transparent);
  position: absolute;
  top: 100%;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  right: 0;
}

/* Círculo en la línea de tiempo */
ul li .fecha::after {
  content: "";
  position: absolute;
  width: 1rem;
  aspect-ratio: 1;
  background: var(--color-background); /* Usa el fondo global */
  border: 0.3rem solid var(--fecha-color);
  border-radius: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  right: calc(100% + var(--col-gap) + var(--line-w) / 2);
}

/* Título y Descripción */
ul li .title,
ul li .descripcion {
  background: var(--color-background-soft); /* Fondo gris oscuro para las tarjetas */
  position: relative;
  padding-inline: 1.5rem;
}

ul li .title {
  overflow: hidden;
  padding-block-start: 1.5rem;
  padding-block-end: 1rem;
  font-weight: 500;
  color: var(--color-heading); /* Título en blanco/claro */
}

ul li .descripcion {
  padding-block-end: 1rem;
  font-weight: 300;
  color: var(--color-text); /* Texto descriptivo en gris claro */
}

/* Enlace "Saber más" */
ul li .enlace {
  background: var(--color-background-soft);
  padding: 0 1.5rem 1.5rem;
  color: var(--color-accent); /* Enlace en rojo */
  font-weight: 500;
  display: block; /* Para que ocupe el ancho disponible si es necesario */
}

ul li .enlace:hover {
  text-decoration: underline;
  color: var(--palette-white);
}


/* Media query para pantallas grandes */
@media (min-width: 40rem) {
  ul {
    grid-template-columns: 1fr var(--line-w) 1fr;
  }
  ul::before {
    grid-column: 2;
  }
  ul li:nth-child(odd) {
    grid-column: 1;
  }
  ul li:nth-child(even) {
    grid-column: 3;
  }
  ul li:nth-child(2) {
    grid-row: 2/4;
  }
  ul li:nth-child(odd) .fecha::before {
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    left: 0;
  }
  ul li:nth-child(odd) .fecha::after {
    transform: translate(-50%, -50%);
    left: calc(100% + var(--col-gap) + var(--line-w) / 2);
  }
  ul li:nth-child(odd) .fecha {
    border-radius: 0 calc(var(--dateH) / 2) calc(var(--dateH) / 2) 0;
  }
}
</style>