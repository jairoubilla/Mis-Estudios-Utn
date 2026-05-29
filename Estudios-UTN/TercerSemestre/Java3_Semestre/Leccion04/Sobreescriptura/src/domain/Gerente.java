// 1.2 Ejercicio: Sobreescritura de métodos Overriding Parte 1 y 2
// Video 01
package domain;


public class Gerente extends Empleado {
    private String departamento;
    
    public Gerente(String nombre, double sueldo, String departamento){
        super(nombre, sueldo);
        this.departamento = departamento;
    }
    
    // Video 02
    // Sobreescribimos el metodo
    
    @Override
    public String obtenerDetalles(){
        return super.obtenerDetalles()+", Departamento: "+this.departamento;
    }
}
