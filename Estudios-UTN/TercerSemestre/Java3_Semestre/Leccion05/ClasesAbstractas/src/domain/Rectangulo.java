// 5.5 Clases Abstractas (abstract) Parte 1, 2 y 3
// Video03
package domain;

public class Rectangulo extends FiguraGeometrica{
    //Constructor
    public Rectangulo(String tipoFigura){
        super(tipoFigura);
    }
    
    @Override
    public void dibujar(){ //Implementando el metodo
        System.out.println("Se imprime un: "+this.getClass().getSimpleName());
    }
}
