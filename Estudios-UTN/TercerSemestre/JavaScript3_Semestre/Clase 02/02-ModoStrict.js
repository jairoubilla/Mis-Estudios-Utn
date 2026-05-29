// Clase 02 - Modo Estricto en JavaScript
// Video 01

"use strict"; 

//x = 10; // Esto generará un error porque x no ha sido declarada previamente.
let x = 10;
console.log(x);

function miFuncion() {
    //"use strict"; // Activamos el modo estricto dentro de la función.
    let y = 20; // Esto también generará un error porque y no ha sido declarada previamente.
    console.log(y);
}
miFuncion(); // Esto también generará un error porque miFuncion no ha sido definida.
