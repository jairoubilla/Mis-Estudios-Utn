// 1.5 Instance of Parte 1 y 2
// Video 01 y 02
package test;

import domain.*;

public class TestInstanceOf {

    public static void main(String[] args) {
        Empleado empleado1 = new Empleado("Juan", 10000);
        determinarTipo(empleado1);
        empleado1 = new Gerente("Jose", 5000, "Sistemas");
        determinarTipo(empleado1);
    }
    
    public static void determinarTipo(Empleado empleado){
        if(empleado instanceof Gerente){
            System.out.println("Es de tipo Gerente");
            // 1.6 Ejercicio con instanceof Parte 1 y 2
            Gerente gerente = (Gerente)empleado;
            //((Gerente) empleado).getDepartamento();
            System.out.println("gerente = " + gerente.getDepartamento());
        }
        else if(empleado instanceof Empleado){
            System.out.println("Es de tipo Empleado");
            // Gerente gerente = (Gerente)empleado;
            // System.out.println("gerente = " + gerente.getDepartamento());
        }
        else if(empleado instanceof Object){
            System.out.println("Es de tipo Object");
        }
    }
}
