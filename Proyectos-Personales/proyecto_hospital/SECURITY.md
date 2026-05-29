# SEGURIDAD - Guía Completa

## 🔐 Estado de Seguridad del Proyecto

### Implementaciones Actuales

#### ✅ Autenticación
- **JWT (JSON Web Tokens):** Autenticación basada en tokens, no en sesiones
- **Bcrypt Hashing:** Contraseñas hasheadas con bcrypt (min. 12 rondas)
- **Token Expiration:** Expiración configurable de tokens
- **CORS Restringido:** Validación de orígenes permitidos

#### ✅ Validación de Entrada
- **Marshmallow Schemas:** Validación estricta de tipos de datos
- **Validadores Personalizados:**
  - DNI argentino (7-8 dígitos)
  - Teléfono (mínimo 10 dígitos)
  - Correo electrónico (formato RFC 5322)
  - Especialidad (whitelist)
  - Fecha futura (solo turnos futuros)
  - Rango horario (08:00-20:00)

#### ✅ Protección de Base de Datos
- **Prepared Statements:** Todas las queries usan placeholders
- **Integridad Referencial:** Foreign keys configuradas
- **Índices de Performance:** Índices en campos críticos
- **Validación FK:** Verificación de existencia antes de crear registros

#### ✅ Gestión de Variables de Entorno
- **python-dotenv:** Carga de variables desde .env
- **SECRET_KEY en .env:** No hardcodeada en código
- **Ejemplo .env.example:** Plantilla sin secretos

#### ✅ Protección de Errores
- **Error Messages Genéricos:** No exponen detalles técnicos
- **HTTP Status Codes:** Respuestas RFC 7231 compliant
- **Logging de Seguridad:** auth.log registra intentos fallidos

#### ✅ Testing
- **Unit Tests:** Cobertura de validadores y schemas
- **Integration Tests:** Verificación de endpoints
- **Security Tests:** Validación de autenticación

---

## ⚠️ Riesgos Identificados y Mitigaciones

| Riesgo | Severidad | Mitigación | Estado |
|--------|-----------|-----------|---------|
| Inyección SQL | 🔴 CRÍTICA | Prepared statements | ✅ |
| Autenticación débil | 🔴 CRÍTICA | JWT + Bcrypt | ✅ |
| Validación insuficiente | 🟠 ALTA | Marshmallow + Validadores | ✅ |
| CORS mal configurado | 🟠 ALTA | Whitelist de orígenes | ⚠️ |
| Exposición de secretos | 🟠 ALTA | Variables de entorno | ✅ |
| Fuerza bruta | 🟡 MEDIA | Rate limiting | ❌ |
| XSS (Frontend) | 🟡 MEDIA | Sanitización recomendada | ⚠️ |
| CSRF | 🟡 MEDIA | SameSite cookies | ⚠️ |

---

## 🛡️ Checklist de Seguridad para Producción

### Backend - Crítico
- [ ] Cambiar `admin123` a contraseña fuerte en `auth_bp.py`
- [ ] Generar nuevos valores para `SECRET_KEY` en `.env`
- [ ] Habilitar HTTPS (forzar con redirect 301)
- [ ] Configurar CORS para dominio específico (no `*`)
- [ ] Activar rate limiting (flask-limiter)
- [ ] Configurar HTTPS headers de seguridad
- [ ] Usar PostgreSQL en lugar de SQLite
- [ ] Revisar logs regularmente
- [ ] Implementar certificado SSL/TLS válido

### Frontend - Crítico
- [ ] Usar HTTPS para todas las conexiones
- [ ] Implementar CSP (Content-Security-Policy)
- [ ] Validar y sanitizar entrada del usuario
- [ ] Proteger contra XSS (React escapea por defecto)
- [ ] Usar `httpOnly` cookies para tokens (si aplica)

### General
- [ ] Revisar dependencias regularmente con `npm audit` y `pip audit`
- [ ] Implementar WAF (Web Application Firewall)
- [ ] Configurar monitoreo y alertas
- [ ] Backup automático de base de datos
- [ ] Plan de incidentes de seguridad
- [ ] Auditoría de código regularmente

