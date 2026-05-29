# ⚡ Quick Start - Hospital Management System

Comienza en **2 minutos** con estos pasos.

## 📦 Instalación (2 minutos)

```bash
# 1. Clonar (30 segundos)
git clone https://github.com/tu-repo/proyecto_hospital.git
cd proyecto_hospital

# 2. Backend (45 segundos)
cd hospital_backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python preparar_db_py
python app.py
# ✅ Backend corre en http://127.0.0.1:5000

# 3. Frontend (45 segundos, en otra terminal)
cd hospital-frontend
npm install
npm run dev
# ✅ Frontend corre en http://localhost:5173
```

## 🔓 Login por Defecto

```
Usuario: admin
Contraseña: admin123
```

⚠️ **Cambiar en producción**

## 📡 Primeros pasos

### Backend está corriendo si ves:
```
Running on http://127.0.0.1:5000
WARNING: This is a development server...
```

### Frontend está corriendo si ves:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Test rápido
```bash
# En terminal
curl http://127.0.0.1:5000/api/pacientes -H "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:5000/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"admin123\"}' | grep -o '\"access_token\":\"[^\"]*' | cut -d'\"' -f4)"
```

## 💻 Comandos Útiles

```bash
# Backend
cd hospital_backend

# Correr servidor
python app.py

# Tests
pytest

# Tests con cobertura
pytest --cov

# Linting
black .
flake8 .

# Frontend
cd hospital-frontend

# Dev server
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Lint fixes
npm run lint -- --fix
```

## 📚 ¿Necesitas Ayuda?

| Pregunta | Documentación |
|----------|--------------|
| ¿Dónde instalo? | [SETUP.md](SETUP.md) |
| ¿Tengo un error? | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| ¿Cómo contribuyo? | [CONTRIBUTING.md](CONTRIBUTING.md) |
| ¿Cómo lanzo a producción? | [PRODUCTION.md](PRODUCTION.md) |
| ¿Dónde veo los endpoints? | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |
| ¿Algo de seguridad? | [SECURITY.md](SECURITY.md) |
| **Ver todo** | [DOCUMENTATION.md](DOCUMENTATION.md) |

## 📱 Endpoints Principales

### Auth
- `POST /auth/login` → JWT token
- `POST /auth/logout` → Clear session

### CRUD
- `GET /api/pacientes` → Listar
- `POST /api/pacientes` → Crear (JWT required)
- `PUT /api/pacientes/:id` → Actualizar (JWT required)
- `DELETE /api/pacientes/:id` → Eliminar (JWT required)

*(Mismo patrón para `/medicos` y `/turnos`)*

## 🔐 Estructura de Seguridad

✅ JWT authentication
✅ Bcrypt password hashing  
✅ Input validation (Marshmallow)
✅ SQL injection prevention (prepared statements)
✅ CORS restriction
✅ Security headers
✅ 50+ tests

## 🚀 Próximo Paso

Una vez que todo funcione:

1. Cambia las credenciales en `hospital_backend/auth_bp.py`
2. Lee [SECURITY.md](SECURITY.md)
3. Revisa [CONTRIBUTING.md](CONTRIBUTING.md) si quieres aportar
4. Lee [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para entender endpoints

---

**¿Problemas?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**¿Documentación completa?** → [DOCUMENTATION.md](DOCUMENTATION.md)
