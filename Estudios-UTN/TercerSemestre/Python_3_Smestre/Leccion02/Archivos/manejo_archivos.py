# Clase 02
# Video 01
# 1.1 Introducción a lo que es el manejo de archivos
# Declaramos una variable

try:
    archivo = open('prueba.txt', 'w') # La 'w' es de write que significa escribir

except Exception as e:
    print(e)

finally: # Siempre se ejecuta
    archivo.close() # Con esto se debe cerrar el archivo

print('========')

# Video 02

try:
    archivo = open('prueba.txt', 'w') # La 'w' es de write que significa escribir
    archivo.write('Programamos con diferentes tipos de archivos, ahora en txt. \n')
    archivo.write('Con esto terminamos')

except Exception as e:
    print(e)

finally: # Siempre se ejecuta
    archivo.close() # Con esto se debe cerrar el archivo

print('=======')

# 1.2 Especificar el juego de caracteres de un archivo de texto

try:
    archivo = open('prueba.txt', 'w', encoding= 'utf8') # La 'w' es de write que significa escribir
    archivo.write('Programamos con diferentes tipos de archivos, ahora en txt. \n')
    archivo.write('Los acentos son importantes para las palabras\n')
    archivo.write('como por ejemplo: acción, ejecución y producción\n')
    archivo.write('Las letras son:\nr read leer, \na append anexa, \nw write escribe, \nx crea un archivo')
    archivo.write('\nt esta es para texto o text, \nb archivos binarios, \nw+ lee y escribe son iguales r+\n')
    archivo.write('Saludos a todos los alumnos de la tecnicatura')
    archivo.write('Con esto terminamos')

except Exception as e:
    print(e)

finally: # Siempre se ejecuta
    archivo.close() # Con esto se debe cerrar el archivo

# No se puede crear o editar un archivo luego del archivo.close

print('========')
