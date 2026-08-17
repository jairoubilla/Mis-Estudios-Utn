extends Node

var socket = WebSocketPeer.new()
var client_id = "" 
var paso_ataque = 1
var tiempo_reset_combo = 0.0
var mi_vida = 100
var mi_id = ""

var mi_posicion_x = 100.0
var mi_posicion_y = 200.0
var velocidad = 300.0 

var jugadores_nodos = {}
var escena_jugador = preload("res://jugador.tscn")

# --- SISTEMA DE ESTADÍSTICAS ---
# Capa 1: Lo que viene de la base de datos
var mis_atributos = {} 

# Capa 2: Lo que me da el equipo (arranca vacío/en cero)
var modificadores_planos = {}
var modificadores_porcentuales = {}

# Capa 3: El resultado final de toda la matemática
var mis_stats_finales = {}

func _ready():
	$InterfazJuego/BarraVida.value = mi_vida
	# Ocultamos la interfaz del juego al principio
	$InterfazJuego.hide() 
	
	# Conectamos los botones y cajas de texto
	$UI/BotonEntrar.pressed.connect(_on_boton_entrar_pressed)
	$InterfazJuego/InputChat.text_submitted.connect(_on_input_chat_text_submitted)

func _on_boton_entrar_pressed():
	var nombre_escrito = $UI/InputNombre.text.strip_edges() 
	
	if nombre_escrito != "":
		client_id = nombre_escrito 
		var url = "ws://127.0.0.1:8000/ws/" + client_id
		socket.connect_to_url(url)
		
		$UI.hide() # Ocultamos el login
		$InterfazJuego.show() # Mostramos el chat

# --- NUEVA FUNCIÓN PARA ENVIAR CHAT ---
func _on_input_chat_text_submitted(nuevo_texto):
	if nuevo_texto.strip_edges() != "":
		var paquete_chat = {
			"accion": "chat",
			"texto": nuevo_texto
		}
		socket.send_text(JSON.stringify(paquete_chat))
		$InterfazJuego/InputChat.text = "" # Limpiamos la caja después de enviar

func _process(delta):
	# --- NUEVO: TEMPORIZADOR DEL COMBO ---
	if tiempo_reset_combo > 0:
		tiempo_reset_combo -= delta
		if tiempo_reset_combo <= 0:
			paso_ataque = 1 # Si pasó mucho tiempo, volvemos al golpe 1

	socket.poll()
	var state = socket.get_ready_state()
	
	if state == WebSocketPeer.STATE_OPEN:
		while socket.get_available_packet_count():
			var packet = socket.get_packet()
			var message = packet.get_string_from_utf8()
			var datos = JSON.parse_string(message)
			
			if datos != null and datos.has("accion"):
				if datos["accion"] == "actualizar_mundo":
					actualizar_jugadores(datos["jugadores"])
				elif datos["accion"] == "desconectar":
					eliminar_jugador(datos["jugador_id"])
				elif datos["accion"] == "chat":
					mostrar_mensaje_chat(datos["jugador_id"], datos["texto"])
				# --- RECIBIR MI ID Y STATS DEL SERVIDOR ---
				elif datos["accion"] == "bienvenida":
					mi_id = str(datos["tu_id"])
					mis_atributos = datos["stats"] # Guardamos los 8 atributos base
					
					print("¡Conectado! El servidor me asignó el ID: ", mi_id)
					
					#--- Le ponemos el nombre a nuestro personaje
					if has_node("EtiquetaNombre"):
						$EtiquetaNombre.text = mi_id
						
					calcular_estadisticas_totales() # Hacemos la matemática inicial
					
				# --- NUEVO: RECIBIR ATAQUE CON TIPO ---
				elif datos["accion"] == "atacar":
					var tipo = 1
					if datos.has("tipo"):
						tipo = datos["tipo"]
					ejecutar_ataque(datos["jugador_id"], tipo)
					
				# --- RECIBIR DAÑO (¡VERSIÓN LIMPIA!) ---
				elif datos["accion"] == "dano":
					var id_lastimado = str(datos["victima_id"])
					var dano_recibido = int(datos["cantidad"])
					
					# 1. Efecto visual y barra flotante del personaje lastimado
					if jugadores_nodos.has(id_lastimado):
						var personaje_lastimado = jugadores_nodos[id_lastimado]
						var sprite_victima = personaje_lastimado.get_node("AnimatedSprite2D")
						sprite_victima.modulate = Color(1, 0, 0)
						
						# Si creaste la barra flotante en la escena, la actualizamos
						if personaje_lastimado.has_node("BarraFlotante"):
							var barra_flotante = personaje_lastimado.get_node("BarraFlotante")
							barra_flotante.value -= dano_recibido
						
						await get_tree().create_timer(0.2).timeout
						if is_instance_valid(sprite_victima):
							sprite_victima.modulate = Color(1, 1, 1) 
					
					# 2. SOLO restamos vida general si el jugador lastimado soy yo
					if id_lastimado == str(mi_id):
						mi_vida -= dano_recibido
						$InterfazJuego/BarraVida.value = mi_vida
						
						if mi_vida <= 0:
							print("¡Caíste en combate! Reapareciendo en la base...")
							
							# Restauramos la vida general
							mi_vida = 100
							$InterfazJuego/BarraVida.value = mi_vida
							
							# Restauramos la barra flotante y nos teletransportamos
							if jugadores_nodos.has(mi_id):
								if jugadores_nodos[mi_id].has_node("BarraFlotante"):
									jugadores_nodos[mi_id].get_node("BarraFlotante").value = 100
								jugadores_nodos[mi_id].position = Vector2(100.0, 200.0)
							
							var paquete_respawn = {
								"accion": "mover",
								"x": 100.0,
								"y": 200.0
							}
							socket.send_text(JSON.stringify(paquete_respawn))

		# Solo nos movemos si la caja de chat NO está seleccionada
		if not $InterfazJuego/InputChat.has_focus():
			
			# --- NUEVO: ENVIAR ATAQUE Y COMBO ---
			if Input.is_action_just_pressed("ui_accept"):
				var paquete_ataque = {"accion": "atacar", "tipo": paso_ataque}
				socket.send_text(JSON.stringify(paquete_ataque))
				
				if paso_ataque == 1:
					paso_ataque = 2
					tiempo_reset_combo = 0.8 # Tiempo para apretar de nuevo
				else:
					paso_ataque = 1
					tiempo_reset_combo = 0.0 # Se resetea el combo
				
			var direccion = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
			
			if direccion != Vector2.ZERO:
				mi_posicion_x += direccion.x * velocidad * delta
				mi_posicion_y += direccion.y * velocidad * delta
				
				var paquete_salida = {
					"accion": "mover",
					"x": mi_posicion_x,
					"y": mi_posicion_y
				}
				socket.send_text(JSON.stringify(paquete_salida))

