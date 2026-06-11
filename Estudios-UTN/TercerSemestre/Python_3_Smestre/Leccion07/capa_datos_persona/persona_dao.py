# 8.4 Comienzo de la creación de la Clase PersonaDAO
from capa_datos_persona.Persona import Persona
from capa_datos_persona.conexion import Conexion
from capa_datos_persona.cursor_del_pool import CursorDelPool
from logger_base import log


class PersonaDAO:
    """
    DAO significa: Data Access Object
    CRUD significa:
                    Create  -> Insertar
                    Reade   -> Seleccionar
                    Update  -> Actualizar
                    Deleted -> Eliminar
    """
    _SELECCIONAR = 'SELECT * FROM persona ORDER BY id_persona'
    _INSERTAR = 'INSERT INTO persona(nombre, apellido, email) VALUES (%s, %s, %s)'
    _ACTUALIZAR = 'UPDATE persona SET nombre=%s, apellido=%s, email=%s WHERE id_persona=%s'
    _ELIMINAR = 'DELETE FROM persona WHERE id_persona=%s'

    # Clase 08
    #9.1 En la clase PersonaDao: metodo seleccionar
    # Definimos los metodos de clase
   # @classmethod
    #def seleccionar(cls):
     #   with Conexion.obtenerConexion():
      #      with Conexion.obtenerCursor() as cursor:
       #         cursor.execute(cls._SELECCIONAR)
        #        registros = cursor.fetchall()
         #       personas = []  # Creamos una lista
          #      for registro in registros:
           #         persona = Persona(
            #            id_persona=registro[0],
             #           nombre=registro[1],
              #          apellido=registro[2],
               #         email=registro[3]
                #    )
                 #   personas.append(persona)
                #return personas
# Clase 09
# 11.4 Pruebas del CursorDelPool -> Parte 2
    @classmethod
    def seleccionar(cls):
        with CursorDelPool() as cursor:
            cursor.execute(cls._SELECCIONAR)
            registros = cursor.fetchall()
            personas = [] # Creamos ua lista
            for registro in registros:
                persona = Persona(registro[0], registro[1], registro[2], registro[3])
                personas.append(persona)
            return personas

    # 9.3 Metodo Insertar

    @classmethod
    def insertar(cls, persona):
        #with Conexion.obtenerConexion():
            with CursorDelPool() as cursor:
                valores = (persona.nombre, persona.apellido, persona.email)
                cursor.execute(cls._INSERTAR, valores)
                log.debug(f'Persona Insertada: {persona}')
                return cursor.rowcount

    # 9.4 Metodo Actualizar
    @classmethod
    def actualizar(cls, persona):
        #with Conexion.obtenerConexion():
            with CursorDelPool() as cursor:
                valores = (persona.nombre, persona.apellido, persona.email, persona.id_persona)
                cursor.execute(cls._ACTUALIZAR, valores)
                log.debug(f'Persona actualizada: {persona}')
                return cursor.rowcount

    # 9.5 Metodo Eliminar
    @classmethod
    def eliminar(cls, persona):
        #with Conexion.obtenerConexion():
            with CursorDelPool() as cursor:
                valores = (persona.id_persona,)
                cursor.execute(cls._ELIMINAR, valores)
                log.debug(f'Los objetos eliminados son: {persona}')
                return cursor.rowcount

# 9.2 Prueba metodo seleccionar

if __name__ == '__main__':

    # Eliminiar un registro
    persona1 = Persona(id_persona=26)
    personas_eliminadas = PersonaDAO.eliminar(persona1)
    log.debug(f'Personas eliminadas: {personas_eliminadas}')
    # Actualizar un registro
    persona1 = Persona(1, 'Juan', 'Pena', 'jpena@gmail.com')
    personas_actualizadas = PersonaDAO.actualizar(persona1)
    log.debug(f'Personas actualizadas: {personas_actualizadas}')

#Clase 09
# 11.5 Pruebas de personaDAO -> Parte 1 y 2
    # Insertar un registro
    persona1 = Persona(nombre='Mateo', apellido='Torres', email='torresm@gmail.com')
    personas_insertadas = PersonaDAO.insertar(persona1)
    log.debug(f'Personas insertadas: {personas_insertadas}')

    # Seleccionar objetos
    personas = PersonaDAO.seleccionar()
    for persona in personas:
        log.debug(persona)
