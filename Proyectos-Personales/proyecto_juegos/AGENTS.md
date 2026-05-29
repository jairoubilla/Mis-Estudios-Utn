# Guía para Agentes de Codificación AI

## Propósito
Este repositorio es un prototipo temprano de **Aetherfall Online**, un juego estilo MMORPG móvil construido con **Godot 4.x** y un prototipo de backend local.

El objetivo de este archivo es ayudar a los agentes AI a entender la estructura del proyecto, el alcance actual y los archivos más relevantes para implementar cambios.

## Resumen del Proyecto
- Cliente: `client/godot/` proyecto Godot 4.x usando GDScript.
- Prototipo de backend: `server/` servicios locales Docker para PostgreSQL y Redis.
- Documentación: `docs/` contiene diseño, hoja de ruta, configuración y notas técnicas.
- Arte: `art/` contiene archivos de arte fuente.

## Alcance del Prototipo Actual
- Prototipo jugable sin conexión con un solo jugador controlable.
- Cámara en tercera persona y controles compatibles con móvil.
- Un enemigo dummy y combate melee básico.
- HP, XP y una HUD.
- Scripts de arranque local: `launch-godot.bat`, `run-game.bat`.

## Archivos y Carpetas Importantes
- `README.md` — resumen del proyecto y estado del prototipo.
- `docs/setup.md` — instrucciones de entorno y ejecución.
- `client/godot/project.godot` — archivo principal del proyecto Godot.
- `client/godot/scripts/` — lógica de jugabilidad.
- `client/godot/scenes/` — jerarquía de escenas de Godot.
- `server/docker-compose.yml` — servicios locales de backend para desarrollo.

## Cómo Ejecutar
- Ejecutar el editor de Godot y el proyecto usando `launch-godot.bat`.
- Iniciar la escena jugable rápidamente con `run-game.bat`.
- Para servicios de backend (opcional / etapa posterior):
  ```bat
  cd server
  docker compose up -d
  ```

## Notas de Desarrollo para Agentes AI
- Priorizar primero el **prototipo de cliente Godot** antes de agregar características de backend multijugador.
- Preservar el comportamiento de jugabilidad existente y usar el prototipo actual como la fuente de la verdad.
- Usar `README.md` y `docs/setup.md` para las suposiciones de entorno y proyecto; no duplicar documentación larga.
- El trabajo de backend está limitado actualmente a servicios locales de desarrollo; el servidor aún no es un backend autoritativo completo.

## Áreas Recomendadas para Cambios
- Sistemas de jugabilidad y de jugador/enemigo dentro de `client/godot/scripts/`.
- Diseño de escenas e interfaz en `client/godot/scenes/`.
- Infraestructura de backend en `server/` solo después de estabilizar el prototipo del cliente.

## Notas
- No existe `.github/copilot-instructions.md` ni otro archivo de personalización AI en este repositorio.
- Este archivo debe usarse como la guía de alto nivel principal para el desarrollo asistido por AI.
