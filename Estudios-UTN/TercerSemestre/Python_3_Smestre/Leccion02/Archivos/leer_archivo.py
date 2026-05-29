# 1.3 Lectura de archivos
# Video 01

archivo = open('prueba.txt', 'r', encoding='utf8')

print(archivo.read())

print('======')

# Video 02

archivo = open('prueba.txt', 'r', encoding='utf8') # Las letras son: 'r' read, 'a' append, 'w' write, 'x'

print(archivo.read())

print('=========')

# Video 03

archivo = open('prueba.txt', 'r', encoding='utf8') # Las letras son: 'r' read, 'a' append, 'w' write, 'x'
# Si el archivo esta en otra carpeta, hay que colocar la ruta de la carpeta

# print(archivo.read())
# print(archivo.read(16))
# print(archivo.read(10)) # Continuamos desde la línea anterior
#print(archivo.readline())
#print(archivo.readline())

print('=======')

# 1.4 Más formas de trabajar con archivos
# Vamos a iterar el archivo, cada una de las líneas
# Video 01

#for linea in archivo:
#   print(linea) # iteramos todos los elementos del archivo
#   print(archivo.readlines()) # accedemos al archivo como si fuera una lista

print('========')

# Video 02
# Anexamos información, copiamos a otro

archivo2 = open('copia.txt', 'a', encoding='utf8')
archivo2.write(archivo.read())
archivo.close() # Cerramos el primer archivo
archivo2.close() # Cerramos el segundo archivo

print('Se ha terminado el proceso de leer y copiar archivos')

print('===========')


