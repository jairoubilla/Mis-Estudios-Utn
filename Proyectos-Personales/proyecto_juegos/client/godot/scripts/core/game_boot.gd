extends Node3D

# Ruta del archivo de datos que define las clases jugables.
const CLASS_DATA_PATH := "res://data/classes/classes.json"

@onready var player: Node = $World/Player
@onready var hud: CanvasLayer = $HUD

func _ready() -> void:
	# Punto de entrada temporal del prototipo. Luego aqui inicializaremos servicios globales.
	print("Aetherfall Online prototype booted.")
	_load_class_data()
	_connect_prototype_signals()

func _load_class_data() -> void:
	# Cargar clases desde JSON nos permite balancear sin tocar codigo.
	var file := FileAccess.open(CLASS_DATA_PATH, FileAccess.READ)
	if file == null:
		push_warning("Class data not found: %s" % CLASS_DATA_PATH)
		return

	# JSON.parse_string devuelve Variant, por eso validamos el tipo antes de usarlo.
	var parsed_data: Variant = JSON.parse_string(file.get_as_text())
	if typeof(parsed_data) != TYPE_DICTIONARY:
		push_error("Invalid class data format.")
		return

	var class_data: Dictionary = parsed_data
	print("Loaded %d playable classes." % class_data.get("classes", []).size())

func _connect_prototype_signals() -> void:
	# Conectamos UI y gameplay en esta escena hasta tener un sistema global de estado.
	if player.has_signal("stats_changed"):
		player.stats_changed.connect(hud.set_player_stats)
		hud.set_player_stats(
			player.health_component.current_health,
			player.health_component.max_health,
			player.get_xp()
		)

	for enemy in get_tree().get_nodes_in_group("enemies"):
		if enemy.has_signal("defeated"):
			enemy.defeated.connect(Callable(player, "_gain_xp"))
