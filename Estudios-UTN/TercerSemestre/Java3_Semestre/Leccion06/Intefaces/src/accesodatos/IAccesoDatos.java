// 7.2 Manejo de Interfaces Parte 2
package accesodatos;


public interface IAccesoDatos {
    int MAX_REGISTRO = 10;
    
    //Metodo insertar es abstracto y sin cuerpo
    void insertar();
    
    void listar();
    
    void actualizar();
    
    void eliminar();
}
