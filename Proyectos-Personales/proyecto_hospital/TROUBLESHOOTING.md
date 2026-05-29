# Troubleshooting Guide - Proyecto Hospital

## 🔍 Guía de Resolución de Problemas

Esta guía te ayudará a diagnosticar y resolver problemas comunes en el Proyecto Hospital.

---

## 🛠️ Configuración Inicial

### Problema: "ModuleNotFoundError: No module named 'flask'"

**Síntomas:**
- Error al ejecutar `python app.py`
- No se carga la aplicación

**Causa:**
- Virtual environment no activado
- Paquetes no instalados

**Solución:**

```bash
# 1. Verificar que estás en el directorio correcto
cd hospital_backend

# 2. Activar virtual environment
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Verificar instalación
python -c "import flask; print(flask.__version__)"
```

### Problema: "ConnectionError: Cannot connect to database"

**Síntomas:**
- Error de conexión a SQLite o PostgreSQL
- Aplicación no inicia

**Causa:**
- Archivo SQLite no existe
- Credenciales de PostgreSQL incorrectas
- Base de datos no iniciada

**Solución:**

```bash
# Para SQLite (desarrollo)
cd hospital_backend
python preparar_db_py  # Crear BD desde cero

# Para PostgreSQL (producción)
# 1. Verificar que PostgreSQL está corriendo
# Windows
psql -U postgres -c "SELECT 1"

# Mac/Linux
psql -U postgres -c "SELECT 1"

# 2. Verificar credenciales en .env
cat .env | grep DATABASE_URI

# 3. Crear BD manualmente si es necesario
psql -U admin -c "CREATE DATABASE hospital;"
psql -U admin -d hospital -f preparar_db_py
```

### Problema: ".env no se carga"

**Síntomas:**
- `SECRET_KEY=None` o valor por defecto
- CORS_ORIGINS no funciona

**Causa:**
- Archivo `.env` no existe
- Ubicación incorrecta
- Formato incorrecto

**Solución:**

```bash
# 1. Crear archivo .env
cd hospital_backend
cp .env.example .env

# 2. Verificar contenido
cat .env

# 3. Formato correcto (sin espacios alrededor de =)
# ✅ Bien
SECRET_KEY=abc123xyz789

# ❌ Mal
SECRET_KEY = abc123xyz789
SECRET_KEY= abc123xyz789

# 4. Recargar
# Reiniciar aplicación
```

**Contenido mínimo de .env:**
```
SECRET_KEY=tu-clave-secreta-aqui
JWT_SECRET_KEY=tu-jwt-secret-aqui
DATABASE_URI=sqlite:///hospital.db
DEBUG=False
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:3000
```

---

## 🔐 Autenticación

### Problema: "401 Unauthorized" en todo lado

**Síntomas:**
- Endpoints que debería funcionar devuelven 401
- Token no funciona
- Login fallido

**Causa:**
- Token expirado
- JWT_SECRET_KEY incorrecto
- Format incorrecto del header

**Solución:**

```javascript
// Frontend - Verificar token en localStorage
console.log('Token:', localStorage.getItem('token'));

// Debería devolver algo como:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Verificar que axios incluye header
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Backend - Verificar secret key
from config import Config
print(Config.JWT_SECRET_KEY)  # Debe ser igual al .env
```

```bash
# Backend - Verificar JWT
# En Python shell
from flask_jwt_extended import create_access_token
from datetime import timedelta

jwt_token = create_access_token(
    identity='admin',
    expires_delta=timedelta(hours=1)
)
print(jwt_token)  # Must output a valid token
```

### Problema: "Login inválido" o credenciales rechazadas

**Síntomas:**
- No puedo entrar como admin
- Usuario/contraseña no funcionan

**Causa:**
- Credenciales cambiar pero no recuerdo
- Password hasheada incorrectamente

**Solución:**

```python
# En auth_bp.py, buscar:
ADMIN_CREDENTIALS = {
    'admin': 'admin123'  # Cambiar aquí
}

# Mejor: Usar bcrypt para hash
import bcrypt

password = "tu-password-fuerte"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
print(hashed.decode())  # Usar en código

# Verif
if bcrypt.checkpw(password.encode(), hashed):
    print("Password correcto!")
```

### Problema: Token expira muy rápido o muy lento

