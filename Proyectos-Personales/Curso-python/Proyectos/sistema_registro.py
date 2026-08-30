def registrar_usuario(nombre, edad, identificacion): # Registra un nuevo usuario
    """
    Registra los datos de un usuario.

    Parámetros:
        nombre: Nombre del usuario.
        edad: Edad actual del usuario.
        identificacion: Identificación del usuario (True si tiene identificación, False si no).

    Retorna:
        Un diccionario con los datos del usuario.
    """
    usuario = { # Diccionario para almacenar los datos del usuario
        "nombre": nombre,
        "edad": edad,
        "identificacion": identificacion,
        "año_80": 2026 + (80 - edad)
    }
    return usuario

usuario = registrar_usuario("Juan", 36, True) # Llamada a la función para registrar un usuario
print(f"Usuario registrado: {usuario['nombre']}")
print(f"Edad: {usuario['edad']}")
print(f"Identificación: {usuario['identificacion']}")
print(f"Año en que tendrá 80 años: {usuario['año_80']}")
