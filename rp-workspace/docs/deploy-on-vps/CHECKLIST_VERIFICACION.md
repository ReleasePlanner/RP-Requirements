# ✅ Checklist de Verificación Completa

Verificación exhaustiva del workflow de deployment y configuración.

## 📋 Checklist de Configuración

### 1. Secrets de GitHub ✅

Verifica que estos secrets estén configurados en GitHub (Settings > Secrets):

#### Requeridos (Críticos)
- [ ] `VPS_HOST` = `72.60.63.240`
- [ ] `VPS_USER` = `root` (o tu usuario SSH)
- [ ] `VPS_SSH_PASSWORD` = `Aar-Beto-2026` (o tu contraseña) **O** `VPS_SSH_KEY` (clave privada SSH)
- [ ] `DB_USERNAME` = (usuario de base de datos)
- [ ] `DB_PASSWORD` = (contraseña de base de datos)
- [ ] `DB_DATABASE` = `requirements_db`
- [ ] `JWT_SECRET` = (secret mínimo 32 caracteres)

#### Opcionales (Recomendados)
- [ ] `DB_PORT` = `5432` (default si no se especifica)
- [ ] `JWT_EXPIRES_IN` = `1d` (default si no se especifica)
- [ ] `CORS_ORIGIN` = `https://requirements.beyondnet.cloud`
- [ ] `API_PORT` = `3000` (default si no se especifica)
- [ ] `PORTAL_PORT` = `4200` (default si no se especifica)
- [ ] `NEXT_PUBLIC_API_URL_DEV` = `http://requirements-api.beyondnet.cloud/api/v1`
- [ ] `NEXT_PUBLIC_API_URL_PRODUCTION` = `https://requirements-api.beyondnet.cloud/api/v1`
- [ ] `API_DEV_URL` = `http://requirements-api.beyondnet.cloud`
- [ ] `API_PRODUCTION_URL` = `https://requirements-api.beyondnet.cloud`
- [ ] `PORTAL_DEV_URL` = `http://requirements.beyondnet.cloud`
- [ ] `PORTAL_PRODUCTION_URL` = `https://requirements.beyondnet.cloud`

### 2. Repositorio GitHub ✅

- [x] Repositorio existe: `https://github.com/ReleasePlanner/RP-Requirements`
- [x] Repositorio es público (no requiere autenticación para clonar)
- [ ] Rama `main` existe y tiene código
- [ ] Rama `develop` existe (si vas a usar desarrollo)
- [ ] El workflow está en `.github/workflows/deploy-hostinger.yml`

### 3. VPS Hostinger ✅

#### Conexión SSH
- [ ] Puedes conectarte manualmente: `ssh root@72.60.63.240`
- [ ] La contraseña SSH es correcta
- [ ] El puerto SSH es `22` (o está configurado correctamente)

#### Software Requerido
- [ ] Docker instalado: `docker --version`
- [ ] Docker Compose instalado: `docker-compose --version`
- [ ] Git instalado: `git --version`

#### Permisos
- [ ] Directorio `/opt/modules` existe y tiene permisos: `sudo mkdir -p /opt/modules && sudo chmod 755 /opt/modules`
- [ ] Usuario SSH puede escribir en `/opt/modules`

### 4. Archivos del Proyecto ✅

#### Workflows
- [x] `.github/workflows/deploy-hostinger.yml` existe y está correcto
- [x] `.github/workflows/test-ssh-connection.yml` existe para pruebas

#### Docker
- [x] `docker-compose.yml` existe en la raíz
- [x] `apps/api/Dockerfile` existe
- [x] `apps/portal/Dockerfile` existe
- [x] `.dockerignore` existe

#### Configuración
- [x] `env.docker.example` existe como referencia
- [x] `package.json` tiene los scripts necesarios

## 🔍 Verificación del Workflow

### Estructura del Workflow ✅

1. **Triggers** ✅
   - Push a `main` → Production
   - Push a `develop` → Development
   - Manual dispatch con opciones

2. **Jobs** ✅
   - `integrity-check`: Lint, tests, builds
   - `deploy-to-vps`: Deployment real
   - `notify`: Notificaciones

