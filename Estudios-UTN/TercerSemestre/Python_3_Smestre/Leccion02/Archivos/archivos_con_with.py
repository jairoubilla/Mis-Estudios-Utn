# 1.5 Uso de with, archivos y contexto Manager Parte 1
# MANEJO DE CONTEXTO WITH: sintaxis simplificada, abre y cierra el archivo
from ManejoArchivos import ManejoArchivos

# with open('prueba.txt', 'r', encoding='utf8') as archivo:
#    print(archivo.read())

# No hace falta ni el try, ni el finally
# En el contexto de with lo que se ejecuta de manera automática
# Utiliza diferentes métodos: __enter__ este es el que abre
# Ahora el siguiente metodo es el que cierra: __exit__

print('========')


# 1.6 Uso de with, archivos y contexto Manager Parte 2
# Video 02

with ManejoArchivos('prueba.txt') as archivo:
    print(archivo.read())