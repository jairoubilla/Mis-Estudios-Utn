# Avatar - La leyenda de Aang

Proyecto web en desarrollo inspirado en *Avatar: La leyenda de Aang*. La idea actual es construir un juego sencillo en el navegador donde el jugador elige un personaje, se genera un enemigo aleatorio y luego se preparan ataques por elemento.

## Estado actual

El proyecto ya cuenta con una primera pantalla funcional de seleccion de personaje.

Funcionalidades implementadas:

- Estructura HTML inicial del juego.
- Seleccion de personaje mediante botones de opcion.
- Boton para confirmar el personaje elegido.
- Validacion para evitar continuar sin seleccionar personaje.
- Muestra en pantalla el personaje seleccionado por el jugador.
- Seleccion aleatoria de un personaje enemigo.
- Validacion para que el enemigo no sea el mismo personaje que eligio el jugador.
- Secciones preparadas para ataques, mensajes de combate y reinicio.

## Personajes disponibles

- Zuko
- Katara
- Aang
- Toph

## Estructura del proyecto

```text
public/
|-- avatar.html
|-- README.md
`-- js/
    `-- avatar.js
```

## Archivos principales

### `avatar.html`

Contiene la estructura visual de la pagina:

- Titulo del juego.
- Seccion para elegir personaje.
- Seccion para elegir ataques.
- Seccion de mensajes del combate.
- Boton de reinicio.
- Conexion con el archivo JavaScript `js/avatar.js`.

### `js/avatar.js`

Contiene la logica inicial del juego:

- `iniciarJuego()`: espera a que la pagina cargue y conecta el boton de seleccion con su evento.
- `seleccionarPersonajeJugador()`: detecta que personaje eligio el jugador, lo muestra en pantalla y valida que exista una seleccion.
- `seleccionarPersonajeEnemigo()`: genera un personaje enemigo de forma aleatoria y evita que coincida con el personaje del jugador.

## Como ejecutar el proyecto

No requiere instalacion de dependencias. Para probarlo, abrir el archivo:

```text
public/avatar.html
```

en un navegador web.

## Pendiente por implementar

- Logica de ataques por elemento.
- Reglas para determinar ganador de cada ronda.
- Contador real de vidas del jugador y del enemigo.
- Mensajes dinamicos segun el resultado del combate.
- Funcionamiento del boton de reinicio.
- Estilos CSS para mejorar la interfaz.
- Correccion de codificacion de caracteres para que los emojis y acentos se vean correctamente.
