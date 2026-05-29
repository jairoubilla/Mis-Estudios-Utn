# Guía de Producción para Proyecto Hospital

## 🚀 Pre-Lanzamiento (Production Readiness Checklist)

Antes de lanzar a producción, completa esta checklist de 50+ items.

### 🔐 Seguridad (Crítico)

#### Autenticación & Autorización
- [ ] Cambiar credenciales admin por defecto (`admin/admin123`)
  ```bash
  # En auth_bp.py, cambiar credentials
  # Usar credenciales fuertes: min 16 caracteres, mezcla de tipos
  ```
- [ ] Generar novo SECRET_KEY (32+ bytes hexadecimales)
  ```python
  import secrets
  print(secrets.token_hex(32))  # Para SECRET_KEY
  print(secrets.token_hex(32))  # Para JWT_SECRET_KEY
  ```
- [ ] Generar novo JWT_SECRET_KEY
- [ ] Verificar que tokens JWT expirado correcto (7 días recomendado)
- [ ] Implementar refresh token rotation
- [ ] Validar que 2FA será implementado en Q1 2025

#### Secretos & Variables
- [ ] Todos los secrets en `.env` (nunca en código)
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] Credenciales de BD no en codebase
- [ ] API keys de terceros no expuestos
- [ ] Configurar variables de entorno en hosting (AWS, Heroku, etc.)

#### Base de Datos
- [ ] Cambiar contraseña de BD
- [ ] Habilitar conexión por TLS/SSL
- [ ] Backup automático diario
- [ ] Verificar que backups funcionan (test restore)
- [ ] Implementar replicación si es crítico

