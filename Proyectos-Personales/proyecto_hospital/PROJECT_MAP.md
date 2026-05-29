# 📊 Project Map - Proyecto Hospital

Mapa visual completo del proyecto, documentación y cómo todo se conecta.

## 🗺️ Estructura de Carpetas

```
proyecto_hospital/
│
├── 📘 DOCUMENTACIÓN (Este archivo)
│   ├────────────────────────────────────────────────────────
│   │
│   ├── 📖 README.md
│   │   ├─ Visión general
│   │   ├─ Feature highlights
│   │   └─ Links a documentos
│   │
│   ├── ⚡ QUICKSTART.md  (NUEVO)
│   │   ├─ 2 min setup
│   │   ├─ Login por defecto
│   │   └─ Primeros pasos
│   │
│   ├── 🎓 EXECUTIVE_SUMMARY.md  (NUEVO)
│   │   ├─ Para stakeholders
│   │   ├─ ROI & costos
│   │   └─ Score de madurez
│   │
│   ├── 📚 DOCUMENTATION.md  (NUEVO)
│   │   ├─ Índice completo
│   │   ├─ Rutas de aprendizaje
│   │   └─ By role navigation
│   │
│   └── 🗺️ PROJECT_MAP.md  (Este archivo)
│       ├─ Estructura visual
│       ├─ Conexiones
│       └─ Guía de navegación
│
├── 🚀 GETTING STARTED
│   ├────────────────────────────────────────────────────────
│   ├── 📋 SETUP.md
│   │   ├─ Instalación paso a paso
│   │   ├─ Configuración variables
│   │   └─ Troubleshooting
│   │
│   ├── 🐛 TROUBLESHOOTING.md
│   │   ├─ 20+ problemas comunes
│   │   ├─ Debugging tips
│   │   └─ Performance issues
│   │
│   └── 🧪 TESTING.md (en hospital_backend/)
│       ├─ Cómo ejecutar tests
│       ├─ Fixtures
│       └─ Coverage goals
│
├── 💼 DESARROLLO
│   ├────────────────────────────────────────────────────────
│   ├── 🤝 CONTRIBUTING.md
│   │   ├─ Estándares código
│   │   ├─ Proceso PR
│   │   └─ Commits
│   │
│   ├── 📖 API_DOCUMENTATION.md
│   │   ├─ 13+ endpoints
│   │   ├─ Request/Response
│   │   └─ Ejemplos
│   │
│   ├── 🗺️ ROADMAP.md
│   │   ├─ 10 fases 2025-2026
│   │   ├─ Timeline estimados
│   │   └─ Contribución abierta
│   │
│   └── 📋 CODE_OF_CONDUCT.md
│       ├─ Valores comunitarios
│       ├─ Reporte de conducta
│       └─ Inclusión
│
├── 🔐 SEGURIDAD & PRODUCCIÓN
│   ├────────────────────────────────────────────────────────
│   ├── 🛡️ SECURITY.md
│   │   ├─ Riesgos identificados
│   │   ├─ Mitigaciones
│   │   └─ Checklist producción
│   │
│   ├── 🚀 PRODUCTION.md
│   │   ├─ Deploy checklist (50+ items)
│   │   ├─ Docker setup
│   │   ├─ AWS deployment
│   │   ├─ Nginx config
│   │   ├─ Monitoring (Prometheus)
│   │   └─ Backups 3-2-1
│   │
│   └── 📝 CHANGELOG.md
│       ├─ v1.0.0 features
│       ├─ Roadmap v1.1+
│       └─ Breaking changes
│
├── 🏥 BACKEND (hospital_backend/)
│   ├────────────────────────────────────────────────────────
│   │
│   ├── 🔐 auth_bp.py
│   │   ├─ POST /auth/login
│   │   ├─ POST /auth/logout
│   │   └─ JWT token generation
│   │
│   ├── ⚙️ config.py
│   │   ├─ SECRET_KEY (from env)
│   │   ├─ JWT config
│   │   ├─ Database URI
│   │   └─ CORS origins
│   │
│   ├── 🔌 app.py
│   │   ├─ Flask initialization
│   │   ├─ Security headers
│   │   ├─ Blueprint registration
│   │   └─ Error handlers
│   │
│   ├── 💾 database.py
│   │   ├─ BD connection
│   │   └─ Query utilities
│   │
│   ├── 📋 schemas.py
│   │   ├─ PacienteSchema
│   │   ├─ MedicoSchema
│   │   └─ TurnoSchema
│   │
│   ├── 🛢️ preparar_db_py
│   │   ├─ Create tables
│   │   ├─ Create indexes (7)
│   │   └─ Foreign keys
│   │
│   ├── 📁 routes/
│   │   ├─ routes_pacientes.py (4 endpoints)
│   │   ├─ routes_medicos.py (4 endpoints)
│   │   └─ routes_turnos.py (4 endpoints + FKs)
│   │
│   ├── 💼 services/
│   │   ├─ paciente_service.py
│   │   └─ [otros servicios]
│   │
│   ├── 🔧 utils/
│   │   ├─ validators.py (6 functions)
│   │   │   ├─ validar_dni_argentino
│   │   │   ├─ validar_telefono
│   │   │   ├─ validar_especialidad
│   │   │   ├─ validar_email
│   │   │   ├─ validar_fecha_futura
│   │   │   └─ validar_horario_laboral
│   │   └─ [otros utilidades]
│   │
│   ├── 🧪 tests/
│   │   ├─ test_validators.py (15+ tests)
│   │   ├─ test_schemas.py (20+ tests)
│   │   ├─ test_routes.py (15+ tests)
│   │   ├─ conftest.py (6+ fixtures)
│   │   └─ __init__.py
│   │
│   ├── 📦 requirements.txt
│   │   ├─ Flask 3.0.0
│   │   ├─ Flask-JWT-Extended 4.5.0
│   │   ├─ Marshmallow 4.2.2
│   │   ├─ Bcrypt 5.0.0
│   │   ├─ python-dotenv 1.0.0
│   │   └─ pytest 7.0.0+
│   │
│   ├── pytest.ini
│   │   └─ Test configuration
│   │
│   └── .env.example (template)
│       ├─ SECRET_KEY
│       ├─ JWT_SECRET_KEY
│       ├─ DATABASE_URI
│       └─ CORS_ORIGINS
│
├── 🌐 FRONTEND (hospital-frontend/)
│   ├────────────────────────────────────────────────────────
│   │
│   ├── src/
│   │   │
│   │   ├── 🎨 App.jsx
│   │   │   ├─ Main app component
│   │   │   ├─ JWT interceptors
│   │   │   ├─ Authentication logic
│   │   │   └─ Route state
│   │   │
│   │   ├── ⚙️ config/
│   │   │   └─ api.config.js
│   │   │       ├─ API_ENDPOINTS constants
│   │   │       ├─ BASE_URL
│   │   │       └─ Helper functions
│   │   │
│   │   ├── 🔌 hooks/
│   │   │   └─ useData.js
│   │   │       ├─ Fetch pacientes
│   │   │       ├─ Fetch medicos
│   │   │       └─ Fetch turnos
│   │   │
│   │   ├── 🧩 components/
│   │   │   ├─ index.js
│   │   │   ├─ SplashScreen.jsx
│   │   │   ├─ LanguageSelector.jsx
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   ├─ LoginForm.jsx
│   │   │   │   ├─ RegisterForm.jsx
│   │   │   │   └─ AdminLogin.jsx (API-based)
│   │   │   │
│   │   │   ├── Admin/
│   │   │   │   ├─ AdminNav.jsx
│   │   │   │   └─ StatsCards.jsx
│   │   │   │
│   │   │   └── Tables/
│   │   │       └─ TurnosTable.jsx
│   │   │
│   │   ├── 🎨 styles/
│   │   │   └─ styles.js (CSS-in-JS)
│   │   │
│   │   ├── 📁 assets/
│   │   │   └─ [Images, icons, etc]
│   │   │
│   │   ├── index.css
│   │   ├── main.jsx (Entry point)
│   │   └── constants.js
│   │
│   ├── 📦 package.json
│   │   ├─ React 19.2.0
│   │   ├─ Vite 7.2.4
│   │   ├─ Axios 1.7.4
│   │   ├─ ESLint 9.39.1
│   │   └─ v1.0.0 (version)
│   │
│   ├── vite.config.js
│   │   └─ Vite configuration
│   │
│   ├── eslint.config.js
│   │   └─ Linting rules
│   │
│   ├── index.html
│   │   └─ Entry HTML (SPA)
│   │
│   ├── .env
│   │   └─ VITE_API_URL
│   │
│   └── .env.example (template)
│       └─ VITE_API_URL=http://127.0.0.1:5000
│
├── 🔧 ROOT CONFIG FILES
│   │
│   ├── .env (actual, .gitignore)
│   │   ├─ SECRET_KEY
│   │   ├─ JWT_SECRET_KEY
│   │   ├─ DATABASE_URI
│   │   └─ CORS_ORIGINS
│   │
│   ├── .env.example (template)
│   │   └─ Production guidance
│   │
│   ├── .gitignore (comprehensive)
│   │   ├─ .env*, venv, __pycache__
│   │   ├─ node_modules, dist
│   │   ├─ logs, IDE settings
│   │   └─ Secrets & keys
│   │
│   └── .env.local (optional, .gitignore)
│       └─ Local overrides
│
└── 📚 METADATA
    └────────────────────────────────────────────────────────
    ├── LICENSE (MIT)
    └── [Other metadata]
```

