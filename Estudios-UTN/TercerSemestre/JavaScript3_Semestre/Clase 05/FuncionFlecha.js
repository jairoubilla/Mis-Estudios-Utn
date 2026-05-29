// La clase de hoy tiene como proposito general que conozcamos en profundidad las Arrow Function, funciones flecha:
// 5.1 Comenzamos con los ejemplos clásicos

function miFuncion() {
    console.log('Saludos desde miFuncion');
}
miFuncion(); 

let myFuncion = function() {
    console.log('Saludos desde la funcion anonima');
};

// Ahora vamos a crear una funcion flecha
let myFuncionFlecha = () => {
    console.log('Saludos desde la funcion flecha');
};

// Hay mas variantes para funciones flecha que vamos a ir viendo

myFuncionFlecha();

// =============================================

// 5.2 Avanzamos en diferentes ejemplos
// Video 01

// Lo hacemos en una linea
const saludar = () => console.log('Saludos desde la funcion flecha en una linea'); 

saludar();

// Otro ejemplo
const saludar2 = () => {
    return 'Saludos desde la funcion flecha con return';    
}

console.log(saludar2());

// Simplificamos la funcion anterior
const saludar3 = () => 'Saludos desde la funcion flecha simplificada';

console.log(saludar3());

//=============================================

// Video 02

// Continuamos con otro ejemplo
const retornarObjeto = () => ({nombre: 'Juan', apellido: 'Perez'}); // Para retornar un objeto, debemos envolverlo entre parentesis, de lo contrario se interpreta como el bloque de codigo de la funcion flecha

console.log(retornarObjeto());

// Funciones flechas que reciben parametros
const funcionParametros = (mensaje) => console.log(mensaje);

funcionParametros('Saludos desde la funcion flecha con parametros');

// Una funcion clasica
const funcionParametrosClasica = function(mensaje) {
    console.log(mensaje);
}
funcionParametrosClasica('Saludos desde la funcion clasica con parametros');

//Se pueden omitir los parentesis si solo hay un parametro
const funcionParametroUnico = mensaje => console.log(mensaje);

funcionParametroUnico('Saludos desde la funcion flecha con un parametro sin parentesis');

// ==============================================

// Video 03

// Ahora vemos funciones flechas con mas de un parametro
// Podemos abrir la funcion y tener mas cosas dentro de ella

const funcionVariosParametros = (op1, op2) => {
    let resultado = op1 + op2;
    return resultado;
}

console.log(funcionVariosParametros(5, 3));

