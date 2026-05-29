extends CharacterBody3D

signal defeated(xp_reward: int)

@export var xp_reward := 25
@export var chase_speed := 3.0
@export var aggro_range := 10.0
@export var attack_range := 2.0
@export var attack_damage := 10
@export var attack_cooldown := 1.0
@export var player_group := "player"

var _player: Node = null
var _attack_timer := 0.0

@onready var health_component: Node = $HealthComponent
@onready var body: MeshInstance3D = $Visuals/Body

func _ready() -> void:
	# El enemigo escucha su propio componente de vida para reaccionar al morir.
	health_component.died.connect(_on_died)
	_player = _find_player()

func _physics_process(delta: float) -> void:
	_attack_timer = maxf(_attack_timer - delta, 0.0)
	if _player == null or not is_instance_valid(_player):
		_player = _find_player()
		if _player == null:
			return

	var distance := global_position.distance_to(_player.global_position)
	if distance <= attack_range:
		_try_attack_player()
		_stop_movement(delta)
	elif distance <= aggro_range:
		_pursue_player(delta)
	else:
		_stop_movement(delta)

	move_and_slide()

func _find_player() -> Node:
	var players := get_tree().get_nodes_in_group(player_group)
	return players.size() > 0 ? players[0] : null

func _pursue_player(delta: float) -> void:
	var direction := _player.global_position - global_position
	direction.y = 0.0
	direction = direction.normalized()
	velocity.x = direction.x * chase_speed
	velocity.z = direction.z * chase_speed
	_rotate_towards(direction, delta)

func _stop_movement(delta: float) -> void:
	velocity.x = lerp(velocity.x, 0.0, 10.0 * delta)
	velocity.z = lerp(velocity.z, 0.0, 10.0 * delta)

func _try_attack_player() -> void:
	if _attack_timer > 0.0:
		return

	_attack_timer = attack_cooldown
	if _player.has_method("receive_hit"):
		_player.receive_hit(attack_damage)

func _rotate_towards(direction: Vector3, delta: float) -> void:
	if direction.length_squared() < 0.001:
		return

	var target_angle := atan2(direction.x, direction.z)
	rotation.y = lerp_angle(rotation.y, target_angle, 6.0 * delta)

func receive_hit(damage: int) -> void:
	health_component.take_damage(damage)
	_flash_hit()

func _flash_hit() -> void:
	# Feedback visual muy simple mientras no tenemos VFX reales.
	var material := body.get_surface_override_material(0)
	if material is StandardMaterial3D:
		material.albedo_color = Color(1.0, 0.35, 0.25, 1.0)

func _on_died() -> void:
	defeated.emit(xp_reward)
	queue_free()