---

## 🔗 Conexiones Clave

### Backend ↔ Frontend

```
Frontend (React)
    ↓
axios interceptor
    ↓
+ Authorization: Bearer {token}
    ↓
Backend (Flask)
    ↓
@jwt_required()
    ↓
Valida JWT
    ↓
Marshmallow schema validation
    ↓
Database query + security
    ↓
Response JSON
    ↓
Frontend processes
```

### Autenticación Flow

```
1. AdminLogin.jsx
   ↓
2. POST /auth/login (API_ENDPOINTS.LOGIN)
   ↓
3. auth_bp.py:login()
   ├─ Bcrypt password verification
   └─ JWT token creation
   ↓
4. Response {access_token}
   ↓
5. localStorage.setItem('token', token)
   ↓
6. axios interceptor
   ├─ Todos los requests incluyen token
   └─ 401 response auto-logout
```

### Validación Multicapa

```
Form Input (Frontend)
    ↓
+ Client-side validation
  (tipo, formato básico)
    ↓
+ axios send to API_ENDPOINTS
    ↓
Backend receives
    ↓
+ Marshmallow schema validation
  (length, format, whitelist)
    ↓
+ Custom validators (validators.py)
  (DNI, especialidad, fecha)
    ↓
+ Database constraints
  (UNIQUE, FOREIGN KEY)
    ↓
Almacenado seguro
```

