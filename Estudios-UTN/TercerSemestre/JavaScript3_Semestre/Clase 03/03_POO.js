// Clase 03 3.1 Vamos a seguir trabajando en el código que tenemos con las clases de Empleado y Gerente,
//  vamos a crear un nuevo método, para conocer el polimorfismo:

class Empleado{
    constructor(nombre, sueldo) {
        this._nombre = nombre;
        this._sueldo = sueldo;
    }

    obtenerDetalles(){
        return `Empleado: nombre: ${this._nombre}, sueldo: ${this._sueldo}`;
    }
}

class Gerente extends Empleado{
    constructor(nombre, sueldo, departamento) {
        super(nombre, sueldo);
        this._departamento = departamento;
    }

    // Agregamos la sobrescritura
    obtenerDetalles(){
        return `Gerente: ${super.obtenerDetalles()}, departamento: ${this._departamento}`;
    }
}

function imprimir(tipo){ //Reccibe una variable
    console.log(tipo.obtenerDetalles()); // Segun el tipo que le pasemos, sera la inormacion
    
//3.2 Vamos a ver lo que se conoce como: instanceof
//Esta es una palabra reservada y la vamos a utilizar dentro del método que utilizamos para el polimorfismo:

    if(tipo instanceof Gerente){ // Si el tipo es una instancia de gerente, se ejecuta el siguiente codigo
        console.log('Es un objeto de tipo gerente');
        console.log(tipo._departamento); // Accedemos al departamento del gerente
    }
    else if(tipo instanceof Empleado){ // Si el tipo es una instancia de empleado, se ejecuta el siguiente codigo
        console.log('Es un objeto de tipo empleado');
        console.log(tipo._departamento); // Accedemos al departamento del empleado, pero como no existe, nos devuelve undefined
    }
    else if(tipo instanceof Object){ // Si el tipo es una instancia de object, se ejecuta el siguiente codigo
        console.log('Es un objeto de tipo object');
    }
}

let gerente1 = new Gerente('Juan', 5000, 'Sistemas');
console.log(gerente1.obtenerDetalles()); // Objeto de la clase hija

let empleado1 = new Empleado('Pedro', 3000);
console.log(empleado1.obtenerDetalles()); // Objeto de la clase padre

imprimir(gerente1); // Polimorfismo, se ejecuta el método de la clase hija
imprimir(empleado1); // Polimorfismo, se ejecuta el método de la clase padre