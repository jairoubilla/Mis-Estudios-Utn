// 1.2 Manejo de Enumeraciones (enum)
package test;

import Enumeraciones.Dias;

public class TestEnumeraciones {

    public static void main(String[] args) {
        System.out.println("Dia 1: " + Dias.LUNES); 
        indicarDiaSemana(Dias.LUNES);// Las enumeraciones se tratan como cadenas
        // Ahora no se deben utilizar comillas, se accede atraves del operador de punto
    }
    
    // 1.3 Pruebas de enum, con la creación de enum Continentes

    private static void indicarDiaSemana(Dias dias) {
        switch (dias) {
            case LUNES:
                System.out.println("Primer dia de la semana");
                break;

            case MARTES:
                System.out.println("Segundo dia de la semana");
                break;

            //Agregar todos los dias de la semana
            case MIERCOLES:
                System.out.println("Tercer dia de la semana");
                break;

            case JUEVES:
                System.out.println("Cuarto dia de la semana");
                break;

            case VIERNES:
                System.out.println("Quinto dia de la semana");
                break;

            case SABADO:
                System.out.println("Sexto dia de la semana");
                break;

            case DOMINGO:
                System.out.println("Septimo dia de la semana");
                break;
                
            default:
                System.out.println("Dia incorrecto, intente nuevamente");

        }
    }
}
