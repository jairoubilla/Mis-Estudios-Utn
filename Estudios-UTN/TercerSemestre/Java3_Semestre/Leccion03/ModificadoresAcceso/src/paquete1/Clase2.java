// 1.5 Modificadores de acceso default o package
// Video 01
package paquete1;


class Clase2{
    String atributoDefault = "Valor del atributo default";
    
    //Clase2(){
    //    System.out.println("Constructor Default");
    //}
    
    public Clase2(){
        super();
        this.atributoDefault = "Modificacion del atributo";
        System.out.println("atributoDefault = " + this.atributoDefault);
        this.metodoDefault();
    }
    
    void metodoDefault(){
        System.out.println("Método Default");
    }
}