**Control:**
- Verificar tiempo de expiración en config.py
- Token expires in 1 hora por defecto (bueno para seguridad)
- Para dev, aumentar a 7 días

```python
# config.py
class Config:
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Producción
    # JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)  # Desarrollo
```

---

## 🗄️ Base de Datos

### Problema: "No tables in database"

**Síntomas:**
- Endpoints devuelven errores de tabla no encontrada
- SELECT queries fallan

**Causa:**
- preparar_db_py no ejecutado
- Tabla creada en BD incorrecta

**Solución:**

```bash
cd hospital_backend

# Opción 1: Ejecutar script de inicialización
python preparar_db_py

# Opción 2: Limpiar y recrear (BORRA DATOS!)
rm hospital.db
python preparar_db_py

# Opción 3: Verificar tabla manualmente
sqlite3 hospital.db ".tables"
# Debería mostrar: admin medicos pacientes turnos

# Ver estructura de tabla
sqlite3 hospital.db ".schema pacientes"
```

### Problema: "UNIQUE constraint failed"

**Síntomas:**
- Error al crear paciente/médico
- DNI duplicado aunque entrada nueva

**Causa:**
- DNI ya existe en BD
- No hay validación de duplicados

**Solución:**

```bash
# Verificar duplicados
sqlite3 hospital.db "SELECT dni, COUNT(*) FROM pacientes GROUP BY dni HAVING COUNT(*) > 1;"

# Ver registro duplicado
sqlite3 hospital.db "SELECT * FROM pacientes WHERE dni = '12345678';"

# Eliminar un duplicado (si es necesario)
sqlite3 hospital.db "DELETE FROM pacientes WHERE id = 5;"

# Mejor: Agregar validación en backend
# Ver SECURITY.md para validación de DNI
```

### Problema: "Foreign key constraint failed"

**Síntomas:**
- No puedo crear turno aunque exista paciente
- Error de relación entre tablas

**Causa:**
- FK constraint no habilitado
- IDs no existen en tabla relacionada

**Solución:**

```bash
# Habilitar FK en SQLite
sqlite3 hospital.db "PRAGMA foreign_keys = ON;"

# Verificar que existen los IDs
sqlite3 hospital.db "SELECT id FROM pacientes WHERE id = 1;"
sqlite3 hospital.db "SELECT id FROM medicos WHERE id = 1;"

# Ver qué FK constraints existen
sqlite3 hospital.db ".schema turnos"
# Debería mostrar FOREIGN KEY constraints
```

### Problema: Queries lentos

**Síntomas:**
- Listar pacientes tarda >1 segundo
- Búsqueda de médicos muy lenta

**Causa:**
- Índices no creados
- Búsquedas sin índice

**Solución:**

```bash
# Verificar índices
sqlite3 hospital.db ".indices"

# Si no ve índices en output, crearlos:
sqlite3 hospital.db < preparar_db_py

# Analizar query
sqlite3 hospital.db "EXPLAIN QUERY PLAN SELECT * FROM pacientes WHERE dni = '12345678';"

# Debería usar index (Line en output)
# Si dice "SCAN TABLE" es slow → necesita index

# Test performance
time sqlite3 hospital.db "SELECT COUNT(*) FROM pacientes;"
```

---

## 🌐 Conectividad Frontend-Backend

### Problema: "CORS error: No 'Access-Control-Allow-Origin'"

**Síntomas:**
- Console muestra CORS error
- Requests bloqueados en browser
- Network tab muestra error

**Causa:**
- CORS no configurado
- Origen no en whitelist
- Preflight request fallido

**Solución:**

```javascript
// Frontend - Verificar origin
console.log('Origin:', window.location.origin);
// Debería ser http://localhost:5173

// Backend - Verificar CORS_ORIGINS
python -c "from config import Config; print(Config.CORS_ORIGINS)"

// Si falta, actualizar .env
// .env debe contener:
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

```python
# Backend - Verificar que CORS está configurado
# En app.py debe existir:
from flask_cors import CORS
CORS(app, origins=Config.CORS_ORIGINS.split(','))

# O por endpoint:
@app.route('/api/pacientes', methods=['GET', 'POST'])
@cross_origin(origins=Config.CORS_ORIGINS)
def pacientes():
    ...
