import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
import asyncpg

# URL de conexión a tu base de datos local
DB_URL = "postgresql://postgres:admin123@localhost:5432/mmorpgjuego1"

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        self.estado_juego = {}
        self.pool = None

    async def conectar_db(self):
        self.pool = await asyncpg.create_pool(DB_URL)
        print("🟢 Base de datos conectada exitosamente.")

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections[username] = websocket
        
        async with self.pool.acquire() as conexion:
            # Traemos TODAS las columnas base
            jugador_db = await conexion.fetchrow(
                """SELECT pos_x, pos_y, nivel, experiencia, puntos_libres, 
                vitalidad, fuerza, destreza, agilidad, inteligencia, sabiduria, constitucion, suerte 
                FROM jugadores WHERE username = $1""", username
            )
            
            if jugador_db:
                self.estado_juego[username] = {
                    "x": jugador_db["pos_x"],
                    "y": jugador_db["pos_y"],
                    "nivel": jugador_db["nivel"]
                    }
                
                # Armamos un diccionario con los stats del jugador que regresó
                stats_base = {
                    "nivel": jugador_db["nivel"],
                    "experiencia": jugador_db["experiencia"],
                    "puntos_libres": jugador_db["puntos_libres"],
                    "vitalidad": jugador_db["vitalidad"],
                    "fuerza": jugador_db["fuerza"],
                    "destreza": jugador_db["destreza"],
                    "agilidad": jugador_db["agilidad"],
                    "inteligencia": jugador_db["inteligencia"],
                    "sabiduria": jugador_db["sabiduria"],
                    "constitucion": jugador_db["constitucion"],
                    "suerte": jugador_db["suerte"]
                }
                print(f"Jugador {username} regresó (Nivel {stats_base['nivel']})")
            else:
                await conexion.execute(
                    "INSERT INTO jugadores (username) VALUES ($1)", username
                )
                self.estado_juego[username] = {
                    "x": 100.0,
                    "y": 200.0,
                    "nivel": 1
                }
                
                # Si es nuevo, arranca con los valores por defecto
                stats_base = {
                    "nivel": 1, "experiencia": 0, "puntos_libres": 0,
                    "vitalidad": 5, "fuerza": 5, "destreza": 5, "agilidad": 5,
                    "inteligencia": 5, "sabiduria": 5, "constitucion": 5, "suerte": 5
                }
                print(f"Jugador nuevo {username} registrado.")

        import json 
        # Le mandamos el paquete completo a Godot
        mensaje_bienvenida = {
            "accion": "bienvenida",
            "tu_id": username,
            "stats": stats_base
        }
        await websocket.send_text(json.dumps(mensaje_bienvenida))

    async def disconnect(self, username: str):
        if username in self.estado_juego:
            pos_x = self.estado_juego[username]["x"]
            pos_y = self.estado_juego[username]["y"]
            nivel = self.estado_juego[username]["nivel"]
            async with self.pool.acquire() as conexion:
                await conexion.execute(
                    "UPDATE jugadores SET pos_x = $1, pos_y = $2, nivel = $3 WHERE username = $4",
                    pos_x, pos_y, nivel, username
                )
            print(f"💾 Progreso guardado para {username}.")
            del self.estado_juego[username]
            
        if username in self.active_connections:
            del self.active_connections[username]

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

# NUEVA FORMA DE INICIAR LA BASE DE DATOS (Sin el DeprecationWarning)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Esto corre al prender el servidor
    await manager.conectar_db()
    yield
    # (Lo que pongas acá correría al apagar el servidor)

app = FastAPI(lifespan=lifespan)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            paquete = json.loads(data)
            
            if paquete.get("accion") == "mover":
                manager.estado_juego[client_id]["x"] = paquete["x"]
                manager.estado_juego[client_id]["y"] = paquete["y"]
                
                estado_global = {
                    "accion": "actualizar_mundo",
                    "jugadores": manager.estado_juego
                }
                await manager.broadcast(json.dumps(estado_global))
                
            # Logica de Chat
            elif paquete.get("accion") == "chat":
                mensaje_chat = {
                    "accion": "chat",
                    "jugador_id": client_id,
                    "texto": paquete["texto"]
                }
                await manager.broadcast(json.dumps(mensaje_chat))
                
            # --- NUEVA LÓGICA DE ATAQUE ---
            elif paquete.get("accion") == "atacar":
                mensaje_ataque = {
                    "accion": "atacar",
                    "jugador_id": client_id,
                    "tipo": paquete.get("tipo", 1)
                }
                await manager.broadcast(json.dumps(mensaje_ataque))
                
            # --- NUEVA LÓGICA DE DAÑO ---
            elif paquete.get("accion") == "dano":
                mensaje_dano = {
                    "accion": "dano",
                    "victima_id": paquete["victima_id"],
                    "cantidad": paquete["cantidad"]
                }
                await manager.broadcast(json.dumps(mensaje_dano))
                
    except WebSocketDisconnect:
        await manager.disconnect(client_id)
        aviso = json.dumps({"accion": "desconectar", "jugador_id": client_id})
        await manager.broadcast(aviso)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)