//En la clase de hoy vamos a ver el manejo de errores en JavaScript, empezamos con:
//Cuando estamos programando siempre existe la posibilidad de que hayan errores, 
// en algunos casos vamos a poder recuperarnos de estos errores y en otros no...

// 4.1 Bloque try catch y finally
//Continuamos con lo que se conoce como cláusula throw, esto es también para el manejo de errores, 
// ahora a través de esto es que podemos arrojar nuestros propios errores..

'use strict'

// Veamos como evitar este error
try {
    let x = 10; //Lo traemos con alt + flecha hacia arriba o abajo
    miFuncion(); //Esta función no existe, por lo que se genera un error
}

catch (error) { //Catchamos el error
    console.log(error);
}

finally { //Finalmente, se ejecuta este bloque de código, sin importar si hubo un error o no
    console.log('Termina la revision de errores');
}

// La ejecucion ahora continua
console.log('Continuamos...');// Si no hubieramos manejado el error, esta linea de codigo no se ejecutaria, pero gracias al manejo de errores, si se ejecuta.

//===========================================

// 4.2 Cláusula throw en JS
// De esta manera es que podemos reportar nuestros propios errores con la cláusula throw.

let resultado = '';

try {
    y = 5;
    if (isNaN(resultado)) throw 'El resultado no es un numero'; // Si el resultado no es un numero, lanzamos un error
    else if (resultado === '') throw 'El resultado esta vacio'; // Si el resultado esta vacio, lanzamos un error
    else if (resultado >= 0) throw 'El resultado es positivo'; // Si el resultado es positivo, lanzamos un error
    else if (resultado < 0) throw 'El resultado es negativo'; // Si el resultado es negativo, lanzamos un error
}

catch (error) {
    console.log(error);
    console.log(error.name);
    console.log(error.message);
}finally {
    console.log('Fin de la revision de errores');
}