```

### Problema: "Cannot POST /api/pacientes"

**Síntomas:**
- Frontend envía POST pero recibe 404
- Endpoint no encontrado

**Causa:**
- URL incorrecta en frontend
- Blueprint no registrado
- Typo en ruta

**Solución:**

```javascript
// Frontend - Verificar URL
console.log('API_ENDPOINTS:', API_ENDPOINTS);

// Debería mostrar:
// {
//   PACIENTES: 'http://127.0.0.1:5000/api/pacientes',
//   MEDICOS: 'http://127.0.0.1:5000/api/medicos',
//   ...
// }

// Hacer request de prueba
fetch(API_ENDPOINTS.PACIENTES)
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
```

```python
# Backend - Verificar blueprints
from app import app
with app.app_context():
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.rule}")

# Debería incluir:
# api_pacientes.agregar_paciente: /api/pacientes
# api_pacientes.obtener_pacientes: /api/pacientes
# etc.
```

### Problema: "Network error: ERR_CONNECTION_REFUSED"

**Síntomas:**
- No puedo conectar al backend
- Todos los requests fallan
- Browser muestra error de conexión

**Causa:**
- Backend no está corriendo
- Puerto incorrecto
- IP/host incorrecto

**Solución:**

```bash
# 1. Verificar que backend está corriendo
# En terminal del backend debería ver:
# "Running on http://127.0.0.1:5000"

# 2. Si no, iniciarlo
cd hospital_backend
python app.py

# 3. Verificar puerto
netstat -an | grep 5000  # Ver si puerto está siendo usado

# 4. Si puerto está en uso, liberar
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# 5. Verificar API_ENDPOINTS config
cat hospital-frontend/src/config/api.config.js
# Debe coincidir con backend URL
```

---

## ✅ Testing

### Problema: "pytest: command not found"

**Síntomas:**
- Cannot run `pytest`
- Module no encuentra tests

**Causa:**
- pytest no instalado
- Virtual environment no activado

**Solución:**

```bash
cd hospital_backend

# Activar venv
source venv/bin/activate  # Mac/Linux
# o
venv\Scripts\activate  # Windows

# Instalar pytest
pip install pytest pytest-cov

# Verificar instalacion
pytest --version

# Ejecutar tests
pytest
```

### Problema: "ModuleNotFoundError: No module named 'app'"

**Síntomas:**
- Tests fallan al importar
- PYTHONPATH incorrecto

**Causa:**
- Directorio incorrecto
- Imports mal configurados

**Solución:**

```bash
# Asegurarse de estar en hospital_backend
cd hospital_backend

# Run tests desde ahí
pytest tests/

# O configurar en pytest.ini
cat pytest.ini
# Debe contener:
# [pytest]
# testpaths = tests
# pythonpath = .
```

### Problema: "Test falló pero no entiendo por qué"

**Síntomas:**
- AssertionError sin mensaje claro
- Debuging difícil

**Solución:**

```bash
# Ejecutar con-v (verbose)
pytest -v

# Más verboso
pytest -vv

# Con print statements
pytest -s

# Debugger
pytest --pdb

# Coverage
pytest --cov=hospital_backend
pytest --cov=hospital_backend --cov-report=html
# Abre htmlcov/index.html en browser
```

---

## 🖥️ Frontend (React)

### Problema: "npm install error"

**Síntomas:**
- Instalación falla
- Conflictos de dependencias

**Causa:**
- Node modules corrompidas
- Versión de Node incompatible

**Solución:**

```bash
cd hospital-frontend

# Opción 1: Clean install
rm -rf node_modules package-lock.json
npm install

# Opción 2: Limpiar cache
npm cache clean --force
npm install

# Verificar versión de Node
node --version  # Debe ser 16+
npm --version   # Debe ser 7+

# Actualizar Node si necesario
# npm i -g npm@latest
```

### Problema: "Component not rendering / Blank page"

**Síntomas:**
- App.jsx compile pero no muestra nada
- Console errors

**Causa:**
- Error de React
- Component error boundary
- CSS no cargado

**Solución:**

```javascript
// 1. Verificar console para errores
F12 → Console

// 2. Verificar App.jsx
// Debe haber un return JSX, no undefined
if (!user) return null;  // ❌ Mejor usar loading state
if (!user) return <Loading />;  // ✅ Better

