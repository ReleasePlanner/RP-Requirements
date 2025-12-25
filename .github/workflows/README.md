# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para CI/CD y deployment automático.

## ⚠️ Problema Resuelto

**Problema Original:** Los workflows estaban ubicados en `rp-workspace/.github/workflows/`, pero GitHub Actions solo busca workflows en `.github/workflows/` en la raíz del repositorio. Esto causaba que los workflows nunca se ejecutaran.

**Solución:** Los workflows han sido movidos a `.github/workflows/` en la raíz y ajustados para trabajar con la estructura `rp-workspace/`.

## 📋 Workflows Disponibles

### 1. Deploy to Hostinger VPS (`deploy-hostinger.yml`)

**Descripción:** Deployment automático al VPS de Hostinger cuando se hace push a `main` o `develop`.

**Triggers:**
- Push a `main` → Deployment a producción
- Push a `develop` → Deployment a desarrollo
- Manual dispatch desde GitHub Actions

**Jobs:**
1. `integrity-check`: Ejecuta linting, tests y verifica builds
2. `deploy-to-vps`: Despliega al VPS usando SSH
3. `notify`: Envía notificaciones del resultado

**Secrets Requeridos:**
- `VPS_HOST`: IP del VPS (ej: `72.60.63.240`)
- `VPS_USER`: Usuario SSH (ej: `root`)
- `VPS_SSH_KEY` o `VPS_SSH_PASSWORD`: Credenciales SSH
- `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: Credenciales de base de datos
- `JWT_SECRET`: Secret para JWT (mínimo 32 caracteres)

### 2. Test SSH Connection (`test-ssh-connection.yml`)

**Descripción:** Workflow manual para probar la conexión SSH al VPS.

**Uso:**
1. Ve a Actions > Test SSH Connection
2. Click en "Run workflow"
3. Verifica que la conexión SSH funcione correctamente

**Secrets Requeridos:**
- `VPS_HOST`
- `VPS_USER` (opcional, por defecto `root`)
- `VPS_SSH_KEY` o `VPS_SSH_PASSWORD`

## 🔧 Ajustes Realizados

Todos los workflows han sido ajustados para:

1. **Usar `working-directory: rp-workspace`** en los steps que ejecutan comandos npm
2. **Detectar automáticamente** la estructura `rp-workspace/` en el script de deployment
3. **Mantener compatibilidad** con la estructura actual del proyecto

## 📝 Configuración de Secrets

Para que los workflows funcionen, configura los siguientes secrets en GitHub:

**Settings > Secrets and variables > Actions > New repository secret**

```bash
# VPS Connection
VPS_HOST=72.60.63.240
VPS_USER=root
VPS_SSH_PASSWORD=<tu-contraseña-ssh>

# Database
DB_USERNAME=requirements_user
DB_PASSWORD=<tu-password-db>
DB_DATABASE=requirements_db
DB_PORT=5432

# JWT
JWT_SECRET=<tu-secret-min-32-chars>

# URLs (opcionales)
NEXT_PUBLIC_API_URL_DEV=http://requirements-api.beyondnet.cloud/api/v1
NEXT_PUBLIC_API_URL_PRODUCTION=https://requirements-api.beyondnet.cloud/api/v1
API_DEV_URL=http://requirements-api.beyondnet.cloud
API_PRODUCTION_URL=https://requirements-api.beyondnet.cloud
PORTAL_DEV_URL=http://requirements.beyondnet.cloud
PORTAL_PRODUCTION_URL=https://requirements.beyondnet.cloud
```

## 🚀 Uso

### Deployment Automático

Los deployments se ejecutan automáticamente cuando:
- Haces push a `main` → Deployment a producción
- Haces push a `develop` → Deployment a desarrollo

### Deployment Manual

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to Hostinger VPS**
3. Click en **Run workflow**
4. Selecciona el ambiente y ejecuta

## 🔍 Troubleshooting

Si los workflows no se ejecutan:

1. Verifica que los archivos estén en `.github/workflows/` (no en `rp-workspace/.github/workflows/`)
2. Verifica que todos los secrets estén configurados
3. Ejecuta primero "Test SSH Connection" para verificar la conexión
4. Revisa los logs en GitHub Actions para ver errores específicos

Para más información, consulta:
- [GITHUB_HOSTINGER_INTEGRATION.md](../rp-workspace/deploy-on-vps/GITHUB_HOSTINGER_INTEGRATION.md)
- [TROUBLESHOOTING_GITHUB_ACTIONS.md](../rp-workspace/deploy-on-vps/TROUBLESHOOTING_GITHUB_ACTIONS.md)

