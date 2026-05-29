// 1.3 Pruebas de enum, con la creación de enum Continentes
// Video 02

package Enumeraciones;


public enum Continentes {
    AFRICA(53, "1.2 billones"),
    EUROPA(46, "1.1 billones"),
    ASIA(44, "1.9 millones"),
    AMERICA(34, "150.2 millones"),
    OCEANIA(14, "1.2 millones");
    
    private final int paises;
    private String habitantes;
    
    Continentes(int paises, String habitantes){
        this.paises = paises;
        this.habitantes = habitantes;
    }
    
    // Metodo Get
    public int getPaises(){
        return this.paises;
    }
    
    public String gethabitantes(){
        return this.habitantes;
    }
}
