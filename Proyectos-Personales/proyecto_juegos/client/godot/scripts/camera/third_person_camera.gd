extends Node3D

# Ruta al jugador que la camara debe seguir.
@export var target_path: NodePath

# Velocidad con la que la camara alcanza al jugador. Un valor alto se siente mas directo.
@export var follow_speed := 12.0
@export var follow_offset := Vector3(0, 4.5, 0)

# Sensibilidad horizontal y vertical al arrastrar el mouse.
@export var yaw_speed := 0.01
@export var pitch_speed := 0.008

# Limites verticales para evitar que la camara gire demasiado arriba o abajo.
@export var min_pitch := deg_to_rad(-65.0)
@export var max_pitch := deg_to_rad(20.0)

var _target: Node3D
var _yaw := 0.0
var _pitch := deg_to_rad(-32.0)
var _dragging := false

func _ready() -> void:
	# Buscamos el nodo objetivo una sola vez al iniciar la escena.
	_target = get_node_or_null(target_path)
	_yaw = rotation.y
	_pitch = rotation.x

func _ensure_target() -> void:
	if _target == null and target_path != NodePath():
		_target = get_node_or_null(target_path)

func _unhandled_input(event: InputEvent) -> void:
	# Con clic derecho presionado, el jugador puede rotar la camara.
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_RIGHT:
		_dragging = event.pressed

	if event is InputEventMouseMotion and _dragging:
		_yaw -= event.relative.x * yaw_speed
		_pitch = clamp(_pitch - event.relative.y * pitch_speed, min_pitch, max_pitch)

	# Soporte táctil: arrastre en la mitad derecha de la pantalla.
	if event is InputEventScreenDrag:
		var screen_size := get_viewport().get_visible_rect().size
		if event.position.x >= screen_size.x * 0.5:
			_yaw -= event.relative.x * yaw_speed
			_pitch = clamp(_pitch - event.relative.y * pitch_speed, min_pitch, max_pitch)

func _process(delta: float) -> void:
	_ensure_target()
	if _target == null:
		return

	# El rig de camara sigue suavemente al jugador con un offset vertical.
	var desired_position := _target.global_position + follow_offset
	global_position = global_position.lerp(desired_position, follow_speed * delta)
	rotation = Vector3(_pitch, _yaw, 0.0)
