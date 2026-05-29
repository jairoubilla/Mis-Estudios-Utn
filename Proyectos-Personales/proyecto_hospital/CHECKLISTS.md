# ✅ CHECKLISTS - Hospital Management System

Listas de verificación para diferentes escenarios.

---

## 🏁 Pre-Lanzamiento Checklist (Crítico)

### Seguridad
- [ ] Cambiar credenciales admin (`admin/admin123`)
- [ ] Generar nuevo SECRET_KEY
  ```python
  import secrets
  print(secrets.token_hex(32))
  ```
- [ ] Generar nuevo JWT_SECRET_KEY
- [ ] Ambiente no in DEBUG mode
- [ ] Variables en .env, no versionadas
- [ ] SSL/HTTPS configurado
- [ ] Headers de seguridad presentes
- [ ] CORS no usa wildcard (`*`)

### Testing
- [ ] `pytest` pasa 100% (pytest --cov)
- [ ] Coverage >= 80%
- [ ] Linting: `black` + `flake8` pasan
- [ ] Frontend: `npm run lint` pasa
- [ ] Tests de rutas críticas

### Base de Datos
- [ ] BD migraciones testeadas
- [ ] Backups funcionan (test restore)
- [ ] Índices creados
- [ ] Foreign keys habilitadas
- [ ] Conexión string en .env

### Monitoreo
- [ ] Logs configurado
- [ ] Error tracking (Sentry, etc)
- [ ] Health checks implementados
- [ ] Alertas configuradas

### Documentación
- [ ] README.md actualizado
- [ ] API_DOCUMENTATION.md correcto
- [ ] SECURITY.md checklist completado
- [ ] Runbook de incidents documentado

---

## 👨‍💻 Developer Setup Checklist

### Antes de Empezar
- [ ] Fork del repo
- [ ] Clone en máquina local
- [ ] Rama: `git checkout develop`

### Backend Setup
- [ ] Python 3.8+ instalado
  ```bash
  python --version
  ```
- [ ] Virtual env creado
  ```bash
  python -m venv venv
  source venv/bin/activate  # Mac/Linux
  # o
  venv\Scripts\activate  # Windows
  ```
- [ ] Dependencias instaladas
  ```bash
  pip install -r requirements.txt
  ```
- [ ] BD creada
  ```bash
  python preparar_db_py
  ```
- [ ] Server corre
  ```bash
  python app.py
  ```

### Frontend Setup
- [ ] Node.js 16+ instalado
  ```bash
  node --version
  npm --version
  ```
- [ ] Dependencias instaladas
  ```bash
  npm install
  ```
- [ ] Dev server corre
  ```bash
  npm run dev
  ```

### IDE Setup
- [ ] VS Code (recomendado)
- [ ] Python extension instalada
- [ ] ESLint extension instalada
- [ ] Prettier extension instalada (opcional)
- [ ] .vscode/settings.json configurado (opcional)

### Local Testing
- [ ] Backend tests pasan
  ```bash
  pytest
  ```
- [ ] Linting pasa
  ```bash
  black .
  flake8 .
  npm run lint
  ```
- [ ] App abre en browser
- [ ] Login funciona
- [ ] CRUD básico funciona

---

## 🚀 Pre-Production Checklist

### Infrastructure
- [ ] Servidor provisioned
- [ ] Base de datos creada
- [ ] SSL/TLS certificado instalado
- [ ] Firewall configurado
- [ ] Backups automatizados
- [ ] Monitoring stack instalado

### Application
- [ ] .env producción configurado
- [ ] DEBUG=False
- [ ] SECRET_KEY != "dev-secret-key"
- [ ] CORS origins correcto
- [ ] Database URI correcto
- [ ] Static files buildados

### Database
- [ ] Migraciones ejecutadas
- [ ] Indexes creados
- [ ] Foreign keys habilitadas
- [ ] Backups test exitoso
- [ ] RTO/RPO checklist
  - [ ] RTO < 1 hora
  - [ ] RPO < 15 minutos

### Testing
- [ ] Smoke tests pasan
- [ ] Load testing completado
- [ ] Security testing completado
- [ ] Penetration testing (opcional)

### Documentation
- [ ] Runbook de operaciones
- [ ] Incident response plan
- [ ] Disaster recovery plan
- [ ] Documentation upd-to-date

