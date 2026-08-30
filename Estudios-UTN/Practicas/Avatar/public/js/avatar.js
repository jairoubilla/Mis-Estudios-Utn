let ataqueJugador; // ataque del jugador
let ataqueEnemigo; // ataque de la computadora
let vidasJugador = 3; // vidas del jugador
let vidasEnemigo = 3; // vidas del enemigo

// --- Variables globales ---
const botonPunio = document.getElementById('boton-punio');
const botonPatada = document.getElementById('boton-patada');
const botonBarrida = document.getElementById('boton-barrida');
const botonReiniciar = document.getElementById('boton-reiniciar');
const botonPersonajeJugador = document.getElementById('boton-personaje');
const popupReglas = document.getElementById('popup-reglas');
const botonReglas = document.getElementById('boton-reglas');
const botonCerrarReglas = document.getElementById('boton-cerrar-reglas');
const spanPersonajeJugador = document.getElementById('personaje-jugador');
const opcionesPersonajes = document.getElementsByName('personaje');
const spanPersonajeEnemigo = document.getElementById('personaje-enemigo');
const spanVidasJugador = document.getElementById('vidas-jugador');
const spanVidasEnemigo = document.getElementById('vidas-enemigo');
const sectionMensajes = document.getElementById('mensajes');

function iniciarJuego() {
    botonPersonajeJugador.addEventListener('click', seleccionarPersonajeJugador);
    botonPunio.addEventListener('click', ataquePunio);
    botonPatada.addEventListener('click', ataquePatada);
    botonBarrida.addEventListener('click', ataqueBarrida);
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // Abre el popup
    botonReglas.addEventListener('click', () => {
        popupReglas.showModal(); 
    });

    // Cierra el popup
    botonCerrarReglas.addEventListener('click', () => {
        popupReglas.close();
    });
}

function seleccionarPersonajeJugador() {
    let personajeSeleccionado = "";
    // Opcion 1 y Opcion 2 hacen lo mismo
    // Opcion 1 
    // uso de bucle for
    for (let i = 0; i < opcionesPersonajes.length; i++) {
        if (opcionesPersonajes[i].checked) {
            personajeSeleccionado = opcionesPersonajes[i].id;
            break; 
        }
    }

    // Opcion 2
    // uso de condicionales if-else 
/*
    if (document.getElementById('zuko').checked) {
        personajeSeleccionado = "Zuko";
    } else if (document.getElementById('katara').checked) {
        personajeSeleccionado = "Katara";
    } else if (document.getElementById('aang').checked) {
        personajeSeleccionado = "Aang";
    } else if (document.getElementById('toph').checked) {
        personajeSeleccionado = "Toph";
    }
*/

    // muestro el personaje seleccionado
    if (personajeSeleccionado !== "") {
        spanPersonajeJugador.innerHTML = personajeSeleccionado.toUpperCase();

        seleccionarPersonajeEnemigo(personajeSeleccionado);
    } else {
        alert('POR FAVOR, SELECCIONA UN PERSONAJE ANTES DE CONTINUAR.');
    }
}

function seleccionarPersonajeEnemigo(personajeJugador) {
    let personajeEnemigo = "";
    // Si el personaje elegido es igual al nuestro vuelve repetir el codigo
    do {
        const numeroAleatorio = Math.floor(Math.random() * (4 - 1 + 1) + 1);

        if (numeroAleatorio === 1) {
            personajeEnemigo = "zuko";
        } else if (numeroAleatorio === 2) {
            personajeEnemigo = "katara";
        } else if (numeroAleatorio === 3) {
            personajeEnemigo = "aang";
        } else if (numeroAleatorio === 4) {
            personajeEnemigo = "toph";
        }
    } while (personajeEnemigo == personajeJugador);

    spanPersonajeEnemigo.innerHTML = personajeEnemigo.toUpperCase();
}

// Al presionar cada botón selecionamos el ataque y llamamos la funcion del combate
function ataquePunio() {
    ataqueJugador = 'Puño';
    funcionCombate();
}

function ataquePatada() {
    ataqueJugador = 'Patada';
    funcionCombate();
}

function ataqueBarrida() {
    ataqueJugador = 'Barrida';
    funcionCombate();
}

function funcionCombate() {
    // Verificamos que se haya elegido un personaje antes de comenzar la batalla
    if (spanPersonajeJugador.innerHTML === "") {
        alert('Primero debes seleccionar un personaje.');
        return;
    }

    ataqueAleatorioEnemigo();
    combate();
}

// ----------------------------------------------------------------------------------------------------------
// Agregamos la logica de la batalla
function combate() {
    let resultadoRound = "";

    // Caso de Empate
    if (ataqueJugador === ataqueEnemigo) {
        resultadoRound = "EMPATE 🤝";
    } 
    // Casos donde GANA el Jugador
    else if ((ataqueJugador === 'Patada' && ataqueEnemigo === 'Puño') ||
        (ataqueJugador === 'Puño' && ataqueEnemigo === 'Barrida') ||
        (ataqueJugador === 'Barrida' && ataqueEnemigo === 'Patada')) {
            resultadoRound = "GANASTE EL ROUND 🎉";
            vidasEnemigo--; // Restamos vida al enemigo
            spanVidasEnemigo.innerHTML = vidasEnemigo; 
    } 
    // Si no es empate ni gano el jugador, gano el enemigo
    else {
        resultadoRound = "PERDISTE EL ROUND ❌";
        vidasJugador--; // Restamos vida al jugador
        spanVidasJugador.innerHTML = vidasJugador; 
    }

    // Mostramos que ataque elegimos nosotros y que eligió la máquina
    sectionMensajes.innerHTML = `<p>Tu personaje atacó con <strong>${ataqueJugador}</strong>, el enemigo atacó con <strong>${ataqueEnemigo}</strong> - <strong>${resultadoRound}</strong></p>`;

    // Chequeamos si aun los jugadores tienen vidas
    revisarVidas();
}

function revisarVidas() {
    if (vidasJugador === 0) {
        finalizarJuego("El enemigo te ha derrotado... 😢");
    } else if (vidasEnemigo === 0) {
        finalizarJuego("¡Felicidades! Has ganado 🏆");
    }
}

function finalizarJuego(mensajeFinal) {
    sectionMensajes.innerHTML = `<p style="font-size: 1.2em; color: red;"><strong>${mensajeFinal}</strong></p>`;

    // Deshabilitamos los botones para que no puedan seguir jugando tras terminar
    botonPunio.disabled = true;
    botonPatada.disabled = true;
    botonBarrida.disabled = true;   
}

function reiniciarJuego() {
    location.reload();
}
// -------------------------------------------------------------------------------------------------------

function ataqueAleatorioEnemigo() {
    const ataqueAleatorio = aleatorio(1, 3);

    if (ataqueAleatorio == 1) {
        ataqueEnemigo = 'Puño';
    } else if (ataqueAleatorio == 2) {
        ataqueEnemigo = 'Patada';
    } else {
        ataqueEnemigo = 'Barrida';
    }
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener('load', iniciarJuego);