//Comenzamos con funciones de tipo callback con todas las formas de trabajo, junto con el setTimeout y el setInterval:
//6.1 Funciones callback, a continuación una imagen para pensar:

function mifuncio1(){
    console.log("Hola soy la función 1");   
}

function mifuncio2(){
    console.log("Hola soy la función 2");   
}

mifuncio1();
mifuncio2();

// Funciones de tipo callback
let imp = function imprimir(mensaje){
    console.log(mensaje);
}

function sumar(op1, op2, funcionCallback){
    let res = op1 + op2;
    funcionCallback(`El resultado de la suma es: ${res}`);
}   

sumar(5, 3, imp); // El resultado de la suma es: 8

console.log("--------------------------------------------------");

// 6.2 Función setTimeout

// Llamadas asíncronas con setTimeout 
function miFuncionCallback(){
    console.log("Saludo asincronico después de 3 segundos");
}

setTimeout(miFuncionCallback, 3000); // Saludo asincronico después de 3 segundos

setTimeout(function(){ console.log("Saludo asincronico 2")}, 5000); // Saludo asincronico 2

setTimeout(() => console.log("Saludo asincronico 3"), 7000); // Saludo asincronico 3

console.log("--------------------------------------------------");

//6.3 Función setInterval
//Teoría de síncronico y asíncronico: Video 01
// Video 02

let reloj = () => {
    let fecha = new Date();
    console.log(`${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`);
}

setInterval(reloj, 1000); // Muestra la hora cada segundo

