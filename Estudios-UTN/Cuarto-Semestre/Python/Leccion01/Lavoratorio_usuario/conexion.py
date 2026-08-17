from psycopg2 import pool
from logger_base import log
import sys

class Conexion:
    # Atributos de clase estáticos y privados según el UML
    _DATABASE = 'laboratorio_usuarios'
    _USERNAME = 'postgres'
    _PASSWORD = 'admin123'
    _DB_PORT = '5432'
    _HOST = '127.0.0.1'
    _MIN_CON = 1
    _MAX_CON = 5
    _pool = None

    @classmethod
    def obtenerPool(cls):
        # Patrón Singleton: Solo creamos el pool si no existe previamente
        if cls._pool is None:
            try:
                cls._pool = pool.SimpleConnectionPool(
                    cls._MIN_CON,
                    cls._MAX_CON,
                    host=cls._HOST,
                    user=cls._USERNAME,
                    password=cls._PASSWORD,
                    port=cls._DB_PORT,
                    database=cls._DATABASE
                )
                log.debug(f'Creación exitosa del pool. Conexiones: {cls._MIN_CON} a {cls._MAX_CON}')
            except Exception as e:
                log.error(f'Ocurrió un error al obtener el pool: {e}')
                sys.exit() # Detenemos el programa si no hay conexion
        return cls._pool

    @classmethod
    def obtenerConexion(cls):
        conexion = cls.obtenerPool().getconn()
        log.debug('Conexion obtenida del pool')
        return conexion

    @classmethod
    def liberarConexion(cls, conexion):
        cls.obtenerPool().putconn(conexion)
        log.debug('Conexion regresada al pool')

    @classmethod
    def cerrarConexiones(cls):
        cls.obtenerPool().closeall()
        log.debug('Se cerraron todas las conexiones del pool')

# --- ZONA DE PRUEBAS ---
if __name__ == '__main__':
    conexion1 = Conexion.obtenerConexion()
    Conexion.liberarConexion(conexion1)
    Conexion.cerrarConexiones()