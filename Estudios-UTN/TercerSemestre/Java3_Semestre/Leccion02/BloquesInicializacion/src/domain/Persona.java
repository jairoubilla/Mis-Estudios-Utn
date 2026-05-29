// 1.4 Manejo de bloques de código
// Video 01
package domain;


public class Persona {
    private final int idPersona;
    private static int contadorPersonas;
    
    static{ //Bloque de inicialización estático
        System.out.println("Ejecución del bloque estático");
        ++Persona.contadorPersonas;
        //idPersona=10; No es un atributo estático, nos va a dar error
    }
    
    // Video02
    
    //Bloque de inicialización No estático(contexto dinamico)
    
    {
        System.out.println("Ejecucion del bloque No estático");
        this.idPersona = Persona.contadorPersonas++; // Incrementamos el atributo
    }
    
    // Los bloques de inicialización se ejecutan antes del constructor
    
    public Persona(){
        System.out.println("Ejecución del constructor");
    }
    
    public int getIdPersona(){
        return this.idPersona;
    }
    // Parte del video 03

    @Override
    public String toString() {
        return "Persona{" + "idPersona=" + idPersona + '}';
    }
    
}