---

## 📋 Mejores Prácticas Adoptadas

### Validación en Múltiples Capas
1. **Frontend:** Validación básica (UX)
2. **Backend:** Validación estricta (seguridad)
3. **Base de datos:** Constraints y tipos

### Principio del Menor Privilegio
- Endpoints sensibles requieren JWT
- No hay credenciales en código
- Roles de usuario (futuro)

### Defensa en Profundidad
- Validadores múltiples
- Prepared statements
- Foreign keys habilitadas
- Logging de acceso

### Confidencialidad
- Contraseñas hasheadas
- Tokens con expiración
- Variables de entorno

### Integridad
- Validación de tipos
- Campos digitales
- Auditoría de cambios (futura)

### Disponibilidad
- Índices optimizados
- Validación antes de operaciones
- Error handling graceful

---

## 🔒 Configuración de Headers de Seguridad

Recomendados para producción en `app.py`:

```python
@app.after_request
def set_security_headers(response):
    # Previene clickjacking
    response.headers['X-Frame-Options'] = 'DENY'
    
    # Previene MIME-sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    # Habilita XSS protection en navegadores antiguos
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # HSTS (force HTTPS)
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    # CSP básica
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    
    return response
```

---

## 🔑 Gestión de Secrets

### ✅ Correcto
```bash
# .env
SECRET_KEY=mi_clave_aleatoria_super_segura_32_caracteres
JWT_SECRET_KEY=otra_clave_jwt_diferente_32_caracteres
```

### ❌ INCORRECTO (NUNCA)
```python
# En código directamente
SECRET_KEY = "mi_clave"  # NO HACER ESTO
DB_PASSWORD = "admin123"  # NO HACER ESTO
```

### Generación de Claves Seguras
```bash
# Linux/Mac
python -c "import secrets; print(secrets.token_hex(32))"

# O con openssl
openssl rand -hex 32
```

---

## 📝 Auditoría y Logging

### Eventos que se registran
- ✅ Intentos de login (exitosos y fallidos)
- ✅ Errores de validación
- ⚠️ Cambios en datos sensibles (no implementado aún)
- ⚠️ Acceso a funciones administrativas (no implementado aún)

### Archivo de Logs
```
hospital_backend/auth.log
```

### Ver logs de seguridad
```bash
tail -f hospital_backend/auth.log
grep -i "intento" hospital_backend/auth.log
```

---

## 🧪 Testing de Seguridad

### Ejecutar tests de seguridad
```bash
cd hospital_backend
pytest -m security -v
```

### Verificar validaciones
```bash
pytest test_validators.py -v
pytest test_schemas.py -v
```

### Cobertura de seguridad
```bash
pytest --cov=. --cov-report=html
# Abrir htmlcov/index.html en navegador
```

---

## 🚨 Respuesta a Incidentes

### Si descubres una vulnerabilidad
1. **NO la hagas pública** en redes o foros
2. Reporta internamente al equipo de desarrollo
3. Proporciona detalles:
   - Tipo de vulnerabilidad
   - Pasos para reproducirla
   - Posible impacto
   - Sugerencia de mitigación

### Plan de Contingencia
- Cambiar `SECRET_KEY` en `.env`
- Revocar todos los tokens activos (logout forzado)
- Revisar logs de acceso
- Patch de la vulnerabilidad
- Testing completo antes de deploy

---

## 📚 Referencias de Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Flask Security](https://flask.palletsprojects.com/en/2.3.x/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## 🔄 Actualizaciones de Seguridad

Revisar regularmente:
- Vulnerabilidades en dependencias
- Parches de Python y Node.js
- Cambios en OWASP Top 10
- Reportes de seguridad de librerías usadas

```bash
# Revisar dependencias vulnerables
pip audit
npm audit
```

---

**Última actualización:** 16 de marzo de 2026

**Responsable de seguridad:** Especialista en Ciberseguridad
