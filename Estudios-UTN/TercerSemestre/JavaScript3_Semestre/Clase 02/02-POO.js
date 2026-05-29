// 2.2 Repasamo la sobreescritura ahora en JavaScript

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

let gerente1 = new Gerente('Juan', 5000, 'Sistemas');
console.log(gerente1.obtenerDetalles()); // Objeto de la clase hija

let empleado1 = new Empleado('Pedro', 3000);
console.log(empleado1.obtenerDetalles()); // Objeto de la clase padre

