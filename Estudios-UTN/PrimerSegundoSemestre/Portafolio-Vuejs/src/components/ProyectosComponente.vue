<script setup>
import proyecto1 from '/src/assets/restaurant.png';
import proyecto2 from '/src/assets/e-learning.png';
import proyecto3 from '/src/assets/blog.png';
import proyecto4 from '/src/assets/restaurant.png';

// Este componente muestra una galería de proyectos con información sobre cada proyecto
import { ref } from 'vue';
//.ref es una función que se utiliza para crear una referencia reactiva en Vue 3
var misProyectos = ref([]);
//.value es una propiedad que se utiliza para acceder al valor de una referencia reactiva en Vue 3
misProyectos.value = ([
    {
        id: 1,
        src: proyecto1, // Asegúrate de que la imagen coincida (algo de restaurante/comida)
        titulo: "Sistema de Gestión para Restaurantes (2024)",
        descripcion: "Plataforma Full Stack (Node.js, React, MongoDB) para gestión de pedidos en tiempo real, inventario y reservas. Incluye panel administrativo con métricas de ventas.",
        projectoLink: "https://tu-demo-restaurante.netlify.app", // Reemplaza con link real si tienes
        githubLink: "https://github.com/jairowilson/restaurant-management"
    },
    {
        id: 2,
        src: proyecto2, // Imagen relacionada con educación/cursos
        titulo: "Plataforma de E-learning Interactiva (2023)",
        descripcion: "Aplicación web educativa con Django y Vue.js. Permite a instructores crear cursos con video, quizzes y seguimiento de progreso de estudiantes.",
        projectoLink: "https://tu-demo-elearning.vercel.app",
        githubLink: "https://github.com/jairowilson/elearning-platform"
    },
    {
        id: 3,
        src: proyecto3, // Imagen tipo blog/noticias
        titulo: "API RESTful para Blog con CMS Headless (2023)",
        descripcion: "Backend robusto desarrollado en Java Spring Boot con seguridad JWT. Frontend desacoplado en React para un blog rápido y seguro.",
        projectoLink: "https://tu-blog-api-docs.herokuapp.com",
        githubLink: "https://github.com/jairowilson/springboot-blog-api"
    },
    {
        id: 4,
        src: proyecto4, // Imagen de dashboard o app móvil
        titulo: "App Móvil de Seguimiento de Gastos (2022)",
        descripcion: "Aplicación móvil multiplataforma creada con Flutter y Firebase. Permite a usuarios registrar gastos, ver gráficos de consumo y establecer presupuestos.",
        projectoLink: "https://play.google.com/store/apps/details?id=tu.app.gastos", // Si estuviera publicada
        githubLink: "https://github.com/jairowilson/expense-tracker-flutter"
    },
]);

</script>

<template>
    <!-- Aquí va el código HTML de la galería de proyectos -->
    <div class="galeria">
        <!-- Itera sobre cada proyecto en la lista de misProyectos -->
        <!--key es una propiedad especial que se utiliza para identificar de forma única cada elemento en una lista de Vue.js-->
        <li class="proyecto" v-for="proyecto in misProyectos" :key="proyecto.id">
            <!-- Muestra la imagen del proyecto utilizando : que es una directiva de enlace de atributo en Vue.js -->
            <img :src="proyecto.src" :alt="proyecto.titlulo">
            <div class="proyecto-info">
                <!-- Muestra el título y la descripción del proyecto utilizando la interpolación de Vue.js -->
                <h3>{{ proyecto.titulo }}</h3>
                <p>{{ proyecto.descripcion }}</p>
                <div class="proyecto-links">
                    <a :href="proyecto.projectoLink" class="btn-ver-mas" target="_blank" rel="noopener noreferrer">Ver
                        Proyecto</a>
                    <a :href="proyecto.githubLink" class="github-link" target="_blank" rel="noopener noreferrer">Ver
                        Código en GitHub</a>
                </div>
            </div>
        </li>
    </div>
</template>

<style scoped>
.galeria {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
    /* Usamos el fondo principal del tema en lugar del gradiente antiguo */
    background-color: var(--color-background); 
}

.proyecto {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--color-background-soft);
    max-width: 222px;
    flex: 1 1 300px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Efecto hover para las tarjetas de proyecto */
.proyecto:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* Sombra más profunda */
    border-color: var(--color-accent); /* Borde rojo al pasar el mouse */
}

.proyecto img {
    width: 100%;
    height: auto;
    display: block;
    filter: brightness(0.8); 
    transition: filter 0.3s ease;
}

.proyecto:hover img {
    filter: brightness(1); 
}

.proyecto-info {
    padding: 15px;
    text-align: center;
}

.proyecto-info h3 {
    margin: 10px 0;
    font-size: 1.3em;
    color: var(--color-heading); /* Título en blanco */
    font-weight: bold;
}

.proyecto-info p {
    margin: 10px 0;
    font-size: 1em;
    color: var(--color-text); /* Texto descriptivo en gris claro */
}

.proyecto-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 30px;
}

.proyecto-links .btn-ver-mas {
    /* Botón principal en rojo */
    background-color: var(--color-accent);
    color: var(--palette-white);
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
    font-weight: bold;
}

.proyecto-links .btn-ver-mas:hover {
    /* Rojo más oscuro al hacer hover */
    background-color: var(--palette-red-soft); 
}

.proyecto-links .github-link {
    /* Enlace secundario en gris, cambia a blanco/rojo al hover */
    color: var(--palette-grey-mute);
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.3s ease;
}

.proyecto-links .github-link:hover {
    text-decoration: underline;
    color: var(--color-accent); /* Rojo al pasar el mouse */
}
</style>