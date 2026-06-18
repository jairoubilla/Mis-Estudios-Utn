//10.3 Creamos el Menu -> Parte 1

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ListadoPersonasApp {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        // Definimos la lista fuera del ciclo while
        List<Persona> personas = new ArrayList<>();
        //Empezamos con el menu
        var salir = false;
        while(!salir){
            mostrarMenu();

            //10.4 Agregamos el try catch y el mtodo ejecutarOperación() Incorporamos lambda y el mtodo por referencia
            //parte 01
            try{
                salir = ejecutarOperacion(entrada, personas);
            } catch (Exception e){
                System.out.println("Ocurrio un error: "+e.getMessage());
            }
            System.out.println();
        }// Fin del ciclo while
    }// Fin del metodo main

    // 10.3 Creamos el Menu -> Parte 2
    private static void mostrarMenu(){
        // Mostramos las opciones
        System.out.print("""
                ********** Listado de Personas **********
                1. Agregar
                2. Listar
                3. Salir
                """);
        System.out.print("Digite una de las opciones: ");
    } // Fin del metodo mostrarMenu

    //10.4 Agregamos el try catch parte 02
    private static boolean ejecutarOperacion(Scanner entrada, List<Persona> personas){
        var opcion = Integer.parseInt(entrada.nextLine());
        var salir = false;
        //Revisamos la opcion digitada a traves de un switch
        switch (opcion){
            case 1 -> {//Agregar una persona a la lista
                System.out.print("Digite el nombre: ");
                var nombre = entrada.nextLine();
                System.out.print("Digite el telefono: ");
                var tel = entrada.nextLine();
                System.out.print("Digite el correo: ");
                var email = entrada.nextLine();
                //Creamos el objeto persona
                var persona = new Persona(nombre, tel, email);
                //Agregamos la persona a la lista
                personas.add(persona);
                System.out.println("La lista tiene: "+personas.size()+" elementos");
            }//Fin del caso 1
            // 10.4 Agregamos el try catch parte 03
            case 2 -> { // Listar a las personas
                System.out.println("Listado de personas: ");
                // Mejoras con lambda y el metodo de referencia
                //personas.forEach((persona) -> System.out.println(persona));
                personas.forEach(System.out::println);
            }// Fin caso 2
            // 10.4 Agregamos el try catch parte 04
            case 3 -> {//Salir del ciclo
                System.out.println("Hasta pronto ...");
                salir = true;
            } // Fin del caso 3
            default -> System.out.println("Opción incorrecta: "+opcion);
        }// Fin del switch
        return salir;
    }// Fin del metodo ejecutarOperacion

}// Fin de la clase ListadoPersonasApp