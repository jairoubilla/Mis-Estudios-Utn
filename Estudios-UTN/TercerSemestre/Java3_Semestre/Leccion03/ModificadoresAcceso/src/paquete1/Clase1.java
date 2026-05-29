// 1.3 Modificadores de acceso public
// Video 01
package paquete1;


public class Clase1 {
    
    // Video 02
    public String atributoPublic = "Valor atributo public";
    protected String atributoProtected = "Valor atributo protected"; // 1.4 Modificadores de acceso protected
    
    public Clase1(){
        System.out.println("Constructor public");
    }
    
    protected Clase1(String atributoPublic){
        System.out.println("Constructor protected"); // 1.4 Modificadores de acceso protected
    }
    
    public void metodoPublico(){
        System.out.println("Método public");
    }
    
    protected void metodoProtected() {
        System.out.println("Método protected"); // 1.4 Modificadores de acceso protected
    }
}
