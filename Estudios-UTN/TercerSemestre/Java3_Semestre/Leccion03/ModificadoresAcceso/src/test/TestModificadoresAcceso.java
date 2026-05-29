// 1.3 Modificadores de acceso public
// Video01
package test;

import paquete1.Clase1;
import paquete2.Clase3;


public class TestModificadoresAcceso {
    public static void main(String[] args) {
        
        // Video 02
        Clase1 clase1 = new Clase1();
        System.out.println("clase1 = " + clase1.atributoPublic);
        clase1.metodoPublico();
        Clase3 claseHija = new Clase3();// 1.4 Modificadores de acceso protected
        System.out.println("claseHija = " + claseHija); // 1.4 Modificadores de acceso protected
    }
}
