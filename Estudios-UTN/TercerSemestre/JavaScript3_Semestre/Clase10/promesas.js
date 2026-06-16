//Clase09
//10.2 Promesas: La práctica con la función .then

let miPromesa = new Promise((resolver, rechazar) => {
    let expresion = true;
    if(expresion){
        resolver("Resolvio correctamente");
    }else{
        rechazar("Se produjo un error");
    }
});

//miPromesa.then(
  //  valor => console.log(valor),
    //error => console.log(error)
//);

// 10.3 Promesas: La práctica con la función .catch

//miPromesa
//    .then(valor => console.log(valor))
//    .catch(error => console.log(error));

// 10.4 Función setTimeout y Promesas -> Arreglamos un error

let promesa = new Promise((resolver) => {
    setTimeout(() => resolver('Saludos desde promesa, callback, funcion flecha y setTimeout'), 3000);
});

// El llamado a la promesa utilizando settimeout y función flecha
//promesa.then(valor => console.log(valor));

// 10.5 Palabra async con promesas

// async indica que una funcion regresa una promesa

async function miFuncionConPromesa(){
    return "Saludos con promesa y async";
}

//miFuncionConPromesa().then(valor => console.log(valor));

// 10.6 Palabra await y async con promesas

//async / await
async function funcionConPromesaYAwait(){
    let miPromesa = new Promise(resolver => {
        resolver("Saludos con promesa, async y await");
    });
    console.log(await miPromesa);
}

//funcionConPromesaYAwait();

// 10.7 Promesas con await, async y setTimeout
// Promesas, await, async y setTimeout
async function funcionConPromesaAwaitYSetTimeout(){
    let miPromesa = new Promise(resolver => {
        console.log("Inicio de la promesa");
        setTimeout(() => resolver("Promesa await y Timeout"), 3000);
        console.log("Fin de la promesa");
    });
    console.log(await miPromesa);
}

// Llamamos a la función
funcionConPromesaAwaitYSetTimeout();