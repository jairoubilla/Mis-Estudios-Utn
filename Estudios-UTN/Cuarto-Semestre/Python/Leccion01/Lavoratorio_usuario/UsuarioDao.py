from CursorDelPool import CursorDelPool
from Usuario import Usuario
from logger_base import log

class UsuarioDao:
    _SELECCIONAR = 'SELECT * FROM usuario ORDER BY id_usuario'
    _INSERTAR = 'INSERT INTO usuario(username, password) VALUES(%s, %s)'
    _ACTUALIZAR = 'UPDATE usuario SET username=%s, password=%s WHERE id_usuario=%s'
    _ELIMINAR = 'DELETE FROM usuario WHERE id_usuario=%s'

    @classmethod
    def seleccionar(cls):
        with CursorDelPool() as cursor:
            cursor.execute(cls._SELECCIONAR)
            registros = cursor.fetchall()
            usuarios = []
            for registro in registros:
                # Instanciamos un objeto Usuario por cada registro obtenido
                usuario = Usuario(registro[0], registro[1], registro[2])
                usuarios.append(usuario)
            return usuarios

    @classmethod
    def insertar(cls, usuario):
        with CursorDelPool() as cursor:
            # Preparamos los valores a insertar protegidos contra inyeccion sql
            valores = (usuario.username, usuario.password)
            cursor.execute(cls._INSERTAR, valores)
            log.debug(f'Usuario insertado exitosamente: {usuario}')
            return cursor.rowcount

    @classmethod
    def actualizar(cls, usuario):
        with CursorDelPool() as cursor:
            valores = (usuario.username, usuario.password, usuario.id_usuario)
            cursor.execute(cls._ACTUALIZAR, valores)
            log.debug(f'Usuario actualizado exitosamente: {usuario}')
            return cursor.rowcount

    @classmethod
    def eliminar(cls, usuario):
        with CursorDelPool() as cursor:
            valores = (usuario._id_usuario,)
            cursor.execute(cls._ELIMINAR, valores)
            log.debug(f'Usuario eliminado exitosamente: {usuario}')
            return cursor.rowcount

# --- ZONA DE PRUEBAS ---
if __name__ == '__main__':
    # Prueba inserción
    #nuevo_usuario = Usuario(username='jairo_dev', password='pwd_segura')
    #usuarios_insertados = UsuarioDao.insertar(nuevo_usuario)
    #log.debug(f'Usuarios insertados: {usuarios_insertados}')

    # Prueba de selección
    usuarios = UsuarioDao.seleccionar()
    for usuario in usuarios:
        log.debug(usuario)

    # Pruebe de actualizar
    #usuario_a_actualizar = Usuario(id_usuario=1, username='admin_modificado', password='nueva_password_456')
    #registros_actualizados = UsuarioDao.actualizar(usuario_a_actualizar)
    #log.debug(f'Registros actualizados: {registros_actualizados}')

    # Prueba de eliminar
    #usuario_a_eliminar = Usuario(id_usuario=2)
    #registros_eliminados = UsuarioDao.eliminar(usuario_a_eliminar)
    #log.debug(f'Registros eliminados: {registros_eliminados}')














