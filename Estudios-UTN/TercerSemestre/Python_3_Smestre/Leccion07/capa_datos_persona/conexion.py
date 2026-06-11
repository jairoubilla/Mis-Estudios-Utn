# Clase 07
# 8.3 Creación de la Clase Conexion: Parte 1, 2 y 3
# psycopg2 as bd # Otra manera de importar el psycopg2
#import psycopg2 as bd # parte 02
from psycopg2 import pool
from logger_base import log # parte 02
import sys # parte 02

class Conexion:
    _DATABASE = 'test_bd'
    _USERNAME = 'postgres'
    _PASSWORD = 'admin123'
    _DB_PORT = '5432'
    _HOST = '127.0.0.1'
    _MIN_CON = 1
    _MAX_CON = 5
    _pool =None
# parte 02
    #@classmethod
    #def obtenerConexion(cls):
     #   if cls._conexion is None:
      #      try:
       #         cls._conexion = bd.connect(host=cls._HOST,
        #                                   user=cls._USERNAME,
         #                                  password=cls._PASSWORD,
          #                                 port=cls._DB_PORT,
           #                                database=cls._DATABASE)
            #    log.debug(f'Conexión Exitosa: {cls._conexion}')
             #   return cls._conexion
            #except Exception as e:
             #   log.error(f'Ocurrió un error: {e}')
              #  sys.exit()
        #else:
         #   return cls._conexion
#Clase 09
#10.2 Obtener una conexión a partir del Pool: Parte 2

    @classmethod
    def obtenerConexion(cls):
        conexion = cls.obtenerPool().getconn()
        log.debug(f'Conexion obtenida del pool: {conexion}')
        return conexion

    # Parte 03
    @classmethod
    def obtenerCursor(cls):
        if cls._cursor is None:
            try:
                cls._cursor = cls.obtenerConexion().cursor()
                log.debug(f'Se abrió correctamente el cursor: {cls._cursor}')
                return cls._cursor
            except Exception as e:
                log.error(f'Ocurrió un error: {e}')
                sys.exit()
        else:
            return cls._cursor

    # Clase 09
    # 10.1 POOL DE CONEXIONES CON PYTHON Y POSTGRESQL: Parte 1
    @classmethod
    def obtenerPool(cls):
        if cls._pool is None:
            try:
                # 10.2 Obtener una conexión a partir del Pool: Parte 1 y 2
                cls._pool = pool.SimpleConnectionPool(cls._MIN_CON,
                                                      cls._MAX_CON,
                                                      host=cls._HOST,
                                                      user=cls._USERNAME,
                                                      password=cls._PASSWORD,
                                                      port=cls._DB_PORT,
                                                      database=cls._DATABASE
                                                      )
                log.debug(f'Creacion del pool exitosa: {cls._pool}')
                return cls._pool
            except Exception as e:
                log.error(f'Ocurrio un erros al obtener el pool: {e}')
                sys.exit()

        else:
            return cls._pool

# Clase 09
#11.1 Mtodo liberarConexion()

    @classmethod
    def liberarConexion(cls, conexion):
        cls.obtenerPool().putconn(conexion)
        log.debug(f'Regresamos la conexion del pool: {conexion}')

#Clase 09
#11.2 Mtodo cerrarConexiones()
    
    @classmethod
    def cerrarConexiones(cls):
        cls.obtenerPool().closeall()



if __name__ ==  '__main__':
    #Conexion.obtenerConexion()
    #Conexion.obtenerCursor()

# Clase09
# 10.3 Pruebas creando objetos del Pool de conexiones
    conexion1 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion1)
    conexion2 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion2)
    conexion3 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion3)
    conexion4 = Conexion.obtenerConexion()
    conexion5 = Conexion.obtenerConexion()
    conexion6 = Conexion.obtenerConexion()