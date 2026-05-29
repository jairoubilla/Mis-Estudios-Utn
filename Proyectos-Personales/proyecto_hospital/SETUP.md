# Setup Proyecto Hospital

## Requisitos Previos
- Python 3.8+
- Node.js 16+
- Git

## Configuración Backend

### 1. Instalar dependencias
```bash
cd hospital_backend
pip install -r requirements.txt
```

### 2. Configurar variables de entorno
```bash
cp ../.env.example ../.env
# Editar ../.env y configurar valores seguros para producción
```

### 3. Preparar la base de datos
```bash
python preparar_db_py
```

### 4. Iniciar el servidor
```bash
python app.py
```
El servidor estará disponible en `http://127.0.0.1:5000`

---

## Configuración Frontend

### 1. Instalar dependencias
```bash
cd hospital-frontend
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# El valor por defecto es http://127.0.0.1:5000
# Para producción, cambiar a tu URL de API
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### 4. Construir para producción
```bash
npm run build
```

---

## Credenciales por Defecto

**Admin:**
- Usuario: `admin`
- Contraseña: `admin123`

⚠️ **IMPORTANTE**: Cambiar en producción en el archivo `hospital_backend/auth_bp.py`

---

## Estructura del Proyecto

```
proyecto_hospital/
├── hospital_backend/          # Flask API
│   ├── app.py                 # Aplicación principal
│   ├── auth_bp.py             # Autenticación JWT
│   ├── config.py              # Configuración
│   ├── database.py            # Conexión a BD
│   ├── schemas.py             # Validaciones Marshmallow
│   ├── preparar_db_py         # Script de inicialización BD
│   ├── requirements.txt        # Dependencias Python
│   ├── routes/                # Endpoints por entidad
│   │   ├── routes_pacientes.py
│   │   ├── routes_medicos.py
│   │   └── routes_turnos.py
│   ├── services/              # Lógica de negocio
│   │   └── paciente_service.py
│   └── utils/                 # Utilidades
│       └── validators.py      # Funciones de validación
│
├── hospital-frontend/         # React + Vite
│   ├── src/
│   │   ├── App.jsx            # Componente principal
│   │   ├── components/        # Componentes reutilizables
│   │   ├── hooks/             # Custom hooks
│   │   ├── config/            # Configuración
│   │   │   └── api.config.js  # URLs de API centralizadas
│   │   ├── constants.js       # Constantes (idiomas, códigos país)
│   │   └── styles.js          # Estilos centralizados
│   ├── package.json
│   ├── vite.config.js
│   └── .env                   # Variables de entorno
│
├── .env                       # Variables de entorno backend
├── .env.example               # Plantilla de variables
└── .gitignore                 # Archivos a ignorar en Git

```

---

## Dependencias Principales

### Backend
- Flask 3.1.3: Framework web
- Flask-JWT-Extended 4.7.1: Autenticación con JWT
- Flask-CORS 6.0.2: CORS para frontend
- Marshmallow 4.2.2: Validación de datos
- bcrypt 5.0.0: Hash de contraseñas
- python-dotenv 1.2.2: Gestión de variables de entorno

### Frontend
- React 19.2.0: Framework UI
- Vite 7.2.4: Build tool
- Axios 1.13.2: Cliente HTTP
- ESLint 9.39.1: Linting

---

## Troubleshooting

### Backend no inicia
```
ValueError: SECRET_KEY no configurada
```
**Solución:** Verificar que `.env` existe en el directorio raíz del proyecto con `SECRET_KEY` configurada.

### CORS error en frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solución:** Verificar que `VITE_API_URL` en `.env` del frontend coincide con la URL del backend.

### Base de datos no se crea
**Solución:** Ejecutar manualmente:
```bash
cd hospital_backend
python preparar_db_py
```

---

## Desarrollo y Testing

### Ejecutar tests (cuando estén disponibles)
```bash
python -m pytest hospital_backend/
```

### Linting frontend
```bash
cd hospital-frontend
npm run lint
```

---

## Despliegue en Producción

### Backend
1. Configurar variables de entorno seguras
2. Cambiar credenciales admin
3. Considerar cambiar de SQLite a PostgreSQL
4. Usar Gunicorn o similar WSGI server
5. Configurar HTTPS

### Frontend
1. Build: `npm run build`
2. Servir contenido de `dist/` con servidor web estático
3. Configurar variables de entorno para API de producción

---

## Contribuciones

Seguir estas convenciones:
- Crear branch para cada feature: `git checkout -b feature/mi-feature`
- Commits descriptivos: `git commit -m "docs: agregar guía de setup"`
- Push y crear PR

---

## Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.