3. **Steps de Deployment** ✅
   - Checkout code
   - Setup SSH
   - Test SSH connection
   - Debug environment variables
   - Create deployment script
   - Copy script to VPS
   - Execute deployment
   - Verify deployment

### Variables y Secrets ✅

#### Variables de Entorno (env:)
- ✅ `NODE_VERSION` = "20.x"
- ✅ `VPS_HOST` = desde secrets
- ✅ `VPS_USER` = desde secrets o 'root'
- ✅ `MODULE_NAME` = "requirements-management"
- ✅ `MODULE_PATH` = "/opt/modules/requirements-management"

#### Secrets Usados
- ✅ `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_SSH_PASSWORD`
- ✅ `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT`
- ✅ `JWT_SECRET`, `JWT_EXPIRES_IN`
- ✅ `CORS_ORIGIN`, `API_PORT`, `PORTAL_PORT`
- ✅ `NEXT_PUBLIC_API_URL_DEV`, `NEXT_PUBLIC_API_URL_PRODUCTION`
- ✅ `API_DEV_URL`, `API_PRODUCTION_URL`, `PORTAL_DEV_URL`, `PORTAL_PRODUCTION_URL`
- ✅ `GITHUB_TOKEN` (automático)

### Lógica del Script de Deployment ✅

1. **Clonado de Repositorio** ✅
   - Usa: `https://github.com/ReleasePlanner/RP-Requirements.git`
   - Maneja repositorio existente vs nuevo
   - Fallback si la rama no existe

2. **Creación de .env** ✅
   - Variables correctamente expandidas
   - Manejo de development vs production
   - Valores por defecto correctos

3. **Docker Compose** ✅
   - Verifica Docker instalado
   - Detiene contenedores existentes
   - Build y start de servicios
   - Health checks

4. **Migraciones** ✅
   - Ejecuta migraciones de base de datos
   - Maneja errores gracefully

## 🧪 Pruebas Recomendadas

### 1. Prueba SSH (Primero)
```bash
# Ejecuta el workflow "Test SSH Connection"
# GitHub > Actions > Test SSH Connection > Run workflow
```

### 2. Prueba Deployment Manual
```bash
# Ejecuta el workflow manualmente
# GitHub > Actions > Deploy to Hostinger VPS > Run workflow
# Selecciona: environment=development, skip_tests=false
```

### 3. Verificación en VPS
```bash
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose ps
docker-compose logs -f
```

## ⚠️ Problemas Comunes Detectados y Corregidos

### ✅ Corregido: Variables de entorno en heredoc
- **Problema**: Uso de `env.ENVIRONMENT` dentro del script bash
- **Solución**: Uso de variable bash `$ENVIRONMENT` con lógica condicional

### ✅ Corregido: URL del repositorio
- **Problema**: `github.repositoryUrl` puede no estar disponible
- **Solución**: Uso de `https://github.com/${{ github.repository }}.git`

### ✅ Corregido: Manejo de ramas
- **Problema**: Falla si la rama no existe
- **Solución**: Fallback a rama por defecto con logging

### ✅ Corregido: Health checks externos
- **Problema**: Falla si URLs no están configuradas
- **Solución**: Verificación de existencia antes de hacer curl

## 📊 Estado Final

### ✅ Configuración Correcta
- [x] Workflow sintácticamente correcto
- [x] Variables y secrets correctamente referenciados
- [x] Lógica de deployment robusta
- [x] Manejo de errores adecuado
- [x] Logging detallado para debugging

### ⚠️ Requiere Configuración Manual
- [ ] Secrets configurados en GitHub
- [ ] Docker instalado en VPS
- [ ] Permisos de directorio correctos
- [ ] Conexión SSH funcionando

## 🚀 Próximos Pasos

1. **Configurar todos los secrets** en GitHub
2. **Ejecutar "Test SSH Connection"** para verificar conexión
3. **Hacer push a develop** para trigger automático
4. **Monitorear el workflow** en GitHub Actions
5. **Verificar servicios** en el VPS después del deployment

---

**Estado**: ✅ Workflow verificado y corregido. Listo para deployment una vez que los secrets estén configurados.

