# 🚀 Ejecutar Deployment - Guía Rápida

## ✅ Checklist Pre-Deployment

Antes de ejecutar, verifica:

- [x] `VPS_SSH_PASSWORD` configurado ✅
- [ ] `VPS_HOST` configurado
- [ ] `VPS_USER` configurado (default: `root`)
- [ ] `DB_USERNAME` configurado
- [ ] `DB_PASSWORD` configurado
- [ ] `DB_DATABASE` configurado
- [ ] `JWT_SECRET` configurado (mínimo 32 caracteres)

---

## 🎯 Opción 1: Ejecutar desde GitHub Web UI (Recomendado)

### Paso 1: Ir a GitHub Actions

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. En el menú lateral izquierdo, busca **"Deploy to Hostinger VPS"**
4. Click en **"Deploy to Hostinger VPS"**

### Paso 2: Ejecutar Workflow

1. Click en el botón **"Run workflow"** (arriba a la derecha)
2. Selecciona:
   - **Branch**: `main` (producción) o `develop` (desarrollo)
   - **Environment**: 
     - `production` si seleccionaste `main`
     - `development` si seleccionaste `develop`
   - **Skip tests**: Dejar **desmarcado** (recomendado)
3. Click en **"Run workflow"**

### Paso 3: Monitorear Progreso

- Verás el workflow ejecutándose en tiempo real
- Cada paso mostrará su estado (⏳ ejecutando, ✅ éxito, ❌ fallo)
- Puedes expandir cada paso para ver logs detallados

---

## 🎯 Opción 2: Ejecutar desde Línea de Comandos (GitHub CLI)

Si tienes GitHub CLI instalado:

```bash
# Instalar GitHub CLI si no lo tienes
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: Ver https://cli.github.com/

# Autenticarte
gh auth login

# Ejecutar workflow
gh workflow run "Deploy to Hostinger VPS.yml" \
  --ref main \
  --field environment=production

# O para desarrollo
gh workflow run "Deploy to Hostinger VPS.yml" \
  --ref develop \
  --field environment=development

# Ver estado
gh run list --workflow="Deploy to Hostinger VPS.yml"
```

---

## 📊 Qué Esperar

### Fases del Deployment

1. **Integrity Check** (5-10 minutos)
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Run linting
   - ✅ Run tests with coverage
   - ✅ Verify builds

2. **SSH Connection** (30 seg - 1 min)
   - ✅ Setup SSH
   - ✅ Test SSH connection (usará tu contraseña)
   - ✅ Debug environment variables

3. **Deploy to VPS** (2-5 minutos)
   - ✅ Prepare deployment script
   - ✅ Copy script to VPS
   - ✅ Execute deployment

4. **Verify Deployment** (1 minuto)
   - ✅ Check API health
   - ✅ Check Portal health

**Tiempo total**: 8-17 minutos

---

## ✅ Verificación Post-Deployment

### 1. Verificar en GitHub Actions

- ✅ Todos los pasos deben tener checkmark verde
- ✅ No debe haber errores en rojo

### 2. Verificar en el VPS

```bash
# Conectarte al VPS
ssh root@TU_VPS_IP

# Verificar contenedores Docker
docker ps

# Deberías ver:
# - requirements-api
# - requirements-portal  
# - requirements-db (PostgreSQL)

# Ver logs
cd /opt/modules/requirements-management
docker-compose logs -f
```

### 3. Verificar Servicios

```bash
# API Health Check
curl http://TU_VPS_IP:3000/api/v1/health/liveness

# Portal
curl http://TU_VPS_IP:4200

# Swagger Docs
curl http://TU_VPS_IP:3000/api/docs
```

---

## 🆘 Si Algo Falla

### Error en Integrity Check

**Solución**: Revisa los logs del paso específico que falló:
- Si es linting: corrige los errores localmente y haz commit
- Si son tests: corrige los tests que fallan
- Si es build: verifica errores de compilación

### Error en SSH Connection

**Solución**:
1. Verifica `VPS_SSH_PASSWORD` es correcta
2. Verifica `VPS_HOST` es correcta
3. Verifica `VPS_USER` es correcto
4. Prueba conexión manual: `ssh root@TU_VPS_IP`

### Error en Deployment

**Solución**:
1. Revisa los logs del paso "Execute deployment on VPS"
2. Conéctate al VPS y verifica:
   ```bash
   cd /opt/modules/requirements-management
   docker-compose ps
   docker-compose logs
   ```

### Error en Health Checks

**Solución**:
1. Verifica que los servicios estén corriendo: `docker ps`
2. Verifica logs: `docker-compose logs`
3. Verifica puertos: `netstat -tlnp | grep -E '3000|4200|5432'`

---

## 🔄 Re-ejecutar Workflow

Si necesitas ejecutar nuevamente:

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Click en el workflow run más reciente
3. Click en **"Re-run all jobs"** o **"Re-run failed jobs"**

---

## 📚 Referencias

- [Próximos Pasos con Password](PROXIMOS_PASOS_CON_PASSWORD.md)
- [Mejores Prácticas SSH](MEJORES_PRACTICAS_SSH_GITHUB_ACTIONS.md)
- [Configurar Secrets](CONFIGURAR_SECRETS_GITHUB.md)

---

## ✅ Checklist Final

- [ ] Todos los secrets configurados
- [ ] Workflow ejecutado desde GitHub Actions
- [ ] Monitoreando progreso en tiempo real
- [ ] Verificando que todos los pasos pasen ✅
- [ ] Verificando servicios en el VPS después del deployment

**¡Listo para ejecutar!** 🚀

