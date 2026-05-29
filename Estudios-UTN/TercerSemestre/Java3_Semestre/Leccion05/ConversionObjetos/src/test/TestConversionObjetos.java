// 5.2 Pruebas con Downcasting y Upcasting: Parte 1 y 2
// Video 01
package test;

import domain.*;

public class TestConversionObjetos {

    public static void main(String[] args) {
        Empleado empleado;
        empleado = new Escritor("Juan", 5000, TipoEscritura.CLASICO);
        //System.out.println("empleado="+empleado);
        //System.out.println(empleado.obtenerDetalles()); //Si queremos acceder a metodos Escritor
        //Downcasting
        //((Escritor)empleado).getTipoEscritura();//Tenemos 2 opciones: esta es una
        Escritor escritor = (Escritor) empleado; //Esta es la segunda opcion
        escritor.getTipoEscritura();

        //Upcasting
        Empleado empleado2 = escritor;
        System.out.println(empleado2.obtenerDetalles());
    }
}
