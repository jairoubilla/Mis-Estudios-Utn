// 1.2 Ejercicio: Sobreescritura de métodos Overriding Parte 1 y 2
// Video 01
package test;

import domain.*;

public class TestSobreescritura {

    public static void main(String[] args) {
        Empleado empleado1 = new Empleado("Juan", 10000);//1.3 Polimorfismo Parte 1 y 2
        imprimir(empleado1);
        //System.out.println("empleado1 = " + empleado1.obtenerDetalles());//1.3 Polimorfismo Parte 1 y 2
        Gerente gerente1 = new Gerente("Jose", 5000, "Sistemas");
        imprimir(gerente1);
        //System.out.println("gerente1 = " + gerente1.obtenerDetalles());
    }
    
    // 1.3 Polimorfismo Parte 1 y 2
    public static void imprimir(Empleado empleado){
        System.out.println("empleado = " + empleado.obtenerDetalles());
    }
}
