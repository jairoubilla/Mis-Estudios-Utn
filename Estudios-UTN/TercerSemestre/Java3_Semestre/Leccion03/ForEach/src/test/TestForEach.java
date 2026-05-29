//Clase 03
//1.1 Manejo del forEach Parte 1 y 2
// Video 01

package test;

import domain.Persona;

public class TestForEach {

    public static void main(String[] args) {
        int edades[] = {5, 6, 8, 9}; //Sintaxis resumida
        for (int edad : edades) { //Sintaxis del ForEach
            System.out.println("edad = " + edad);
        }
        
        // Video 02
        
        Persona personas[] = {new Persona("Juan"), new Persona("Carla"), new Persona("Beariz")};
        
        //ForEach
        for(Persona persona: personas){
            System.out.println("persona = " + persona);
        }
    }
}