# --- FUNCIONES PARA DIBUJAR E INTERFAZ ---

func actualizar_jugadores(jugadores_servidor):
	for id_servidor in jugadores_servidor:
		var pos_x = float(jugadores_servidor[id_servidor]["x"])
		var pos_y = float(jugadores_servidor[id_servidor]["y"])
		
		if not jugadores_nodos.has(id_servidor):
			var nuevo_personaje = escena_jugador.instantiate()
			nuevo_personaje.name = str(id_servidor) #<-- Usamos su ID como nombre del nodo
			add_child(nuevo_personaje)
			jugadores_nodos[id_servidor] = nuevo_personaje 
			
			# <-- Conectamos la "alarma" de la espada
			var espada_nueva = nuevo_personaje.get_node("Espada")
			espada_nueva.area_entered.connect(_on_espada_golpea.bind(id_servidor))
			
		if not jugadores_nodos.has(id_servidor):
			var nuevo_personaje = escena_jugador.instantiate()
			nuevo_personaje.name = str(id_servidor) 
			add_child(nuevo_personaje)
			jugadores_nodos[id_servidor] = nuevo_personaje 
			
			var espada_nueva = nuevo_personaje.get_node("Espada")
			espada_nueva.area_entered.connect(_on_espada_golpea.bind(id_servidor))
			
			# --- LE PONEMOS EL NOMBRE Y EL COLOR POR NIVEL ---
			if nuevo_personaje.has_node("EtiquetaNombre"):
				var etiqueta = nuevo_personaje.get_node("EtiquetaNombre")
				etiqueta.text = str(id_servidor)
				
				# Nivel al azar para probar los colores (luego vendrá de tu BD)
				var nivel_jugador = randi_range(1, 60) 
				var color_texto = Color.WHITE
				
				if nivel_jugador >= 50:
					color_texto = Color.GOLD # Dorado/Amarillo
				elif nivel_jugador >= 25:
					color_texto = Color.DARK_ORCHID # Violeta
				elif nivel_jugador >= 10:
					color_texto = Color.LIME_GREEN # Verde
					
				# Le aplicamos el color a la etiqueta
				etiqueta.add_theme_color_override("font_color", color_texto)
			
		# --- LÓGICA PARA GIRAR EL PERSONAJE Y SU ESPADA ---
		var nodo_jugador = jugadores_nodos[id_servidor]
		var sprite = nodo_jugador.get_node("AnimatedSprite2D")
		var espada = nodo_jugador.get_node("Espada") # Agarramos el nodo de la espada
		
		# Si la nueva posición es mayor, va a la derecha
		if pos_x > nodo_jugador.position.x:
			sprite.flip_h = false
			espada.scale.x = 1 # La espada apunta a la derecha
		# Si la nueva posición es menor, va a la izquierda
		elif pos_x < nodo_jugador.position.x:
			sprite.flip_h = true
			espada.scale.x = -1 # Invertimos la espada para que apunte a la izquierda
		# --------------------------------------------
			
		jugadores_nodos[id_servidor].position = Vector2(pos_x, pos_y)

