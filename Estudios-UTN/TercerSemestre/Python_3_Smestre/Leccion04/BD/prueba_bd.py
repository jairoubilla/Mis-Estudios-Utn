# Clase 04
# 1.6 Conexión hacia la base de datos en Python con el metodo fetchall()
import psycopg2 # Esto es para poder conectarnos a Postgre

conexion = psycopg2.connect(
    user='postgres',
    password='admin123',
    host='127.0.0.1',
    port='5432',
    database='test_bd'
)

#cursor = conexion.cursor()
#sentencia = 'SELECT * FROM persona'
#cursor.execute(sentencia) # De esta manera ejecutamos la sentencia
#registros = cursor.fetchall() # Recuperamos todos los registros que serán una lista

# 1.7 Cerramos la conexión y la consulta
#print(registros)

#cursor.close()
#conexion.close()

print('=========')

# Clase 05
# 5.1 Uso de with y psycopg2

try:
    with conexion:
        with conexion.cursor() as cursor:
            sentencia = 'SELECT * FROM persona'
            cursor.execute(sentencia) # De esta manera ejecutamos la sentencia
            registros = cursor.fetchall() # Recuperamos todos los registros que serán una lista

            print(registros)
except Exception as e:
    print(f'Ocurrió un error: {e}')
#finally:
    #conexion.close()

print('============')

# 5.2 Función fetchone en psycopg2

try:
    with conexion:
        with conexion.cursor() as cursor:
            sentencia = 'SELECT * FROM persona WHERE id_persona = %s' # Placeholder
            id_persona = input('Digite un número para el id_persona: ')
            cursor.execute(sentencia, (id_persona,)) # De esta manera ejecutamos la sentencia
            registros = cursor.fetchone() # Recuperamos todos los registros que serán una lista

            print(registros)
except Exception as e:
    print(f'Ocurrió un error: {e}')
finally:
    conexion.close()



