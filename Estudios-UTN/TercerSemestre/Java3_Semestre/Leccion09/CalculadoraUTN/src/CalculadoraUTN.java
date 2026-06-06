//9.2 Definiendo las variables

import java.util.Scanner;

public class CalculadoraUTN {

    public static void main(String[] args) {
        System.out.println("******** Aplicacion Calculadora ********");
        //var operando1 = 10;
        //var operando2 = 20;
        //var resultado = operando1 + operando2;
        //System.out.println("resultado = " + resultado);

        System.out.println("********************");

        // 9.3 Ponemos la entrada de información

        Scanner entrada = new Scanner(System.in);
        while (true){ //Ciclo infinito //9.6 Ciclo y su salida con break
            System.out.println("******** Aplicacion Calculadora ********");
            mostrarMenu();

            // 9.7 Agregamos try catch para las excepciones
            try {
                var operacion = Integer.parseInt(entrada.nextLine());
                if (operacion >= 1 && operacion <= 4){
                    ejecutarOperacion(operacion, entrada);
                } //Fin del if
                else if (operacion == 5) {
                    System.out.println("Hasta pronto...");
                    break;//9.6 Ciclo y su salida con break
                }
                else {
                    System.out.println("Opcion erronea"+operacion);
                }
                //Imprimimos un salto de linea antes de repetir el menu
                System.out.println();//9.6 Ciclo y su salida con break
                // 9.7 Agregamos try catch para las excepciones
            } catch (Exception e){ //Fin try, comienzo del catch
                System.out.println("Ocurrio un error: "+e.getMessage());
                System.out.println();
            }

        }// Fin while
    }// Fin main

    // 9.8 Factorizamos el código a través del mtodo mostrarMenu
    private static void mostrarMenu(){
        //9.4 Cargamos el menú
        // Mostarmos el menu
        System.out.println("""
                1. Suma
                2. Resta
                3. Multiplicacion
                4. Division
                5. Salir
                """);
        System.out.print("Operacion a realizar?");
    } // Fin metodo mostrar menu

    //9.9 Función ejecutarOperacion y pruebas
    private static void ejecutarOperacion(int operacion, Scanner entrada){

        // 9.5 Agregamos el switch
        System.out.println("Digite el valor para el operando1: "); // 9.3 Ponemos la entrada de información
        var operando1 = Double.parseDouble(entrada.nextLine());
        System.out.println("Digite el valor para el operando2: ");
        var operando2 = Double.parseDouble(entrada.nextLine());
        var resultado1 = operando1 + operando2;
        System.out.println("resultado = " + resultado1);
        Double resultado;
        switch (operacion){ //Suma
            case 1 -> {
                resultado = operando1 + operando2;
                System.out.println("Resultado de la suma: "+resultado);
            }
            case 2 -> { //Resta
                resultado = operando1 - operando2;
                System.out.println("Resultado de la resta: "+resultado);
            }
            case 3 -> {//Multiplicacion
                resultado = operando1 * operando2;
                System.out.println("Resultado de la multiplicacion: "+resultado);
            }
            case 4 -> {
                resultado = operando1 / operando2;
                System.out.println("Resultado de la division: "+resultado);
            }
            default -> System.out.println("Opcion erronea"+operacion);
        } //Fin switch
    } //Fin metodo ejecutar operacion
} // Fin clase
