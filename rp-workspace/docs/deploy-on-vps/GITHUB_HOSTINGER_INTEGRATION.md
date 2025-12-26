# 🔗 Integración GitHub con Hostinger VPS

Esta guía explica cómo configurar la integración automática entre GitHub Actions y tu VPS de Hostinger para deployments automáticos.

## 📋 Tabla de Contenidos

- [Ventajas](#ventajas)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Opciones de Autenticación](#opciones-de-autenticación)
- [Secrets de GitHub](#secrets-de-github)
- [Uso](#uso)
- [Troubleshooting](#troubleshooting)

## ✨ Ventajas

- ✅ **Deployment automático** al hacer push a `main` o `develop`
- ✅ **Verificación de integridad** antes del deployment
- ✅ **Rollback automático** si algo falla
- ✅ **Historial completo** en GitHub Actions
- ✅ **Notificaciones** del estado del deployment
- ✅ **Sin intervención manual** necesaria

## 📦 Requisitos Previos

1. **VPS de Hostinger** configurado y accesible
2. **Docker y Docker Compose** instalados en el VPS
3. **Repositorio GitHub** con acceso de escritura
4. **SSH** configurado o contraseña SSH disponible

## ⚙️ Configuración

### Paso 1: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub:
1. **Settings** > **Secrets and variables** > **Actions**
2. Click en **New repository secret**
3. Agrega los siguientes secrets:

#### Secrets Requeridos

```bash
# VPS Connection
VPS_HOST=72.60.63.240
VPS_USER=root
VPS_SSH_KEY=<tu-clave-ssh-privada>  # O usa VPS_SSH_PASSWORD
VPS_SSH_PASSWORD=Aar-Beto-2026      # Solo si no usas SSH key

# Database
DB_USERNAME=requirements_user
DB_PASSWORD=<tu-password-db>
DB_DATABASE=requirements_db
DB_PORT=5432

# JWT
JWT_SECRET=<tu-jwt-secret-min-32-chars>

# URLs (opcional pero recomendado)
API_DEV_URL=http://requirements-api.beyondnet.cloud
API_PRODUCTION_URL=https://requirements-api.beyondnet.cloud
PORTAL_DEV_URL=http://requirements.beyondnet.cloud
PORTAL_PRODUCTION_URL=https://requirements.beyondnet.cloud
NEXT_PUBLIC_API_URL_DEV=http://requirements-api.beyondnet.cloud/api/v1
NEXT_PUBLIC_API_URL_PRODUCTION=https://requirements-api.beyondnet.cloud/api/v1

# CORS
CORS_ORIGIN=https://requirements.beyondnet.cloud
```

### Paso 2: Verificar Workflow

El workflow `.github/workflows/deploy-hostinger.yml` ya está configurado y se activará automáticamente cuando:

- Haces push a `main` → Deployment a **production**
- Haces push a `develop` → Deployment a **development**
- Ejecutas manualmente desde GitHub Actions

### Paso 3: Verificar VPS

Asegúrate de que tu VPS tenga:

```bash
# Docker instalado
docker --version
docker-compose --version

# Git instalado
git --version

# Permisos correctos
sudo mkdir -p /opt/modules
sudo chown -R $USER:$USER /opt/modules
```

## 🔐 Opciones de Autenticación

### Opción 1: SSH Key (Recomendado - Más Seguro)

1. **Generar clave SSH** (si no tienes una):
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@hostinger"
   ```

2. **Copiar clave pública al VPS**:
   ```bash
   ssh-copy-id root@72.60.63.240
   ```

3. **Copiar clave privada a GitHub Secrets**:
   ```bash
   cat ~/.ssh/id_ed25519
   # Copia todo el contenido y pégalo en VPS_SSH_KEY
   ```

### Opción 2: SSH Password (Más Simple)

1. **Agregar password a GitHub Secrets**:
   - Secret: `VPS_SSH_PASSWORD`
   - Valor: `Aar-Beto-2026` (o tu contraseña)

**⚠️ Nota**: La contraseña es menos segura que las claves SSH, pero funciona para empezar.

## 🚀 Uso

### Deployment Automático

El deployment se ejecuta automáticamente cuando:

1. **Push a `main`** → Deployment a producción
2. **Push a `develop`** → Deployment a desarrollo

### Deployment Manual

1. Ve a **Actions** en tu repositorio GitHub
2. Selecciona **Deploy to Hostinger VPS**
3. Click en **Run workflow**
4. Selecciona:
   - **Environment**: `development` o `production`
   - **Skip tests**: Solo si es necesario (no recomendado)
5. Click en **Run workflow**

### Ver Estado del Deployment

1. Ve a **Actions** en GitHub
2. Click en el workflow en ejecución
3. Verás el progreso en tiempo real:
   - ✅ Integrity Check
   - 🚀 Deploy to VPS
   - 🔍 Verify Deployment
   - 📢 Notify

## 🔍 Troubleshooting

### Error: "SSH connection failed"

**Solución**:
```bash
# Verificar conexión SSH manualmente
ssh root@72.60.63.240

# Si falla, verificar:
# 1. IP correcta en VPS_HOST
# 2. Usuario correcto en VPS_USER
# 3. SSH key o password correctos
```

### Error: "Docker is not installed"

**Solución**:
```bash
# Conectar al VPS
ssh root@72.60.63.240

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Error: "Permission denied"

**Solución**:
```bash
# Verificar permisos en VPS
ssh root@72.60.63.240
sudo mkdir -p /opt/modules
sudo chown -R $USER:$USER /opt/modules
chmod 755 /opt/modules
```

### Error: "Git clone failed"

**Solución**:
```bash
# Verificar acceso al repositorio
# El repositorio debe ser público o usar deploy keys

# Si es privado, crear Deploy Key:
# 1. GitHub > Settings > Deploy keys > Add deploy key
# 2. Copiar clave pública SSH
# 3. Agregar al VPS: ~/.ssh/authorized_keys
```

### Deployment lento

**Solución**:
- El primer deployment puede tardar varios minutos (descarga de imágenes Docker)
- Deployments subsecuentes son más rápidos (caché de Docker)

## 📊 Flujo del Deployment

```
GitHub Push
    ↓
GitHub Actions Trigger
    ↓
Integrity Check (Lint, Tests, Build)
    ↓
SSH Connection to VPS
    ↓
Clone/Update Repository
    ↓
Create .env File
    ↓
Docker Compose Up
    ↓
Run Migrations
    ↓
Health Checks
    ↓
Notify Success/Failure
```

## 🔒 Seguridad

### Mejores Prácticas

1. ✅ **Usa SSH Keys** en lugar de contraseñas
2. ✅ **Rota secrets regularmente**
3. ✅ **Usa diferentes secrets** para dev/prod
4. ✅ **Limita acceso SSH** por IP si es posible
5. ✅ **Monitorea logs** de deployment

### Secrets Sensibles

Nunca commits estos valores:
- `VPS_SSH_PASSWORD`
- `DB_PASSWORD`
- `JWT_SECRET`

Siempre usa GitHub Secrets.

## 📝 Ejemplo de Configuración Completa

```yaml
# .github/workflows/deploy-hostinger.yml ya está configurado
# Solo necesitas agregar los secrets en GitHub
```

## 🎯 Próximos Pasos

1. ✅ Configurar todos los secrets
2. ✅ Hacer un push de prueba a `develop`
3. ✅ Verificar deployment en Actions
4. ✅ Verificar aplicación en VPS
5. ✅ Configurar dominio y SSL (si aplica)

## 🔗 Enlaces Útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Setup Guide](SSH_SETUP.md)
- [Troubleshooting SSH](TROUBLESHOOTING_SSH.md)
- [Deployment Plan](PLAN_DEPLOYMENT_REQUIREMENTS.md)

---

**¡Listo para deployment automático!** 🚀

Cada push a `main` o `develop` desplegará automáticamente en tu VPS de Hostinger.