// 3. Verificar CSS
// Si usa CSS Modules o Tailwind, verificar imports
// App.css debe estar en App.jsx
import './App.css'

// 4. Network tab
// F12 → Network
// Verificar que HTML/JS se cargan correctamente

// 5. Clear cache
Ctrl + Shift + R (Full refresh)
```

### Problema: "Hot reload no funciona"

**Síntomas:**
- Cambios en código no se reflejan
- Debe reiniciar servidor manualmente

**Causa:**
- Vite dev server parado
- Puerto incorrecto

**Solución:**

```bash
cd hospital-frontend

# Iniciar dev server
npm run dev

# Output debería mostrar:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# Si problema persiste:
rm -rf node_modules .vite
npm install
npm run dev
```

---

## 📊 Performance & Resources

### Problema: "La app está lenta"

**Síntomas:**
- Respuestas lentas
- CPU alto
- Memory leak

**Causa:**
- Queries lentas
- Requests sin cache
- Loop infinito

**Solución:**

```python
# Backend - Profile
from flask import Flask
from werkzeug.middleware.profiler import ProfilerMiddleware

if __name__ == '__main__':
    app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=[30])
    app.run(debug=True)

# Ejecutar y ver output de profile

# Caché
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/medicos')
@cache.cached(timeout=300)
def obtener_medicos():
    ...
```

```javascript
// Frontend - Monitor performance
console.time('list-pacientes');
fetch(API_ENDPOINTS.PACIENTES)
    .then(r => r.json())
    .then(data => {
        console.timeEnd('list-pacientes');
        console.log('Data:', data);
    });

// Ver cuánto tarda
// Debería ser <200ms
```

### Problema: "Out of memory" o app crash

**Síntomas:**
- Server se detiene sin error
- Memory usage muy alto

**Causa:**
- Memory leak
- Too many connections
- Large request

**Solución:**

```bash
# Monitor memory
ps aux | grep python
# Mirar columna RSS (memoria real usada)

# Si muy alta, buscar leaks
# En app.py, agregar:
import tracemalloc
tracemalloc.start()

# ... ejecutar código ...

current, peak = tracemalloc.get_traced_memory()
print(f"Current: {current}; Peak: {peak}")

# Limitar conexiones
# En config.py
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_size': 10,
    'pool_recycle': 3600,
}
```

---

## 🔐 Seguridad & Errores Raros

### Problema: "SQL Injection o error extraño"

**Síntomas:**
- Query error inesperado
- SQL malformado

**Causa:**
- Input no sanitizado
- Concatenación en query

**Solución:**

```python
# ❌ Malo - SQL Injection
dni = request.json.get('dni')
query = f"SELECT * FROM pacientes WHERE dni = '{dni}'"

# ✅ Bien - Prepared statement
from sqlalchemy import text
query = text("SELECT * FROM pacientes WHERE dni = :dni")
result = db.session.execute(query, {"dni": dni})
```

### Problema: "X-Frame-Options header falta"

**Síntomas:**
- Security scanner detecta problema
- Posible clickjacking

**Solución:**
- Ver SECURITY.md
- Verificar que app.py tiene security headers decorator

---

## 📞 Pedir Ayuda

Si el problema persiste después de intentar estas soluciones:

1. **Recopilar información:**
   ```bash
   # Versiones
   python --version
   pip list | grep -E "flask|flask-jwt|marshmallow"
   npm --version
   node --version
   
   # Logs
   python app.py 2>&1 | head -50
   npm run dev 2>&1 | head -50
   
   # Error stack trace completo
   ```

2. **Reportar en GitHub Issues:**
   - Título: Descripción breve
   - Descripción: Ambiente (OS, versiones), pasos para reproducir, error completo
   - Etiquetas: bug, help wanted

3. **Email a dev@hospital.local:**
   - Adjuntar logs y steps

---

## 🎓 Recursos de Ayuda

- [Flask Debugging](https://flask.palletsprojects.com/en/2.3.x/debugging/)
- [React Developer Tools](https://react-devtools-tutorial.vercel.app/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Network DevTools Guide](https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor)

---

**Última actualización:** 2025-01-15
**Contribuye reportando problemas nuevos:** [GitHub Issues](https://github.com)
