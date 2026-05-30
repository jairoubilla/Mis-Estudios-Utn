// 8.3 Comenzamos Con Excepciones -> Parte 1, 2 , 3 y 4
// Video01
package test;

import static aritmetica.Aritmetica.division; // Del video 03
import excepciones.OperacionExcepcion;
import excepciones.OperacionExepcion;

public class TestExepciones {

    public static void main(String[] args) throws OperacionExepcion {
        //int resultado = 10 / 0;
        //System.out.println("resultado = " + resultado);
        //Video02

        int resultado = 0;
        try {
            resultado = 10 / 0;
        } catch (Exception e) {
            System.out.println("Ocurrió un Error");
            e.printStackTrace(System.out); // Se conoce como la pila de excepciones
            System.out.println(e.getMessage());
        }
        System.out.println("La variable de resultado tiene como valor: " + resultado);

        System.out.println("**************");

        // Video 03
        try {
            resultado = division(10, 0);
        } catch (Exception e) {
            System.out.println("Ocurrió un Error");
            e.printStackTrace(System.out); // Se conoce como la pila de excepciones
        }
        System.out.println("La variable de resultado tiene como valor: " + resultado);

        System.out.println("**************");

        //8.5 Comenzamos a hacer pruebas con RuntimeException (unchecked)
        //int resultado = 0;
        //resultado = division(10, 0);
        System.out.println("La variable de resultado tiene como valor: " + resultado);

        System.out.println("***************");

        // 8.6 Agregamos el finally y catch
        try {
            resultado = 10 / 0;
        } catch (OperacionExcepcion e) {
            System.out.println("Ocurrio un error de tipo OperacionExepcion");
            System.out.println(e.getMessage());
        } catch (Exception e) {
            System.out.println("Ocurrió un Error");
            e.printStackTrace(System.out); // Se conoce como la pila de excepciones
            System.out.println(e.getMessage());
        } finally {
            System.out.println("Se reviso la division entre cero");
        }
        System.out.println("La variable de resultado tiene como valor: " + resultado);
    }
}
