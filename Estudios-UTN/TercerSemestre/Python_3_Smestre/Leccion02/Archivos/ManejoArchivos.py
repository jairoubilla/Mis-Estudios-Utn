# 1.6 Uso de with, archivos y contexto Manager Parte 2
# Video 01

class ManejoArchivos:
    def __init__(self, nombre):
        self.nombre = nombre

    def __enter__(self):
        print('Obtenemos el recurso' .center(50, '-'))
        self.nombre = open(self.nombre, 'r', encoding='utf8') # Encapsulamos el código entro del metodo
        return self.nombre

    def __exit__(self, tipo_exception, valor_exception, traza_error):
        print('Cerramos el recurso'.center(50, '-'))
        if self.nombre:
            self.nombre.close() # Cerramos el archivo

