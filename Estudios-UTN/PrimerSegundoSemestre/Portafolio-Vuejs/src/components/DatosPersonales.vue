<script setup>
import linkedin from '/src/assets/linkedin_icon.svg';
import instagram from '/src/assets/instagram_icon.svg';
import github from '/src/assets/github_icon.svg';
import cv from '/src/assets/cv_resume_icon.svg';

const title = 'Jairo Wilson Ubilla';
const descripcion = 'Técnico Universitario en Programación - UTN';
const residencia = 'Malargue, Mendoza, Argentina';
const presentacion = 'Hola, Bienvenido a mi portafolio de proyectos. Soy un desarrollador web con experiencia en el desarrollo de aplicaciones web y móviles.';
const redesSociales = [
  { id: 1, name: 'linkedin', src: linkedin, url: 'https://www.linkedin.com/in/jairowilsonubilla/' },
  { id: 2, name: 'Instagram', src: instagram, url: 'https://www.instagram.com/alluresport/' },
  { id: 3, name: 'github', src: github, url: '' },
  { id: 4, name: 'curriculum', src: cv, url: '' },
];
const telefono = '+54 9 2604-204290';
</script>

<template>
  <section class="datos-personales">
    <div class="card">
      <h1>{{ title }}</h1>
      <h2>{{ descripcion }}</h2>
      <p>{{ presentacion }}</p>
      <ul class="container-lista">
        <li v-for="red in redesSociales" :key="red.id">
          <a :href="red.url"><img class="icon-redsocial" :src="red.src" width="35rem" :alt="red.name"></a>
        </li>
      </ul>
      <h3>☎ Mi Teléfono personal: {{ telefono }}</h3>
      <h4>{{ residencia }}</h4>
    </div>
  </section>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  color: var(--color-heading); /* Asegura blanco puro */
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.5rem;
  color: var(--color-accent); /* Rojo para tu título profesional */
  margin-bottom: 1rem;
  font-weight: 500;
}

p {
  font-size: 1.2rem;
  font-weight: 400; /* Un poco menos grueso para mejor lectura */
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.card {
  background-color: var(--color-background-soft); /* Gris oscuro del tema */
  border: 1px solid var(--color-border);
  border-radius: 12px; /* Un poco más redondeado */
  padding: 2rem;
  margin: 10px;
  text-align: center;
}

.container-lista {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Espacio entre iconos */
  list-style: none;
  padding: 0;
  margin: 2rem 0; /* Margen arriba y abajo */
  text-align: center;
}

.icon-redsocial {
  align-items: center;
  background-color: var(--palette-grey-light); /* Fondo claro para que el icono negro se vea bien, o ajusta según tus SVGs */
  border-radius: 50%;
  padding: 8px; /* Un poco más de aire alrededor del icono */
  width: 50px; /* Tamaño fijo para consistencia */
  height: 50px;
  transition: all 0.3s ease; /* Transición suave */
  /* Sombra roja sutil por defecto */
  box-shadow: 0 0 10px rgba(255, 59, 63, 0.2); 
}

.icon-redsocial:hover {
  background-color: var(--color-accent); /* Fondo rojo al pasar el mouse */
  transform: translateY(-5px); /* Pequeño efecto de elevación */
  box-shadow: 0 5px 15px rgba(255, 59, 63, 0.5); /* Sombra roja más intensa */
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-top: 1rem;
}

h4 {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-top: 0.5rem;
  font-weight: 400;
}
</style>