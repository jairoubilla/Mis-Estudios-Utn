// 1.5 Modificadores de acceso default o package
// Video 01
package paquete1;

import paquete2.Clase4; //1.6 Modificador de acceso private


public class TestDefault {
    public static void main(String[] args) {
        ClaseHija2 claseH2 = new ClaseHija2();
        claseH2.atributoDefault = "Cambio desde la prueba";
        System.out.println("claseH2 atributo default = " + claseH2.atributoDefault);
        
        Clase4 clase4 = new Clase4("Publico"); // 1.6 Modificador de acceso private
        System.out.println(clase4.getAtributoPrivate());//1.6 Modificador de acceso private
        clase4.setAtributoPrivate("Cambio"); //1.6 Modificador de acceso private
        System.out.println("clase4 = " + clase4.getAtributoPrivate()); //1.6 Modificador de acceso private
    }
}
