# Clase 01
# 1.1 Manejo de errores o excepciones Parte 1 y parte 2
# Video 1 y 2

try:
    10/0
except Exception as e:
    print(f'Ocurrió un error: {e}')

print('==============')

# 1.2 Procesamiento de excepciones

resultado = None
a = 10
b = 0

try:
    resultado = a / b # Modificamos
except Exception as e:
    print(f'Ocurrió un error: {e}')

print(f'El resultado es: {resultado}')
print('Seguimos....')

print('==============')

# 1.3 Procesar clases de exception más específicas

resultado = None
c = 9
d = 0

try:
    resultado = c / d # Modificamos
except TypeError as e:
    print(f'TypeError - Ocurrió un error: {type(e)}')

except ZeroDivisionError as e:
    print(f'ZeroDivisionError - Ocurrió un error: {type(e)}')

except Exception as e:
    print(f'Ocurrió un error: {e}')

print(f'El resultado es: {resultado}')
print('Seguimos....')

print('==============')

#1.4 Más de procedimientos de excepciones

resultado = None

try:
    e = int(input('Digite el primer numero: '))
    f = int(input('Digite el segundo numero: '))
    resultado = e / f # Modificamos
except TypeError as e:
    print(f'TypeError - Ocurrió un error: {type(e)}')

except ZeroDivisionError as e:
    print(f'ZeroDivisionError - Ocurrió un error: {type(e)}')

except Exception as e:
    print(f'Ocurrió un error: {e}')

print(f'El resultado es: {resultado}')
print('Seguimos....')

print('==============')

# 1.5 Bloques else y finally al manejar excepciones

resultado = None

try:
    g = int(input('Digite el primer numero: '))
    h = int(input('Digite el segundo numero: '))
    resultado = g / h # Modificamos
except TypeError as e:
    print(f'TypeError - Ocurrió un error: {type(e)}')

except ZeroDivisionError as e:
    print(f'ZeroDivisionError - Ocurrió un error: {type(e)}')

except Exception as e:
    print(f'Ocurrió un error: {e}')

else:
    print('No se arrojo ninguna excepción')

finally: # Este bloque siempre se va a ejecutar
    print('Ejecución de este bloque finally')

print(f'El resultado es: {resultado}')
print('Seguimos....')

print('==============')

# 1.6 Creación de clases de Exception personalizadas

from NumerosIgualesException import NumerosIgualesException

resultado = None

try:
    g = int(input('Digite el primer numero: '))
    h = int(input('Digite el segundo numero: '))

    if g == h:
        raise NumerosIgualesException('Son numeros iguales')

    resultado = g / h # Modificamos
except TypeError as e:
    print(f'TypeError - Ocurrió un error: {type(e)}')

except ZeroDivisionError as e:
    print(f'ZeroDivisionError - Ocurrió un error: {type(e)}')

except Exception as e:
    print(f'Ocurrió un error: {e}')

else:
    print('No se arrojo ninguna excepción')

finally: # Este bloque siempre se va a ejecutar
    print('Ejecución de este bloque finally')

print(f'El resultado es: {resultado}')
print('Seguimos....')

print('==============')