### Legal/Compliance
- [ ] Privacy policy publicada
- [ ] Terms of service publicados
- [ ] HIPAA/GDPR reviewed (si aplica)
- [ ] Data handling practices documented

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Validators testeados
- [ ] Schemas testeados
- [ ] Service methods testeados
- [ ] 80%+ coverage

### Integration Tests
- [ ] Endpoints testeados
- [ ] Auth flow testeado
- [ ] CRUD operations testeados
- [ ] Error cases testeados

### Security Tests
- [ ] SQL injection attempts blocked
- [ ] XSS prevention verified
- [ ] CORS restrictions verified
- [ ] JWT expiration works
- [ ] 401/403 responses correct

### Performance Tests
- [ ] Response time < 200ms
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Load test >= 1000 req/sec

### UI Tests
- [ ] Forms validate
- [ ] Tooltips/help text present
- [ ] Responsive design
- [ ] Browsers modernos (Chrome, Firefox, Safari, Edge)

---

## 📝 Commit Checklist

Antes de hacer `git commit`:

- [ ] Cambios relacionados (no mezclar features)
- [ ] Tests pasan
  ```bash
  pytest
  npm run lint
  ```
- [ ] Linting pasa
  ```bash
  black .
  flake8 .
  npm run lint -- --fix
  ```
- [ ] No cambios de configuración local
- [ ] No secrets o credenciales
- [ ] Mensaje sigue Conventional Commits
  ```
  type(scope): descripción corta
  
  Descripción más detallada (opcional)
  ```

---

## 🔄 Pull Request Checklist

Antes de abrir PR:

### Code Quality
- [ ] Branch actualizado con develop
  ```bash
  git fetch upstream
  git rebase upstream/develop
  ```
- [ ] Tests pasan (100% local)
  ```bash
  pytest --cov
  ```
- [ ] Linting pasa
  ```bash
  black .
  npm run lint -- --fix
  ```
- [ ] Cambios son "atomic" (una cosa)

### Documentation
- [ ] Code comentado donde es complejo
- [ ] API_DOCUMENTATION.md actualizado (si endpoint)
- [ ] CHANGELOG.md entry agregada
- [ ] README.md actualizado (si necesario)

### Testing
- [ ] Tests agregados para nuevas features
- [ ] Tests agregados para bugfixes
- [ ] Edge cases testeados

### PR Itself
- [ ] Descripción clara y concisa
- [ ] Screenshots si es UI (antes/después)
- [ ] Linked issues referenciados
- [ ] Asignado a reviewer

---

## 🔐 Security Review Checklist

Para security team antes de lanzar:

### Code Review
- [ ] No secrets hardcoded
- [ ] Validaciones presentes
- [ ] Queries usan prepared statements
- [ ] Authentication requerido en endpoints corr
- [ ] Authorization checks presentes
- [ ] Error messages no revelan internals

### Dependency Check
- [ ] `npm audit` limpio o vulnerabilidades conocidas mitigadas
- [ ] `pip-audit` limpio o vulnerabilidades conocidas mitigadas
- [ ] Dependencias actualizadas
- [ ] No deprecated packages

### Configuration
- [ ] Secrets en .env o secrets manager
- [ ] DATABASE_URI no en código
- [ ] API keys no en repositorio
- [ ] CORS whitelist apropiado
- [ ] SSL/TLS configurado

### Testing
- [ ] Security tests testeados
- [ ] Penetration testing done
- [ ] OWASP Top 10 checked
- [ ] Rate limiting present

### Documentation
- [ ] SECURITY.md completo
- [ ] Incident response plan
- [ ] Audit logging configured
- [ ] Data retention policy defined

---

## 📊 Release Checklist

Antes de hacer release v1.x.x:

### Code Freeze
- [ ] Todos los cambios mergeados a main
- [ ] Todos los tests pasan
- [ ] Documentación updated
- [ ] CHANGELOG.md updated

### Version Bumping
- [ ] package.json versión updated
- [ ] hospital_backend/__init__.py versión updated
- [ ] Git tag creado: `git tag v1.x.x`

### Build & Deploy
- [ ] Frontend build locally testeado
  ```bash
  npm run build
  npm run preview
  ```
