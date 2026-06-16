# Avatar - La leyenda de Aang

Proyecto web inspirado en *Avatar: La leyenda de Aang*. Actualmente funciona como un juego sencillo en el navegador: el jugador elige un personaje, se genera un enemigo aleatorio y ambos combaten por rondas usando ataques tipo piedra, papel o tijera.

## Estado actual

El proyecto ya cuenta con una version jugable basica.

Funcionalidades implementadas:

- Estructura HTML del juego.
- Hoja de estilos CSS para centrar la interfaz, ordenar las secciones y mejorar los botones.
- Seleccion de personaje mediante botones de opcion.
- Boton para confirmar el personaje elegido.
- Validacion para evitar continuar sin seleccionar personaje.
- Muestra en pantalla el personaje seleccionado por el jugador.
- Seleccion aleatoria de un personaje enemigo.
- Validacion para que el enemigo no sea el mismo personaje que eligio el jugador.
- Popup de reglas con boton para abrir y cerrar.
- Seleccion de ataques: Punio, Patada y Barrida.
- Ataque enemigo generado de forma aleatoria.
- Logica de combate por rondas:
  - Patada vence a Punio.
  - Punio vence a Barrida.
  - Barrida vence a Patada.
  - Ataques iguales generan empate.
- Contador de 3 vidas para jugador y enemigo.
- Descuento de vidas segun el ganador de cada ronda.
- Mensajes dinamicos con el ataque del jugador, el ataque enemigo y el resultado del round.
- Deteccion de ganador final cuando alguno llega a 0 vidas.
- Deshabilitado de ataques al finalizar la partida.
- Boton de reinicio que recarga el juego.
- Adaptacion simple del boton de reglas para pantallas chicas.

## Personajes disponibles

- Zuko
- Katara
- Aang
- Toph

## Ataques disponibles

- Punio
- Patada
- Barrida

## Estructura del proyecto

```text
public/
|-- avatar.html
|-- README.md
|-- css/
|   `-- avatar.css
`-- js/
    `-- avatar.js
```

## Archivos principales

### `avatar.html`

Contiene la estructura visual de la pagina:

- Titulo del juego.
- Contenedor principal de la interfaz.
- Boton y popup de reglas.
- Seccion para elegir personaje.
- Seccion para elegir ataques.
- Marcadores de vidas del jugador y del enemigo.
- Seccion de mensajes del combate.
- Boton de reinicio.
- Conexion con los archivos `css/avatar.css` y `js/avatar.js`.

### `css/avatar.css`

Contiene los estilos de la interfaz:

- Centrado general de la pagina.
- Estilos para secciones, botones y dialogo de reglas.
- Colores diferenciados para acciones principales y reinicio.
- Contenedor del juego con posicionamiento del boton de reglas.
- Media query para acomodar el boton de reglas en pantallas chicas.

### `js/avatar.js`

Contiene la logica del juego:

- `iniciarJuego()`: espera a que la pagina cargue y conecta los botones con sus eventos.
- `seleccionarPersonajeJugador()`: detecta que personaje eligio el jugador, lo muestra en pantalla y valida que exista una seleccion.
- `seleccionarPersonajeEnemigo()`: genera un personaje enemigo de forma aleatoria y evita que coincida con el personaje del jugador.
- `ataquePunio()`, `ataquePatada()` y `ataqueBarrida()`: guardan el ataque del jugador e inician el combate.
- `ataqueAleatorioEnemigo()`: elige aleatoriamente el ataque enemigo.
- `combate()`: compara ataques, define el resultado del round, descuenta vidas y muestra mensajes.
- `revisarVidas()`: comprueba si la partida termino.
- `finalizarJuego()`: muestra el resultado final y deshabilita los botones de ataque.
- `reiniciarJuego()`: recarga la pagina para iniciar una nueva partida.
- `aleatorio()`: helper para generar numeros aleatorios dentro de un rango.

## Como ejecutar el proyecto

No requiere instalacion de dependencias. Para probarlo, abrir el archivo:

```text
public/avatar.html
```

en un navegador web.

## Pendiente por implementar

- Mejorar la codificacion de caracteres para que emojis y acentos se vean correctamente.
- Ocultar o bloquear la seccion de ataques hasta que el jugador elija personaje.
- Mejorar la experiencia visual con estilos mas tematicos de Avatar.
- Mostrar historial de rondas en lugar de reemplazar siempre el ultimo mensaje.
- Evitar que se pueda cambiar de personaje despues de comenzar la partida.
