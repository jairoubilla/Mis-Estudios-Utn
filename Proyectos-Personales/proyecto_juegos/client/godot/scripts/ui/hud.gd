extends CanvasLayer

@onready var hp_label: Label = $Root/Stats/HPLabel
@onready var xp_label: Label = $Root/Stats/XPLabel
@onready var hint_label: Label = $Root/HintLabel

func _ready() -> void:
	hint_label.text = "WASD: mover | Click izquierdo/J: atacar | Space: saltar | Shift: correr"
	_create_mobile_controls()

func set_player_stats(current_health: int, max_health: int, xp: int) -> void:
	hp_label.text = "HP: %d / %d" % [current_health, max_health]
	xp_label.text = "XP: %d" % xp

func _create_mobile_controls() -> void:
	var left_pad := Panel.new()
	left_pad.name = "MobileLeftPad"
	left_pad.anchor_left = 0.0
	left_pad.anchor_top = 1.0
	left_pad.anchor_right = 0.0
	left_pad.anchor_bottom = 1.0
	left_pad.margin_left = 20
	left_pad.margin_top = -300
	left_pad.rect_size = Vector2(260, 260)
	left_pad.mouse_filter = Control.MOUSE_FILTER_STOP
	left_pad.add_theme_stylebox_override("panel", _create_mobile_button_style(Color(0.0, 0.0, 0.0, 0.35)))
	$Root.add_child(left_pad)

	var button_size := 80
	var gap := 10
	left_pad.add_child(_create_mobile_button("MoveUp", "↑", Rect2(Vector2(button_size + gap, 0), Vector2(button_size, button_size)), "move_forward"))
	left_pad.add_child(_create_mobile_button("MoveLeft", "←", Rect2(Vector2(0, button_size + gap), Vector2(button_size, button_size)), "move_left"))
	left_pad.add_child(_create_mobile_button("MoveDown", "↓", Rect2(Vector2(button_size + gap, button_size + gap * 2), Vector2(button_size, button_size)), "move_back"))
	left_pad.add_child(_create_mobile_button("MoveRight", "→", Rect2(Vector2(button_size * 2 + gap * 2, button_size + gap), Vector2(button_size, button_size)), "move_right"))

	var right_pad := Panel.new()
	right_pad.name = "MobileRightPad"
	right_pad.anchor_left = 1.0
	right_pad.anchor_top = 1.0
	right_pad.anchor_right = 1.0
	right_pad.anchor_bottom = 1.0
	right_pad.margin_left = -280
	right_pad.margin_right = -20
	right_pad.margin_top = -300
	right_pad.rect_size = Vector2(260, 260)
	right_pad.mouse_filter = Control.MOUSE_FILTER_STOP
	right_pad.add_theme_stylebox_override("panel", _create_mobile_button_style(Color(0.0, 0.0, 0.0, 0.35)))
	$Root.add_child(right_pad)

	right_pad.add_child(_create_mobile_button("Attack", "Ataque", Rect2(Vector2(0, 0), Vector2(260, 90)), "basic_attack"))
	right_pad.add_child(_create_mobile_button("Jump", "Salto", Rect2(Vector2(0, 100), Vector2(120, 90)), "jump"))
	right_pad.add_child(_create_mobile_button("Sprint", "Correr", Rect2(Vector2(140, 100), Vector2(120, 90)), "sprint"))

	hint_label.text += " | Arrastra a la derecha para rotar la cámara"

func _create_mobile_button(name: String, text: String, rect: Rect2, action: String) -> Button:
	var button := Button.new()
	button.name = name
	button.text = text
	button.focus_mode = Control.FOCUS_NONE
	button.anchor_left = 0.0
	button.anchor_top = 0.0
	button.anchor_right = 0.0
	button.anchor_bottom = 0.0
	button.rect_position = rect.position
	button.rect_size = rect.size
	button.add_theme_stylebox_override("normal", _create_mobile_button_style(Color(0.08, 0.08, 0.08, 0.75)))
	button.add_theme_stylebox_override("hover", _create_mobile_button_style(Color(0.12, 0.12, 0.12, 0.85)))
	button.add_theme_stylebox_override("pressed", _create_mobile_button_style(Color(0.15, 0.15, 0.15, 0.9)))
	button.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0))
	button.mouse_filter = Control.MOUSE_FILTER_STOP
	button.connect("gui_input", Callable(self, "_on_mobile_button_gui_input"), [action])
	return button

func _create_mobile_button_style(color: Color) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.border_color = Color(1.0, 1.0, 1.0, 0.12)
	style.border_width_all = 2
	style.corner_radius_top_left = 20
	style.corner_radius_top_right = 20
	style.corner_radius_bottom_left = 20
	style.corner_radius_bottom_right = 20
	return style

func _on_mobile_button_gui_input(event: InputEvent, action: String) -> void:
	if event is InputEventMouseButton or event is InputEventScreenTouch:
		if event.pressed:
			Input.action_press(action)
		else:
			Input.action_release(action)

