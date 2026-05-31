// 1 será piedra 2 será papel y 3 será tijera
// Boton reiniciar juego

function reiniciarJuego() {

    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function eleccion(jugada) {
        let resultado = "";
        if (jugada == 1) {
            resultado = "piedra 🪨";
        } else if (jugada == 2) {
            resultado = "papel 📄";
        } else if (jugada == 3) {
            resultado = "tijera ✂️";
        } else {
            resultado = "perder 😢";
        }
        return resultado;
    }

    let jugador = 0;
    let pc = 0;
    let triunfos = 0;
    let derrotas = 0;

    while (triunfos < 3 && derrotas < 3) {
        pc = aleatorio(1, 3);
        jugador = prompt("Elige: 1 para piedra, 2 para papel, 3 para tijera");
        // alert("Elige jugador: " + jugador)
        alert("PC elige: " + eleccion(pc));
        alert("Jugador elige: " + eleccion(jugador));

        // Combate
        if (pc == jugador) {
            alert("EMPATE");
        } else if (jugador == 1 && pc == 3) {
            alert("GANASTE");
            triunfos++;
        } else if (jugador == 2 && pc == 1) {
            alert("GANASTE");
            triunfos++;
        } else if (jugador == 3 && pc == 2) {
            alert("GANASTE");
            triunfos++;
        } else {
            alert("PERDISTE");
            derrotas++;
        }
    }
    
    alert("Ganaste: " + triunfos + " veces");
    alert("Perdiste: " + derrotas + " veces");
}


