from Usuario import Usuario
from UsuarioDao import UsuarioDao
from logger_base import log

opcion = None

while opcion != 5:
    print('\n' + '='*30)
    print('        MENÚ PRINCIPAL')
    print('='*30)
    print('1) Listar usuarios')
    print('2) Agregar usuario')
    print('3) Actualizar usuario')
    print('4) Eliminar usuario')
    print('5) Salir')
    print('='*30)

    try:
        opcion = int(input('Escribe tu opción (1-5): '))

        if opcion == 1:
            usuarios = UsuarioDao.seleccionar()
            log.info('--- LISTADO DE USUARIOS ---')
            for usuario in usuarios:
                log.info(usuario)

        elif opcion == 2:
            print('\n -- NUEVO USUARIO --')
            username_var = input('Escribe el username: ')
            password_var = input('Escribe el password: ')

            usuario = Usuario(username=username_var, password=password_var)
            usuarios_insertados = UsuarioDao.insertar(usuario)
            log.info(f'Usuarios insertados: {usuarios_insertados}')

        elif opcion == 3:
            print('\n-- ACTUALIZAR USUARIO --')
            id_usuario_var = int(input('Escribe el ID del usuario a actualizar: '))
            username_var = input('Escribe el nuevo username: ')
            password_var = input('Escribe el nuevo password: ')

            usuario = Usuario(id_usuario=id_usuario_var, username=username_var, password=password_var)
            usuarios_actualizados = UsuarioDao.actualizar(usuario)
            log.info(f'Usuarios actualizados: {usuarios_actualizados}')

        elif opcion == 4:
            print('\n-- ELIMINAR USUARIO --')
            id_usuario_var = int(input('Escribe el ID del usuario a eliminar: '))

            usuario = Usuario(id_usuario=id_usuario_var)
            usuarios_eliminados = UsuarioDao.eliminar(usuario)
            log.info(f'Usuarios eliminados: {usuarios_eliminados}')

        elif opcion == 5:
            log.info('Saliendo de la aplicación. Sistema finalizado.')

        else:
            log.warning('Opción no válida. Debes elegir un número entre 1 y 5.')

    except ValueError as e:
        log.error(f'Error de entrada. Debes introducir un valor numérico válido. Detalle: {e}')
    except Exception as e:
        log.error(f'Ocurrió un error inesperado en el sistema: {e}')












