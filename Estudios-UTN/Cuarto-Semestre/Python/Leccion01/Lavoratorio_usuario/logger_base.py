import logging as log

# Configuramos el comportamiento global de nuestro logger
log.basicConfig(
    level=log.DEBUG, # Establecemos el nivel mínimo que queremos registrar
    format='%(asctime)s: %(levelname)s [%(filename)s:%(lineno)s] %(message)s',
    datefmt='%I:%M:%S %p',
    handlers=[
        # Handler para guardar los logs en un archivo de texto
        log.FileHandler('lavoratorio_usuarios.log', encoding='utf-8'),
        # Handler para mostrar los logs en la consola de PyCharm
        log.StreamHandler()
    ]
)

# ---ZONA DE PRUEBAS---
if __name__ == '__main__':
    log.debug('Mensaje a nivel DEBUG: Ideal para ver valores de variables.')
    log.info('Mensaje a nivel INFO: Se conectó a la base de datos correctamente.')
    log.warning('Mensaje a nivel WARNING: La conexión a internet es inestable.')
    log.error('Mensaje a nivel ERROR: No se pudo insertar el usuario en la tabla.')
    log.critical('Mensaje a nivel CRITICAL: Fallo catastrófico del sistema.')