# 🔐 Guía: Configurar Secrets en GitHub Actions para Deploy a Hostinger

Esta guía te mostrará paso a paso cómo configurar los secrets necesarios en GitHub para que el workflow de GitHub Actions pueda hacer el deploy automático a tu VPS de Hostinger.

## 📋 Tabla de Contenidos

1. [Acceder a la Configuración de Secrets](#acceder-a-la-configuración-de-secrets)
2. [Secrets Requeridos](#secrets-requeridos)
3. [Cómo Obtener Cada Valor](#cómo-obtener-cada-valor)
4. [Configuración Paso a Paso](#configuración-paso-a-paso)
5. [Verificación](#verificación)

---

## 🔑 Acceder a la Configuración de Secrets

### Paso 1: Ir a la Configuración del Repositorio

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/TU_REPOSITORIO`
2. Haz clic en la pestaña **Settings** (Configuración)
3. En el menú lateral izquierdo, busca **Secrets and variables**
4. Haz clic en **Actions**

### Paso 2: Agregar un Nuevo Secret

1. Haz clic en el botón **New repository secret** (Nuevo secreto del repositorio)
2. Ingresa el **Name** (nombre del secret)
3. Ingresa el **Secret** (valor del secret)
4. Haz clic en **Add secret**

---

## 📝 Secrets Requeridos

### 🔴 Secrets Obligatorios (sin estos no funcionará el deploy)

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `VPS_HOST` | IP o dominio de tu VPS Hostinger | `72.60.63.240` o `mi-servidor.com` |
| `VPS_USER` | Usuario SSH del VPS (opcional, default: `root`) | `root` |
| `VPS_SSH_KEY` o `VPS_SSH_PASSWORD` | **Uno de estos dos es obligatorio** | Ver abajo |
| `DB_USERNAME` | Usuario de PostgreSQL | `requirements_user` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `mi_password_seguro_123` |
| `DB_DATABASE` | Nombre de la base de datos | `requirements_db` |
| `JWT_SECRET` | Secret para firmar tokens JWT (mínimo 32 caracteres) | `mi-secret-super-seguro-de-al-menos-32-caracteres` |

### 🟡 Secrets Opcionales (tienen valores por defecto)

| Secret | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token JWT | `1d` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:4200` |
| `API_PORT` | Puerto de la API | `3000` |
| `PORTAL_PORT` | Puerto del Portal | `4200` |
| `NEXT_PUBLIC_API_URL_DEV` | URL de la API para desarrollo | (sin default) |
| `NEXT_PUBLIC_API_URL_PRODUCTION` | URL de la API para producción | (sin default) |
| `API_DEV_URL` | URL completa de la API dev (para health checks) | (sin default) |
| `API_PRODUCTION_URL` | URL completa de la API producción | (sin default) |
| `PORTAL_DEV_URL` | URL completa del Portal dev | (sin default) |
| `PORTAL_PRODUCTION_URL` | URL completa del Portal producción | (sin default) |

---

## 🔍 Cómo Obtener Cada Valor

### 1. VPS_HOST

**Opción A: IP del VPS**
- En tu panel de Hostinger, ve a **VPS** > **Tu VPS** > **Detalles**
- Copia la **IP Address** (dirección IP)
- Ejemplo: `72.60.63.240`

**Opción B: Dominio**
- Si tienes un dominio apuntando a tu VPS, puedes usar el dominio
- Ejemplo: `api.tudominio.com`

### 2. VPS_USER

- Generalmente es `root` para VPS Hostinger
- Si usas otro usuario, ingrésalo aquí
- **Valor por defecto**: `root` (se usa si no se configura)

### 3. VPS_SSH_KEY (Recomendado) o VPS_SSH_PASSWORD

#### Opción A: Usar SSH Key (Recomendado - Más Seguro)

**Paso 1: Generar una clave SSH (si no tienes una)**

```bash
# En tu máquina local
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/hostinger_deploy

# Esto creará dos archivos:
# ~/.ssh/hostinger_deploy (clave privada)
# ~/.ssh/hostinger_deploy.pub (clave pública)
```

**Paso 2: Agregar la clave pública al VPS**

```bash
# Copiar la clave pública al VPS
ssh-copy-id -i ~/.ssh/hostinger_deploy.pub root@TU_VPS_HOST

# O manualmente:
cat ~/.ssh/hostinger_deploy.pub
# Copia el contenido y agrégalo a ~/.ssh/authorized_keys en el VPS
```

**Paso 3: Obtener la clave privada**

```bash
# En tu máquina local, mostrar la clave privada
cat ~/.ssh/hostinger_deploy

# Copia TODO el contenido incluyendo:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... (todo el contenido) ...
# -----END OPENSSH PRIVATE KEY-----
```

**Paso 4: Agregar a GitHub Secrets**
- Name: `VPS_SSH_KEY`
- Secret: Pega TODO el contenido de la clave privada (incluyendo las líneas BEGIN y END)

#### Opción B: Usar Contraseña SSH (Menos Seguro)

- Usa la contraseña que configuraste para el usuario SSH en tu VPS
- **Name**: `VPS_SSH_PASSWORD`
- **Secret**: Tu contraseña SSH

⚠️ **Nota**: Usar SSH Key es más seguro que usar contraseña.

### 4. DB_USERNAME, DB_PASSWORD, DB_DATABASE

**Si ya tienes PostgreSQL configurado en tu VPS:**

```bash
# Conectarte al VPS
ssh root@TU_VPS_HOST

# Conectarse a PostgreSQL
sudo -u postgres psql

# Crear usuario y base de datos (si no existen)
CREATE USER requirements_user WITH PASSWORD 'tu_password_seguro';
CREATE DATABASE requirements_db OWNER requirements_user;
GRANT ALL PRIVILEGES ON DATABASE requirements_db TO requirements_user;
\q
```

**Valores para GitHub Secrets:**
- `DB_USERNAME`: `requirements_user`
- `DB_PASSWORD`: `tu_password_seguro` (el que configuraste arriba)
- `DB_DATABASE`: `requirements_db`

**Si usas Docker Compose en el VPS:**
- Los valores están en tu archivo `docker-compose.yml` o `.env`
- Busca las variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

### 5. JWT_SECRET

**Generar un secret seguro:**

```bash
# Opción 1: Usar openssl
openssl rand -base64 32

# Opción 2: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Generar manualmente
# Crea una cadena aleatoria de al menos 32 caracteres
# Ejemplo: "mi-super-secret-jwt-key-para-produccion-2024-seguro"
```

**Importante**: 
- Debe tener **mínimo 32 caracteres**
- Úsalo en GitHub Secret: `JWT_SECRET`

### 6. URLs (Opcionales pero Recomendadas)

**Para Desarrollo:**
- `NEXT_PUBLIC_API_URL_DEV`: `http://tu-ip-o-dominio-dev:3000/api/v1`
- `API_DEV_URL`: `http://tu-ip-o-dominio-dev:3000`
- `PORTAL_DEV_URL`: `http://tu-ip-o-dominio-dev:4200`

**Para Producción:**
- `NEXT_PUBLIC_API_URL_PRODUCTION`: `https://api.tudominio.com/api/v1`
- `API_PRODUCTION_URL`: `https://api.tudominio.com`
- `PORTAL_PRODUCTION_URL`: `https://tudominio.com`

---

## ✅ Configuración Paso a Paso

### Checklist de Secrets a Configurar

Marca cada secret conforme lo vayas agregando:

#### 🔴 Obligatorios

- [ ] `VPS_HOST` - IP o dominio de tu VPS
- [ ] `VPS_USER` - Usuario SSH (opcional, default: `root`)
- [ ] `VPS_SSH_KEY` **O** `VPS_SSH_PASSWORD` - Credenciales SSH
- [ ] `DB_USERNAME` - Usuario de PostgreSQL
- [ ] `DB_PASSWORD` - Contraseña de PostgreSQL
- [ ] `DB_DATABASE` - Nombre de la base de datos
- [ ] `JWT_SECRET` - Secret para JWT (mínimo 32 caracteres)

#### 🟡 Opcionales (pero recomendados)

- [ ] `DB_PORT` - Puerto de PostgreSQL (default: `5432`)
- [ ] `JWT_EXPIRES_IN` - Expiración del token (default: `1d`)
- [ ] `NEXT_PUBLIC_API_URL_DEV` - URL API desarrollo
- [ ] `NEXT_PUBLIC_API_URL_PRODUCTION` - URL API producción
- [ ] `API_DEV_URL` - URL completa API dev
- [ ] `API_PRODUCTION_URL` - URL completa API producción
- [ ] `PORTAL_DEV_URL` - URL completa Portal dev
- [ ] `PORTAL_PRODUCTION_URL` - URL completa Portal producción

### Ejemplo de Configuración Completa

```
VPS_HOST=72.60.63.240
VPS_USER=root
VPS_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (todo el contenido de la clave privada) ...
-----END OPENSSH PRIVATE KEY-----

DB_USERNAME=requirements_user
DB_PASSWORD=mi_password_super_seguro_123
DB_DATABASE=requirements_db
DB_PORT=5432

JWT_SECRET=mi-super-secret-jwt-key-para-produccion-2024-seguro-min-32-chars
JWT_EXPIRES_IN=1d

NEXT_PUBLIC_API_URL_DEV=http://72.60.63.240:3000/api/v1
NEXT_PUBLIC_API_URL_PRODUCTION=https://api.tudominio.com/api/v1

API_DEV_URL=http://72.60.63.240:3000
API_PRODUCTION_URL=https://api.tudominio.com
PORTAL_DEV_URL=http://72.60.63.240:4200
PORTAL_PRODUCTION_URL=https://tudominio.com
```

---

## 🧪 Verificación

### Paso 1: Verificar que los Secrets Están Configurados

1. Ve a: `Settings > Secrets and variables > Actions`
2. Deberías ver todos los secrets listados
3. Verifica que `VPS_HOST` y al menos `VPS_SSH_KEY` o `VPS_SSH_PASSWORD` estén configurados

### Paso 2: Probar la Conexión SSH

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Haz clic en **Run workflow**
3. Selecciona la rama (`main` o `develop`)
4. Selecciona el ambiente (`development` o `production`)
5. Haz clic en **Run workflow**
6. Observa el paso **"Test SSH connection"**
   - ✅ Si funciona: Verás "SSH connection successful"
   - ❌ Si falla: Revisa los valores de `VPS_HOST`, `VPS_USER`, y `VPS_SSH_KEY`/`VPS_SSH_PASSWORD`

### Paso 3: Verificar el Deploy Completo

Una vez que la conexión SSH funcione, el workflow debería:
1. ✅ Pasar las pruebas de integridad
2. ✅ Ejecutar los tests con cobertura
3. ✅ Verificar los builds
4. ✅ Conectarse al VPS
5. ✅ Copiar el script de deployment
6. ✅ Ejecutar el deployment
7. ✅ Verificar que los servicios estén corriendo

---

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca compartas tus secrets públicamente**
   - No los subas al repositorio
   - No los incluyas en commits
   - No los compartas en chats públicos

2. **Usa SSH Keys en lugar de contraseñas**
   - Más seguro
   - Permite rotación de credenciales sin cambiar la contraseña del servidor

3. **Rota los secrets periódicamente**
   - Cambia `JWT_SECRET` cada cierto tiempo
   - Regenera las SSH keys periódicamente

4. **Usa diferentes secrets para desarrollo y producción**
   - Puedes usar GitHub Environments para separar secrets por ambiente

### Configurar Secrets por Ambiente (Opcional)

Si quieres tener diferentes secrets para desarrollo y producción:

1. Ve a: `Settings > Environments`
2. Crea dos environments: `development` y `production`
3. En cada environment, agrega los secrets específicos
4. El workflow ya está configurado para usar estos environments automáticamente

---

## 🆘 Troubleshooting

### Error: "Permission denied (publickey,password)"

Este es el error más común. Ver la guía completa: [Troubleshooting SSH Permission Denied](TROUBLESHOOTING_SSH_PERMISSION_DENIED.md)

**Solución rápida:**
1. Verifica que la clave SSH en GitHub Secrets tenga el formato correcto (BEGIN/END)
2. Agrega la clave pública al VPS: `ssh-copy-id -i KEY.pub root@IP`
3. Ajusta permisos: `chmod 600 ~/.ssh/authorized_keys` y `chmod 700 ~/.ssh`

### Error: "No SSH credentials provided"

**Causa**: No has configurado `VPS_SSH_KEY` ni `VPS_SSH_PASSWORD`

**Solución**: 
- Agrega uno de estos secrets en GitHub
- Verifica que el valor esté correcto (sin espacios extra, con todas las líneas)

### Error: "Connection refused" o "Connection timeout"

**Causa**: 
- `VPS_HOST` incorrecto
- Firewall bloqueando el puerto 22
- El VPS no está accesible

**Solución**:
- Verifica la IP en el panel de Hostinger
- Verifica que el puerto 22 esté abierto en el firewall
- Prueba la conexión manualmente: `ssh root@TU_VPS_HOST`

### Error: "Permission denied (publickey)"

**Causa**: 
- La clave SSH no está autorizada en el servidor
- La clave privada está mal copiada

**Solución**:
- Verifica que la clave pública esté en `~/.ssh/authorized_keys` del VPS
- Verifica que la clave privada en GitHub esté completa (incluyendo BEGIN y END)

### Error: "Database connection failed"

**Causa**: 
- Credenciales de base de datos incorrectas
- PostgreSQL no está corriendo
- Firewall bloqueando el puerto 5432

**Solución**:
- Verifica los valores de `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- Verifica que PostgreSQL esté corriendo: `docker-compose ps` o `systemctl status postgresql`
- Verifica que el puerto 5432 esté accesible

---

## 📚 Referencias

- [GitHub Docs: Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Docs: Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Documentación de Deployment](rp-workspace/deploy-on-vps/GITHUB_HOSTINGER_INTEGRATION.md)
- [Troubleshooting GitHub Actions](rp-workspace/deploy-on-vps/TROUBLESHOOTING_GITHUB_ACTIONS.md)

---

## ✅ Checklist Final

Antes de ejecutar el deploy, verifica:

- [ ] Todos los secrets obligatorios están configurados
- [ ] La conexión SSH funciona (paso "Test SSH connection" pasa)
- [ ] Los valores de base de datos son correctos
- [ ] El `JWT_SECRET` tiene al menos 32 caracteres
- [ ] Las URLs están configuradas (si usas dominios)
- [ ] Has probado el workflow manualmente antes de hacer push a `main`

¡Listo! Con estos secrets configurados, el workflow de GitHub Actions podrá hacer el deploy automático a tu VPS de Hostinger. 🚀

