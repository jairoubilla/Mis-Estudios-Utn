class Usuario:
    def __init__(self, id_usuario=None, username=None, password=None):
        # Los atributos comienzan con guion bajopara indicar que son'protegidos/privados'
        self._id_usuario = id_usuario
        self._username = username
        self._password = password

    #--- GETTERS Y SETTERS PARA ID_USUARIO ---
    @property
    def id_usuario(self):
        return self._id_usuario

    @id_usuario.setter
    def id_usuario(self, id_usuario):
        self._id_usuario = id_usuario

    #--- GETTERS Y SETTERS PARA USERNAME---
    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        self._username = username

    #--- GETTERS Y SETTERS PARA PASSWORD ---
    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = password

    #---METODO __STR___---
    def __str__(self):
        return f'Usuario: [ID: {self._id_usuario}, Username: {self._username}, Password: {self._password}]'

#---ZONA DE PRUEBAS---
if __name__ == '__main__':
    # Instanciamos un usuario de prueba
    usuario_prueba = Usuario(id_usuario=1, username='admin_sistema', password='super_password_123')

    # Imprimimos el usuario (esto llama automaticamente al metodo __str__)
    print(usuario_prueba)

    # Probamos un setter modificando el username
    usuario_prueba.username = 'nuevo_admin'

    # Probamos un getter imprimiendo solo el username
    print(f'El nuevo nombre de usuario es: {usuario_prueba.username}')









