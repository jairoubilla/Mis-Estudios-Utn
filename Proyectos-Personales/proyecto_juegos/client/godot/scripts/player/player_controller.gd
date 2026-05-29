extends CharacterBody3D

# Valores editables desde el inspector de Godot.
@export var walk_speed := 5.0
@export var sprint_speed := 8.0
@export var jump_velocity := 5.2
@export var turn_speed := 12.0
@export var acceleration := 12.0
@export var deacceleration := 14.0
@export var coyote_time := 0.18
@export var jump_buffer_time := 0.14
@export var attack_damage := 20
@export var attack_range := 2.4
@export var attack_arc := 0.5
@export var attack_cooldown := 0.55

# Referencia al rig de camara. Sirve para mover al personaje relativo a la camara.
@export var camera_pivot_path: NodePath
var gravity: float = ProjectSettings.get_setting("physics/3d/default_gravity")
var _camera_pivot: Node3D
var _attack_timer := 0.0
var _xp := 0
var _is_dead := false
var _coyote_timer := 0.0
var _jump_buffer_timer := 0.0

@onready var health_component: Node = $HealthComponent

signal stats_changed(current_health: int, max_health: int, xp: int)

func _ready() -> void:
	# Si la escena principal asigno una camara, la guardamos para usar su direccion.
	if camera_pivot_path != NodePath():
		_camera_pivot = get_node_or_null(camera_pivot_path)
	_connect_health_signals()

func _physics_process(delta: float) -> void:
	if _is_dead:
		return
	_attack_timer = maxf(_attack_timer - delta, 0.0)
	_coyote_timer = maxf(_coyote_timer - delta, 0.0)
	_jump_buffer_timer = maxf(_jump_buffer_timer - delta, 0.0)
	_apply_gravity(delta)
	_apply_jump()
	_apply_movement(delta)
	_apply_basic_attack()
	velocity = move_and_slide()

	if is_on_floor():
		_coyote_timer = coyote_time
		if abs(velocity.y) < 0.01:
			velocity.y = 0.0

	# Guardamos la acción de salto para que sea más tolerante.
	if Input.is_action_just_pressed("jump"):
		_jump_buffer_timer = jump_buffer_time

func get_xp() -> int:
	return _xp

func receive_hit(damage: int) -> void:
	health_component.take_damage(damage)

func _connect_health_signals() -> void:
	if health_component.has_signal("health_changed"):
		health_component.health_changed.connect(_on_health_changed)
	if health_component.has_signal("died"):
		health_component.died.connect(_on_died)

func _apply_gravity(delta: float) -> void:
	# CharacterBody3D no aplica gravedad automaticamente; la simulamos aqui.
	if not is_on_floor():
		velocity.y -= gravity * delta
	elif velocity.y < 0.0:
		velocity.y = 0.0

func _apply_jump() -> void:
	# Salto con coyote time y buffer de salto.
	if _jump_buffer_timer > 0.0 and _coyote_timer > 0.0:
		velocity.y = jump_velocity
		_jump_buffer_timer = 0.0
		_coyote_timer = 0.0

func _apply_movement(delta: float) -> void:
	# Lee las acciones configuradas en project.godot y devuelve un vector 2D.
	var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	var move_basis := global_transform.basis

	# Si hay camara, el movimiento usa su orientacion para sentirse natural en tercera persona.
	if _camera_pivot != null:
		move_basis = _camera_pivot.global_transform.basis

	# Aplanamos los ejes para que mirar arriba/abajo no afecte el movimiento en el piso.
	var forward := -move_basis.z
	var right := move_basis.x
	forward.y = 0.0
	right.y = 0.0
	forward = forward.normalized()
	right = right.normalized()

	# Mezcla input horizontal/vertical con la direccion de la camara.
	var direction := (right * input_dir.x + forward * -input_dir.y).normalized()
	var target_speed := sprint_speed if Input.is_action_pressed("sprint") else walk_speed
	var target_velocity := Vector3(direction.x * target_speed, velocity.y, direction.z * target_speed)
	var smoothing := acceleration if direction.length_squared() > 0.001 else deacceleration

	velocity.x = lerp(velocity.x, target_velocity.x, smoothing * delta)
	velocity.z = lerp(velocity.z, target_velocity.z, smoothing * delta)

	# Rotamos el cuerpo hacia donde se mueve para que el personaje mire en la direccion correcta.
	if direction.length_squared() > 0.001:
		var target_angle := atan2(direction.x, direction.z)
		rotation.y = lerp_angle(rotation.y, target_angle, turn_speed * delta)

func _apply_basic_attack() -> void:
	if not Input.is_action_just_pressed("basic_attack") or _attack_timer > 0.0:
		return

	_attack_timer = attack_cooldown
	var target := _find_attack_target()
	if target == null:
		return

	if target.has_method("receive_hit"):
		target.receive_hit(attack_damage)

func _find_attack_target() -> Node3D:
	var enemies := get_tree().get_nodes_in_group("enemies")
	var best_target: Node3D = null
	var best_distance := attack_range
	var forward := -global_transform.basis.z.normalized()

	for enemy in enemies:
		if not enemy is Node3D:
			continue

		var enemy_node := enemy as Node3D
		var to_enemy: Vector3 = enemy_node.global_position - global_position
		var distance: float = to_enemy.length()
		if distance > best_distance:
			continue

		var facing_amount := forward.dot(to_enemy.normalized())
		if facing_amount < attack_arc:
			continue

		best_target = enemy
		best_distance = distance

	return best_target

func _on_health_changed(current_health: int, max_health: int) -> void:
	stats_changed.emit(current_health, max_health, _xp)

func _on_died() -> void:
	_is_dead = true
	_attack_timer = 0.0
	set_physics_process(false)

func _gain_xp(amount: int) -> void:
	_xp += amount
	stats_changed.emit(health_component.current_health, health_component.max_health, _xp)
