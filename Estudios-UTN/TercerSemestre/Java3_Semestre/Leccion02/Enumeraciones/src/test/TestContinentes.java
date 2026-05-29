// 1.3 Pruebas de enum, con la creación de enum Continentes
// Video 03
package test;

import Enumeraciones.Continentes;

public class TestContinentes {

    public static void main(String[] args) {
        // System.out.println("Continente No. 4: "+Continentes.AMERICA);
        // System.out.println("No. de paises en el 4to. continente: "
        //        +Continentes.AMERICA.getPaises());
        // System.out.println("No de habitantes en el 4to. continente: "
        //         +Continentes.AMERICA.gethabitantes());

        for (Continentes continente : Continentes.values()) {

            System.out.println("Continente: " + continente);
            System.out.println("Cantdad de países: " + continente.getPaises());
            System.out.println("Cantidad de habitantes: " + continente.gethabitantes());
            System.out.println("-------------------");
        }
    }

}