#### HTTPS & TLS
- [ ] Certificado SSL válido (Let's Encrypt gratuito)
- [ ] TLS 1.2+ obligatorio
- [ ] Redireccionar HTTP → HTTPS
- [ ] HSTS header configurado (1 año mínimo)
- [ ] Certificate pinning si necesario

#### Headers de Seguridad
- [ ] Verificar todos los headers en [SECURITY.md](SECURITY.md)
- [ ] Content-Security-Policy (CSP) correcto
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy configurado

#### CORS
- [ ] CORS_ORIGINS contiene solo dominios autorizados
- [ ] Whitelist específica (sin `*`)
- [ ] Verificar en browsers diferentes
- [ ] Métodos HTTP restringidos por endpoint

### 📊 Base de Datos

- [ ] PostgreSQL en producción (no SQLite)
- [ ] Esquema migraciones implementadas
- [ ] Indices creados ([ver preparar_db_py](hospital_backend/preparar_db_py))
  - [ ] idx_medicos_dni
  - [ ] idx_medicos_especialidad
  - [ ] idx_pacientes_dni
  - [ ] idx_turnos_paciente
  - [ ] idx_turnos_medico
  - [ ] idx_turnos_fecha
  - [ ] idx_turnos_medico_fecha_hora
- [ ] Foreign key constraints habilitadas
- [ ] Backups incluyen índices
- [ ] Disaster recovery plan documentado
- [ ] RTO < 1 hora, RPO < 15 minutos

### 🧪 Testing & QA

- [ ] Suite de tests ejecutada: `pytest --cov` >80%
- [ ] Linting pasado: `black`, `flake8`
- [ ] Frontend lint pasado: `npm run lint`
- [ ] Tests de endpoints críticos (auth, CRUD)
- [ ] Tests de validación de input
- [ ] Tests de seguridad (OWASP)
- [ ] Smoke tests ejecutados en producción
- [ ] Performance tests completados

### 📝 Logging & Monitoring

#### Logs
- [ ] Logging configurado (syslog, CloudWatch, etc.)
- [ ] Logs no contienen secrets
- [ ] Rotación de logs configurada
- [ ] Retención de logs adecuada (90+ días)
- [ ] Logs centralizados y searchable

#### Monitoreo
- [ ] Health checks configurados
- [ ] Alertas para errores 5xx
- [ ] Alertas para latencia >1s
- [ ] Uptime monitoring (UptimeRobot, etc.)
- [ ] CPU/Memoria alertas
- [ ] Disk space alertas
- [ ] Database connection pool alertas

#### Errores
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Stack traces guardados de forma segura
- [ ] Errors no revelan paths internos
- [ ] Rate limiting en errores

### 🚨 Incident Response

- [ ] Runbook de contingencia documentado
- [ ] Contactos de emergencia definidos
- [ ] Equipo on-call establecido
- [ ] Escalation procedure definida
- [ ] War room process establecido
- [ ] Post-mortem template listo

### 📱 Frontend

- [ ] Build optimizado: `npm run build`
- [ ] No console.log en código
- [ ] No hardcoded URLs (usar `api.config.js`)
- [ ] Variables de entorno en `.env.local`
- [ ] Service workers para PWA (opcional)
- [ ] Cache busting en cambios (hash en filenames)
- [ ] Soporte para navegadores modernos testeado

#### Minification
- [ ] JavaScript minificado
- [ ] CSS minificado
- [ ] Imágenes optimizadas
- [ ] Bundle size <500KB (antes de gzip)

### 🌐 Infraestructura

#### Servidor Backend
- [ ] Python 3.8+ instalado
- [ ] Virtual environment separado
- [ ] `pip install -r requirements.txt` limpio
- [ ] Servidor WSGI configurado (Gunicorn, uWSGI)
- [ ] 2+ worker processes mínimo
- [ ] Timeout configurado (30s recomendado)

#### Server Frontend
- [ ] Static files servidos vía CDN (CloudFront, Cloudflare)
- [ ] Gzip compression habilitada
- [ ] Cache headers configurados
- [ ] Preloading de assets críticos

#### Reverse Proxy
- [ ] Nginx o Apache configurado
- [ ] Load balancing configurado
- [ ] Rate limiting configurado (fail2ban)
- [ ] IP whitelisting del admin panel

### 🔄 Deployment

- [ ] Proceso de deployment documentado
- [ ] Blue-green deployment o rolling updates
- [ ] Automated rollback en caso de error
- [ ] Database migrations tested
- [ ] Downtime <5 minutos
- [ ] Comunicación a usuarios antes/después

### 📞 Support & Documentation

- [ ] README.md actualizado para producción
- [ ] API_DOCUMENTATION.md accesible
- [ ] SECURITY.md completamente implementado
- [ ] SETUP.md actualizado
- [ ] Troubleshooting guide disponible
- [ ] Status page pública (opcional)
- [ ] Email de contacto funcionando

### 🌍 Cumplimiento Legal

- [ ] Privacy policy publicada
- [ ] Terms of service publicados
- [ ] GDPR compliance verificado
- [ ] Cookies policy si aplica
- [ ] HIPAA checklist completado (si es USA)
- [ ] Disclaimer de información médica

---

## 🐳 Deployment con Docker

### Dockerfile para Backend

```dockerfile
# Dockerfile para hospital_backend
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY hospital_backend/requirements.txt .

# Instalar Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY hospital_backend/ .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')" || exit 1

# Usuario no-root
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Puerto
EXPOSE 5000

# Comando de inicio
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "30", "app:app"]
```

### Dockerfile para Frontend

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY hospital-frontend/package*.json ./
RUN npm ci

COPY hospital-frontend/ .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: hospital_backend/Dockerfile
    container_name: hospital-backend
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - DATABASE_URI=postgresql://user:pass@postgres:5432/hospital
      - CORS_ORIGINS=https://example.com
      - DEBUG=False
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    build:
      context: .
      dockerfile: hospital-frontend/Dockerfile
    container_name: hospital-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    image: postgres:15-alpine
    container_name: hospital-postgres
    environment:
      - POSTGRES_DB=hospital
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./hospital_backend/preparar_db_py:/docker-entrypoint-initdb.d/
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: hospital-redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
```

---

## 🚀 Deployment a AWS

### EC2 Setup

```bash
#!/bin/bash
# Instalar dependencias
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nodejs npm nginx postgresql

# Clonear repo
cd /home/ec2-user
git clone https://github.com/tu-repo/proyecto_hospital.git
cd proyecto_hospital

# Backend
cd hospital_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../hospital-frontend
npm install
npm run build

# Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/hospital
sudo ln -s /etc/nginx/sites-available/hospital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL con Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d tu-dominio.com

# Iniciar backend con systemd
sudo cp hospital-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable hospital-backend
sudo systemctl start hospital-backend
```

### RDS (PostgreSQL)

```bash
# Conectar a BD
PGPASSWORD=$PASSOU psql -h hospital.cxxxxx.us-east-1.rds.amazonaws.com \
  -U admin \
  -d hospital \
  -f hospital_backend/preparar_db_py

# Backup automático en S3
aws rds create-db-snapshot \
  --db-instance-identifier hospital-db \
  --db-snapshot-identifier hospital-db-$(date +%Y-%m-%d)
```

### CloudFront (CDN)

```bash
# Distribuir static files
aws cloudfront create-distribution \
  --origin-domain-name hospital.s3.amazonaws.com \
  --default-root-object index.html
```

---

## 🔧 Configuración Nginx

```nginx
# /etc/nginx/sites-available/hospital

upstream backend {
    server 127.0.0.1:5000;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=admin_limit:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;

# HTTPS redirect
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    # SSL certs
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;

    # API proxy
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Admin panel (rate limit)
    location /admin/ {
        limit_req zone=admin_limit burst=5 nodelay;
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static files (frontend)
    location / {
        root /var/www/hospital/frontend;
        try_files $uri $uri/ /index.html;

        # Cache control
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # JS/CSS con versionado
    location ~* \.(js|css)$ {
        root /var/www/hospital/frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Imágenes
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        root /var/www/hospital/frontend;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

---

## 📊 Monitoreo con Prometheus & Grafana

### prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'hospital-backend'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']
```

### Agregar métricas a Flask

```python
from prometheus_client import Counter, Histogram, generate_latest

# Métricas
request_count = Counter('http_requests_total', 'Total requests', ['method', 'endpoint'])
request_duration = Histogram('http_request_duration_seconds', 'Request duration')
db_queries = Counter('db_queries_total', 'Total DB queries')

@app.route('/metrics')
def metrics():
    return generate_latest()

@app.before_request
@request_duration.time()
def track_request():
    request_count.labels(request.method, request.endpoint).inc()
```

---

## 🔐 Política de Backup

### Estrategia 3-2-1

- **3 copias:** Original + 2 backups
- **2 medios:** Disk local + Cloud (S3, Azure)
- **1 offsite:** Ubicación geográficamente distinta

### Implementación

```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y-%m-%d)

# Backup PostgreSQL
pg_dump hospital > /mnt/backups/hospital-$DATE.sql
gzip /mnt/backups/hospital-$DATE.sql

# AWS S3 (offsite cloud)
aws s3 cp /mnt/backups/hospital-$DATE.sql.gz \
  s3://hospital-backups/postgres/

# Verificar integridad
EXPECTED_SIZE=5000000  # 5MB
ACTUAL_SIZE=$(stat -f%z /mnt/backups/hospital-$DATE.sql.gz 2>/dev/null || stat -c%s /mnt/backups/hospital-$DATE.sql.gz)

if [ $ACTUAL_SIZE -lt $EXPECTED_SIZE ]; then
    echo "ERROR: Backup très pequeño!" | mail -s "Backup failed" admin@hospital.com
    exit 1
fi

# Limpieza (mantener últimos 30 días)
find /mnt/backups -name "hospital-*.sql.gz" -mtime +30 -delete

# Test restore (semanal)
if [ $(date +%A) = "Sunday" ]; then
    psql hospital_test < <(zcat /mnt/backups/hospital-$DATE.sql.gz)
    if [ $? -eq 0 ]; then
        echo "Backup verification successful" | mail -s "Backup OK" admin@hospital.com
    else
        echo "Backup verification FAILED" | mail -s "Action Required" admin@hospital.com
    fi
fi
```

---

## 🎓 Recursos Útiles

- [OWASP Production Readiness](https://owasp.org/www-project-secure-headers/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/2.3.x/security/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Nginx Best Practices](https://nginx.org/en/docs/)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/userguide/)

---

**Última actualización:** 2025-01-15
**Próxima revisión:** 2025-02-01