### Seguridad Headers Flow

```
app.py startup
    ↓
@app.after_request decorator
    ↓
Add headers:
├─ X-Frame-Options: DENY
├─ X-Content-Type-Options: nosniff
├─ X-XSS-Protection: 1
├─ Content-Security-Policy
└─ Referrer-Policy
    ↓
Response sent to browser
    ↓
Browser enforces security
```

---

## 📊 Matriz de Documentos

### Por Rol

| Developer | DevOps | PM | Security | Contributor |
|-----------|--------|----|-----------|----|
| README | README | EXECUTIVE | SECURITY | CONTRIBUTING |
| QUICKSTART | SETUP | ROADMAP | PRODUCTION | CODE_OF_CONDUCT |
| setup | PRODUCTION | EXECUTIVE | SECURITY | TESTING |
| API_DOCUMENTATION | TROUBLESHOOTING | ROADMAP | TROUBLESHOOTING | API_DOCUMENTATION |
| TESTING | DOCUMENTATION | DOCUMENTATION | DOCUMENTATION | DOCUMENTATION |
| TROUBLESHOOTING | ROADMAP | README | ROADMAP | TESTING |
| ROADMAP | SECURITY | - | - | - |

### Por Fase

| Discovery | Setup | Development | Testing | Production | Maintenance |
|-----------|-------|-------------|---------|-----------|-------------|
| README | SETUP | CONTRIBUTING | TESTING | PRODUCTION | TROUBLESHOOTING |
| EXECUTIVE | QUICKSTART | API_DOCS | TESTING | SECURITY | DOCUMENTATION |
| DOCUMENTATION | DOCUMENTATION | ROADMAP | TROUBLESHOOTING | PRODUCTION | CHANGELOG |
| - | - | DOCUMENTING | - | MONITORING | ROADMAP |

