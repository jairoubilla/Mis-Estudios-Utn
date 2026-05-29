# API Hospital - Documentación

## Autenticación

### POST /auth/login
Obtiene un token JWT para acceder a rutas protegidas.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (401):**
```json
{
  "mensaje": "Credenciales inválidas"
}
```

---

## Pacientes

### GET /pacientes
Obtiene lista de todos los pacientes.

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre": "Juan Perez",
    "dni": "12345678",
    "telefono": "549123456789",
    "alergias": null
  }
]
```

### POST /pacientes (Requiere JWT)
Crea un nuevo paciente.

**Request:**
```json
{
  "nombre": "Juan Perez",
  "dni": "12345678",
  "telefono": "549123456789",
  "alergias": "Penicilina"
}
```

**Validaciones:**
- `nombre`: Mínimo 3 caracteres, máximo 100
- `dni`: 7-8 dígitos, debe ser argentino válido
- `telefono`: Mínimo 10 dígitos (opcional)
- `alergias`: Campo opcional

**Response (201):**
```json
{
  "mensaje": "Paciente agregado correctamente"
}
```

### PUT /pacientes/:id (Requiere JWT)
Actualiza un paciente existente.

### DELETE /pacientes/:id (Requiere JWT)
Elimina un paciente.

---

## Médicos

### GET /medicos
Obtiene lista de todos los médicos.

### POST /medicos (Requiere JWT)
Crea un nuevo médico.

**Request:**
```json
{
  "nombre": "Dr. Carlos López",
  "especialidad": "Cardiología",
  "matricula": "MP123456",
  "telefono": "549123456789",
  "consultorio": "205"
}
```

**Validaciones:**
- `nombre`: Mínimo 3 caracteres, máximo 100
- `especialidad`: Debe estar en lista aprobada (Cardiología, Dermatología, Neurología, etc.)
- `matricula`: Mínimo 5 caracteres
- `telefono`: Mínimo 10 dígitos (opcional)
- `consultorio`: Requerido

**Especialidades válidas:**
- Cardiología
- Dermatología
- Neurología
- Pediatría
- Ginecología
- Oncología
- Oftalmología
- Psiquiatría
- Medicina General
- Traumatología
- Psicología
- Nutrición

### PUT /medicos/:id (Requiere JWT)
Actualiza un médico.

### DELETE /medicos/:id (Requiere JWT)
Elimina un médico.

---

## Turnos

### GET /turnos
Obtiene lista de todos los turnos.

### POST /turnos
Crea un nuevo turno.

Este endpoint admite reservas públicas para pacientes. Si la solicitud no está autenticada, el backend fuerza `estado = "Pendiente"`.

**Request:**
```json
{
  "paciente_id": 1,
  "medico_id": 1,
  "fecha": "2026-03-20",
  "hora": "10:30:00",
  "motivo": "Consulta cardíaca de rutina",
  "estado": "Pendiente"
}
```

**Validaciones:**
- `paciente_id`: Debe existir en la BD
- `medico_id`: Debe existir en la BD
- `fecha`: Debe ser fecha futura, formato YYYY-MM-DD
- `hora`: Formato HH:MM:SS, dentro de horario laboral (08:00-20:00)
- `motivo`: Mínimo 5 caracteres
- `estado`: Por defecto "Pendiente". Sin JWT, cualquier valor enviado se reemplaza por "Pendiente"

**Response (201):**
```json
{
  "mensaje": "Turno agregado correctamente"
}
```

**Errores comunes:**
- 400: "El médico ya tiene un turno en ese horario"
- 400: "El paciente ya tiene un turno en ese horario"
- 400: "El paciente especificado no existe"
- 400: "El médico especificado no existe"

### PUT /turnos/:id (Requiere JWT)
Actualiza el estado de un turno.

**Request:**
```json
{
  "estado": "Completado"
}
```

### DELETE /turnos/:id (Requiere JWT)
Elimina un turno.

---

## Headers Requeridos

Para acceder a rutas protegidas, incluir:
```
Authorization: Bearer {access_token}
```

---

## Códigos de Respuesta

- **200**: Solicitud exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en la solicitud (validación)
- **401**: No autenticado
- **403**: No autorizado
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---

## Notas de Seguridad

- ✅ Todas las operaciones de escritura (POST, PUT, DELETE) requieren autenticación JWT
- ✅ Las contraseñas se hashean con bcrypt
- ✅ Los IDs de recursos se validan antes de operaciones
- ✅ Validaciones estrictas en formato de datos
- ⚠️ En producción, cambiar credenciales admin en `auth_bp.py`
- ⚠️ Usar HTTPS en producción
- ⚠️ Configurar CORS apropiadamente según dominio