func eliminar_jugador(id_jugador):
	if jugadores_nodos.has(id_jugador):
		jugadores_nodos[id_jugador].queue_free()
		jugadores_nodos.erase(id_jugador)

func mostrar_mensaje_chat(remitente, texto):
	# Agregamos el texto al historial saltando una línea
	$InterfazJuego/HistorialChat.text += "\n" + remitente + ": " + texto

func ejecutar_ataque(id_jugador, tipo):
	if jugadores_nodos.has(id_jugador):
		var jugador_atacante = jugadores_nodos[id_jugador] 
		var sprite = jugador_atacante.get_node("AnimatedSprite2D")
		var hitbox_espada = jugador_atacante.get_node("Espada/CollisionShape2D")
		
		# Elegimos qué animación reproducir
		var animacion_elegida = "atacar"
		if tipo == 2:
			animacion_elegida = "atacar2"
			
		# Le damos play a la animación PRIMERO
		sprite.play(animacion_elegida)
		
		# --- EL TRUCO: Esperamos un instante antes de prender la espada ---
		# (Podés cambiar el 0.15 por 0.1 o 0.2 si sentís que pega muy rápido o muy lento)
		await get_tree().create_timer(0.7).timeout
		
		# ¡Ahora sí, PRENDEMOS EL FILO justo cuando la espada baja visualmente!
		hitbox_espada.disabled = false 
		
		# Esperamos que termine la animación completa
		await sprite.animation_finished
		
		# APAGAMOS EL FILO
		hitbox_espada.disabled = true 
		
		# Volvemos a respirar
		if sprite.animation == animacion_elegida:
			sprite.play("default")
			
func _on_espada_golpea(area_golpeada, id_atacante):
	if area_golpeada.name == "Cuerpo":
		var id_victima = area_golpeada.get_parent().name
		
		if str(id_victima) != str(id_atacante):
			print("¡IMPACTO! El jugador ", id_atacante, " le pegó a ", id_victima)
			
			# --- NUEVO: LE AVISAMOS AL SERVIDOR DEL GOLPE ---
			var paquete_dano = {
				"accion": "dano",
				"victima_id": id_victima,
				"cantidad": 10
			}
			socket.send_text(JSON.stringify(paquete_dano))
			
# --- FÁBRICA DE ESTADÍSTICAS ---
func calcular_estadisticas_totales():
	# 1. Cálculos Base (Atributos -> Derivadas)
	var base_hp = 100 + (mis_atributos["vitalidad"] * 15)
	var base_ataque_fisico = 5 + (mis_atributos["fuerza"] * 2.5)
	var base_defensa = mis_atributos["constitucion"] * 2.0
	var base_evasion = mis_atributos["agilidad"] * 0.8
	var base_critico = 5.0 + (mis_atributos["suerte"] * 0.3) + (mis_atributos["destreza"] * 0.1)
	
	# 2. Matemática Final: (Base + Planos) * Porcentuales
	mis_stats_finales["hp_maximo"] = (base_hp + modificadores_planos.get("hp_maximo", 0)) * modificadores_porcentuales.get("hp_maximo", 1.0)
	
	mis_stats_finales["ataque_fisico"] = (base_ataque_fisico + modificadores_planos.get("ataque_fisico", 0)) * modificadores_porcentuales.get("ataque_fisico", 1.0)
	
	mis_stats_finales["defensa_fisica"] = (base_defensa + modificadores_planos.get("defensa_fisica", 0)) * modificadores_porcentuales.get("defensa_fisica", 1.0)
	
	mis_stats_finales["evasion"] = (base_evasion + modificadores_planos.get("evasion", 0)) * modificadores_porcentuales.get("evasion", 1.0)
	
	mis_stats_finales["probabilidad_critico"] = (base_critico + modificadores_planos.get("probabilidad_critico", 0)) * modificadores_porcentuales.get("probabilidad_critico", 1.0)
	
	# 3. Ajustamos la vida actual al nuevo máximo
	mi_vida = mis_stats_finales["hp_maximo"]
	$InterfazJuego/BarraVida.max_value = mis_stats_finales["hp_maximo"]
	$InterfazJuego/BarraVida.value = mi_vida
	
	# Si tenemos la barra flotante arriba de la cabeza, también le subimos el máximo
	if jugadores_nodos.has(mi_id):
		if jugadores_nodos[mi_id].has_node("BarraFlotante"):
			var mi_barra_flotante = jugadores_nodos[mi_id].get_node("BarraFlotante")
			mi_barra_flotante.max_value = mis_stats_finales["hp_maximo"]
			mi_barra_flotante.value = mi_vida
		
	print("Stats calculados. Mi HP máximo es: ", mis_stats_finales["hp_maximo"])