---

## 🎯 Flujos de Usuario Típicos

### 1. Developer Nuevo (1-2 horas)
```
README.md (5 min)
    ↓
QUICKSTART.md (2 min)
    ↓
SETUP.md (15 min)
    ↓
Run locally (15 min)
    ↓
CONTRIBUTING.md (15 min)
    ↓
API_DOCUMENTATION.md (20 min)
    ↓
Ready to code!
```

### 2. DevOps Engineer (3-4 horas)
```
SETUP.md (15 min)
    ↓
SECURITY.md (30 min)
    ↓
PRODUCTION.md - Docker (30 min)
    ↓
PRODUCTION.md - AWS (30 min)
    ↓
PRODUCTION.md - Nginx (20 min)
    ↓
PRODUCTION.md - Monitoring (30 min)
    ↓
Ready to deploy!
```

### 3. Executive Decision (30 min)
```
README.md (10 min)
    ↓
EXECUTIVE_SUMMARY.md (15 min)
    ↓
ROADMAP.md (5 min)
    ↓
Decision made!
```

---

## 🔄 Actualizaciones de Documentación

```
Code changes
    ↓
CHANGELOG.md (actualizar features)
    ↓
API_DOCUMENTATION.md (si endpoint cambió)
    ↓
ROADMAP.md o PRODUCTION.md (si aplicable)
    ↓
Update version in code + docs
    ↓
Merge to main
```

---

## 📱 Quick Links por Necesidad

| Necesidad | Acción | Documento |
|-----------|--------|-----------|
| "Necesito instalar" | Seguir pasos | [SETUP.md](SETUP.md) |
| "Tengo un error" | Buscar síntoma | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| "Quiero contribuir" | Leer proceso | [CONTRIBUTING.md](CONTRIBUTING.md) |
| "Necesito endpoint X" | Buscar en tabla | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |
| "Debo lanzar a prod" | Checklist | [PRODUCTION.md](PRODUCTION.md) |
| "¿Es seguro?" | Revisar | [SECURITY.md](SECURITY.md) |
| "¿Cuál es el plan?" | Ver fases | [ROADMAP.md](ROADMAP.md) |
| "Resumen ejecutivo" | Leer 5 min | [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) |
| "2 min setup" | Quick start | [QUICKSTART.md](QUICKSTART.md) |
| "Todo índice" | Todas las guías | [DOCUMENTATION.md](DOCUMENTATION.md) |

---

## 🏗️ Capas del Proyecto

```
┌─────────────────────────────────────┐
│        PRESENTATION LAYER          │
│ React Components + JSX + CSS        │
│ (hospital-frontend/src/components) │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       API INTEGRATION LAYER         │
│ Axios interceptors + API config     │
│ (hospital-frontend/src/hooks)      │
└────────────────┬────────────────────┘
                 │ HTTPS/JWT
┌────────────────▼────────────────────┐
│     API ENDPOINT LAYER / ROUTES     │
│ Flask routes + blueprints          │
│ (hospital_backend/routes/)         │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    VALIDATION & SECURITY LAYER      │
│ Marshmallow + custom validators    │
│ (hospital_backend/schemas.py +)    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    BUSINESS LOGIC LAYER / SERVICES  │
│ paciente_service.py, etc.         │
│ (hospital_backend/services/)       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│     DATA ACCESS LAYER / DATABASE    │
│ SQLAlchemy queries + indexes        │
│ (hospital_backend/database.py)     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      PERSISTENCE LAYER / DB         │
│ SQLite (dev) / PostgreSQL (prod)   │
│ (hospital.db / RDS)                │
└─────────────────────────────────────┘
```

---

**Última actualización:** 2025-01-15  
**Documentación versión:** 1.0.0  
**Siguiente revisión:** 2025-02-15
