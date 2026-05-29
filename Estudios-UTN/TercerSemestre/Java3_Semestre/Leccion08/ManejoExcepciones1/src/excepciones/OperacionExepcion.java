// 8.4 Creamos nuestra propia excepción -> Parte 1, 2 y 3
// Video01
package excepciones;


public class OperacionExepcion extends Exception{
    // Constructor
    public OperacionExepcion(String mensaje){
        super (mensaje);
    }
}