- [ ] Backend deployment testeado
  ```bash
  pip install -r requirements.txt
  python preparar_db_py
  pytest --cov
  ```
- [ ] Docker images buildeados y testeados
- [ ] AWS deployment scripts testeados

### Post-Release
- [ ] Release notes publicadas
- [ ] GitHub Release creado
- [ ] Documentation updated
- [ ] Team notificado
- [ ] Monitoring verificado

---

## 🆘 Incident Response Checklist

De occurrir un incident en producción:

### Immediate Actions (0-15 min)
- [ ] Incidente identificado y alertado
- [ ] War room iniciada (Slack/Teams)
- [ ] Bridge call establecido (si crítico)
- [ ] Incident commander asignado
- [ ] Stakeholders notificados

### Investigation (15-60 min)
- [ ] Logs analizados
- [ ] Error patterns identificados
- [ ] Root cause tenga inicio
- [ ] Scope del impacto determinado
- [ ] Timeline de eventos creado

### Mitigation (60 min - 4 horas)
- [ ] Workaround implementado (if possible)
- [ ] Fix desarrollado
- [ ] Tests escritos para bug
- [ ] Mergeado a main
- [ ] Deployado a producción
- [ ] Monitoreo verificado

### Post-Incident (24 horas)
- [ ] Post-mortem scheduled
- [ ] Root cause analysis complete
- [ ] Action items listed
- [ ] Prevention measures planned
- [ ] Documentación updated

---

## 🎓 Onboarding Checklist (Nuevo Developer)

### Day 1
- [ ] Acceso a repositorio
- [ ] Acceso a documentación
- [ ] Hardware/laptop setup
- [ ] IDE instalado y configurado
- [ ] Slack/Teams agregado
- [ ] README.md leído
- [ ] CONTRIBUTING.md leído

### Day 2
- [ ] SETUP.md seguido
- [ ] Backend running locally
- [ ] Frontend running locally
- [ ] Tests pasan
- [ ] Git workflow explicado
- [ ] First issue asignado (pequeño)

### Week 1
- [ ] Código base entendido
- [ ] PR proceso entendido
- [ ] Code standards asimilados
- [ ] Primer PR submitted
- [ ] Pair programming session (1 hora)

### Week 2-4
- [ ] 3-5 pequeños PRs mergeados
- [ ] Code review feedback incorporado
- [ ] Arquitectura entendida
- [ ] Equipo conocido
- [ ] Roadmap entendido

---

## 🚨 Emergency Checklist

Si todo está roto:

### Step 1: Diagnosticar
- [ ] Error message copied
- [ ] Logs reviewed
- [ ] Reproducido localmente
- [ ] Version identificada

### Step 2: Common Fixes
- [ ] Clear cache
  ```bash
  rm -rf node_modules .vite
  npm install
  ```
- [ ] Restart servers
  ```bash
  Ctrl+C + re-run
  ```
- [ ] Update dependencies
  ```bash
  pip install --upgrade pip
  npm run update
  ```
- [ ] Check .env variables
  ```bash
  cat .env
  ```

### Step 3: Get Help
- [ ] [TROUBLESHOOTING.md](TROUBLESHOOTING.md) revisado
- [ ] Documentación buscada
- [ ] Team consulted
- [ ] Issue creado si es bug

---

## 📋 Monthly Checklist

Tareas mensuales para el equipo:

- [ ] Security updates reviewed
- [ ] Dependencies updated
- [ ] Backups tested
- [ ] Monitoring alerts reviewed
- [ ] Performance metrics reviewed
- [ ] User feedback checked
- [ ] Documentation reviewed
- [ ] Team retrospective
- [ ] Roadmap revisado
- [ ] Version planning próximo mes

---

## 🎯 Quarterly Checklist

Tareas trimestrales:

- [ ] Security audit
- [ ] Performance review
- [ ] Architecture review
- [ ] Dependency upgrade
- [ ] Documentation refresh
- [ ] Roadmap planning
- [ ] Team goals review
- [ ] Budget review
- [ ] Infrastructure capacity
- [ ] Disaster recovery drill

---

**Última actualización:** 2025-01-15

**Tip:** Bookmark esta página para acceso rápido a checklists!
