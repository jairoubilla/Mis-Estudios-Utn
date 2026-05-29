// 8.3 Comenzamos Con Excepciones -> Parte 1, 2 , 3 y 4
// Video01
package test;

import static aritmetica.Aritmetica.division; // Del video 03

public class TestExepciones {

    public static void main(String[] args) {
        //int resultado = 10 / 0;
        //System.out.println("resultado = " + resultado);
        //Video02

        int resultado = 0;
        try {
            resultado = 10 / 0;
        } catch (Exception e) {
            System.out.println("Ocurrió un Error");
            e.printStackTrace(System.out); // Se conoce como la pila de excepciones
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
    }
}
