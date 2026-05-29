from dominio.Pelicula import Pelicula
from Servicio.CatalogoPeliculas import CatalogoPeliculas

def mostrar_menu(): # Creamos el output del programa
    print('\n--- Catálogo de Películas ---')
    print('1) Agregar películas')
    print('2) Listar películas')
    print('3) Eliminar archivo de películas')
    print('4) Salir')

while True:
    mostrar_menu()
    opcion = input('Elegí una opción: ') # Tomamos la opción del usuario

    if opcion == '1': # Para agregar películas
        nombre = input('Ingresá el nombre de la película: ')
        pelicula = Pelicula(nombre)
        CatalogoPeliculas.agregar_pelicula(pelicula)

    elif opcion == '2': # Para listarlas
        CatalogoPeliculas.listar_peliculas()

    elif opcion == '3': # Para eliminar el archivo peliculas.txt
        CatalogoPeliculas.eliminar()

    elif opcion == '4': # Salimos del programa
        print('Saliendo del programa...')
        break

    else: # Por si el usuario ingresa una opcion invalida
        print('Opción inválida, intentá de nuevo.')

