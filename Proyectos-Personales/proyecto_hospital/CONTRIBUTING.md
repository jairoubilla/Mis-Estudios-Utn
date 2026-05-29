# Contribuyendo al Proyecto Hospital

¡Gracias por tu interés en contribuir! Este documento proporciona las guías y directrices para contribuir al proyecto.

## 📋 Índice

- [Código de Conducta](#código-de-conducta)
- [Empezando](#empezando)
- [Desarrollo](#desarrollo)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Seguridad](#seguridad)

## 🤝 Código de Conducta

### Nuestro Compromiso

En el interés de fomentar un ambiente abierto y acogedor, nos comprometemos a:

- Ser respetuosos y constructivo
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- Acoso de cualquier tipo
- Lenguaje discriminatorio u ofensivo
- Ataques personales
- Publicación de información privada sin consentimiento

## 🎯 Empezando

### Requisitos Previos

- Python 3.8+
- Node.js 16+
- Git
- Conocimiento de Flask y React (básico)

### Fork y Clone

```bash
# 1. Fork en GitHub
# (Usa el botón "Fork" en la interfaz de GitHub)

# 2. Clone tu fork
git clone https://github.com/tu-usuario/proyecto_hospital.git
cd proyecto_hospital

# 3. Agrega el upstream remoto
git remote add upstream https://github.com/original-owner/proyecto_hospital.git
```

### Setup de Desarrollo

```bash
# Backend
cd hospital_backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
pip install -e ".[dev]"

# Frontend
cd ../hospital-frontend
npm install
```

## 🛠️ Desarrollo

### Ramas

- `main`: Rama de producción (protegida)
- `develop`: Rama de desarrollo (para PRs)
- `feature/*`: Para nuevas características
- `bugfix/*`: Para correcciones de bugs
- `docs/*`: Para actualizaciones de documentación

### Crear una Rama

```bash
# Actualizar develop
git fetch upstream
git checkout develop
git rebase upstream/develop

# Crear nueva rama
git checkout -b feature/tu-feature

# Hacer cambios y commit (ver sección Commits)
```

## 📝 Commits

### Formato de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org):

```
type(scope): descripción corta

Descripción más detallada (opcional).
Explicar por qué cambió, no qué cambió.

Closes #issue-number (si aplica)
```

### Tipos

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato (sin cambios lógicos)
- `refactor`: Refactorización
- `perf`: Mejora de performance
- `test`: Agregar o modificar tests
- `chore`: Cambios de configuración
- `security`: Cambios de seguridad

### Ejemplos

```bash
# Feature
git commit -m "feat(auth): agregar 2FA con TOTP"

# Fix
git commit -m "fix(turnos): corregir validación de horario laboral"

# Documentación
git commit -m "docs(API): actualizar endpoints de médicos"

# Security
git commit -m "security(jwt): aumentar tiempo de expiración token"
```

## 🔄 Pull Requests

### Antes de Hacer el PR

1. **Actualiza tu rama:**
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

2. **Ejecuta tests:**
   ```bash
   # Backend
   cd hospital_backend
   pytest --cov

   # Frontend
   cd ../hospital-frontend
   npm run lint
   ```

3. **Verifica cambios:**
   ```bash
   git diff upstream/develop
   ```

### Creando el PR

1. **Haz push a tu fork:**
   ```bash
   git push origin feature/tu-feature
   ```

2. **Abre un PR en GitHub:**
   - Usa el template de PR
   - Describe el cambio claramente
   - Referencia issues relacionados
   - Incluye screenshots si es UI

### Template de PR

```markdown
## Descripción
Descripción breve de los cambios

## Tipo de Cambio
- [ ] Bug fix (corrección sin cambios en API)
- [ ] Nueva feature (cambios sin breaking changes)
- [ ] Breaking change
- [ ] Actualización de documentación

## Cambios
- Cambio 1
- Cambio 2
- Cambio 3

## Testing
- [ ] He testeado estos cambios localmente
- [ ] Los tests pasan
- [ ] He agregado tests si es necesario

## Checklist de Seguridad
- [ ] No incluye credenciales o secrets
- [ ] Sigue las prácticas de seguridad OWASP
- [ ] Validaciones presentes
- [ ] No hay SQL injection posible

## Documentación
- [ ] He actualizado la documentación relevante
- [ ] Los comentarios en código son claros

## Conexión a Issues
Fixes #123
Closes #456
```

## 📐 Estándares de Código

### Python (Backend)

```python
# ✅ Bien
def validar_dni_argentino(dni: str) -> bool:
    """Verifica que el DNI sea válido."""
    if not dni.isdigit():
        return False
    return len(dni) in [7, 8]


# ❌ Malo
def validate_dni(d):
    if not d.isdigit(): return False
    return len(d) in [7,8]
```

### JavaScript/React (Frontend)

```javascript
// ✅ Bien
const handleLogin = async (credentials) => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ❌ Malo
const login = async (creds) => {
  const res = await fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    body: JSON.stringify(creds),
  });
  return res.json();
};
```

### Linting

```bash
# Backend
pip install flake8 black
black hospital_backend/

# Frontend
npm run lint -- --fix
```

## 🧪 Testing

### Backend

```bash
cd hospital_backend

# Todos los tests
pytest

# Con cobertura
pytest --cov --cov-report=html

# Específico
pytest tests/test_validators.py::TestValidadores::test_validar_dni_argentino_valido -v
```

### Frontend

```bash
cd hospital-frontend

# Tests (cuando estén disponibles)
npm test

# Linting
npm run lint
```

### Coverage

- **Backend:** Mínimo 80%
- **Frontend:** Mínimo 70% (pronto)

## 🔐 Seguridad

### Reportar Vulnerabilidades

**NO abras un PR público para vulnerabilidades de seguridad.**

1. Envía un email a: security@hospital.local
2. Incluye:
   - Descripción del problema
   - Pasos para reproducir
   - Impacto potencial
   - Solución sugerida (opcional)

3. Espera confirmación antes de divulgar

### Directrices de Seguridad

Al hacer cambios de seguridad:

- ✅ Agregua tests específicos de seguridad
- ✅ Documenta el riesgo mitigado
- ✅ Considera el impacto en performance
- ✅ Revisa [SECURITY.md](SECURITY.md)
- ✅ No hagas secrets públicos

Ejemplo:

```python
# security(auth): agregar rate limiting en login
@limiter.limit("5 per minute")
@auth_bp.route('/login', methods=['POST'])
def login():
    # Previene ataques de fuerza bruta
    ...
```

## 📚 Documentación

### Actualizar Documentación

```bash
# Estructura
- README.md: Visión general
- SETUP.md: Instalación
- API_DOCUMENTATION.md: Endpoints
- SECURITY.md: Seguridad
- TESTING.md: Tests
- CHANGELOG.md: Cambios

# Actualizar changelog
# Agrega entrada bajo "Unreleased" en CHANGELOG.md
```

### Escribiendo Docs

- Usa Markdown
- Incluye ejemplos de código
- Links internos: `[Archivo](Archivo.md)`
- Links externos: `[Texto](https://url.com)`

## 🚀 Release Process

Los maintainers usan este proceso:

1. Actualizar versión en `package.json` y backend
2. Actualizar `CHANGELOG.md`
3. Crear tag de versión: `v1.0.0`
4. Build y deploy

## 📞 Preguntas?

- 📧 Email: dev@hospital.local
- 💬 Discussions: [GitHub Discussions](https://github.com)
- 📋 Issues: [GitHub Issues](https://github.com)

---

¡Gracias por contribuir! 🎉
