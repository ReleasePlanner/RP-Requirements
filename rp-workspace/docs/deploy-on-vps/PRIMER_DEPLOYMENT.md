# 🚀 Primer Deployment - Guía Rápida

Ya tienes todo configurado. Aquí está cómo hacer tu primer deployment automático.

## ✅ Checklist Pre-Deployment

Asegúrate de tener configurados estos secrets en GitHub:

- [x] `VPS_HOST` = 72.60.63.240
- [x] `VPS_USER` = root
- [x] `VPS_SSH_PASSWORD` = (tu contraseña SSH)
- [x] `DB_USERNAME` = (usuario de base de datos)
- [x] `DB_PASSWORD` = (contraseña de base de datos)
- [x] `DB_DATABASE` = requirements_db
- [x] `JWT_SECRET` = (secret mínimo 32 caracteres)
- [x] `NEXT_PUBLIC_API_URL_DEV` = (URL de desarrollo, opcional)
- [x] `NEXT_PUBLIC_API_URL_PRODUCTION` = (URL de producción, opcional)

## 🎯 Opción 1: Deployment Automático (Recomendado)

### Para Desarrollo (develop branch)

```bash
# 1. Asegúrate de estar en la rama develop
git checkout develop

# 2. Haz un cambio pequeño (o usa el commit actual)
git add .
git commit -m "chore: trigger deployment to development"

# 3. Push a GitHub
git push origin develop
```

**El workflow se ejecutará automáticamente** y desplegará en el VPS.

### Para Producción (main branch)

```bash
# 1. Cambia a la rama main
git checkout main

# 2. Merge desde develop (si aplica)
git merge develop

# 3. Push a GitHub
git push origin main
```

**El workflow se ejecutará automáticamente** y desplegará en producción.

## 🎯 Opción 2: Deployment Manual

Si prefieres ejecutar el deployment manualmente:

1. Ve a tu repositorio en GitHub
2. Click en **Actions** (arriba)
3. En el menú lateral, selecciona **Deploy to Hostinger VPS**
4. Click en **Run workflow** (botón azul arriba a la derecha)
5. Selecciona:
   - **Use workflow from**: `main` o `develop`
   - **Environment**: `development` o `production`
   - **Skip tests**: Dejar en `false` (recomendado)
6. Click en **Run workflow**

## 📊 Monitorear el Deployment

### En GitHub Actions

1. Ve a **Actions** en GitHub
2. Verás el workflow ejecutándose:
   - ✅ **Pre-Deployment Integrity Check** - Lint, tests, builds
   - 🚀 **Deploy to Hostinger VPS** - Deployment real
   - 🔍 **Verify deployment** - Health checks
   - 📢 **Notify Deployment Status** - Notificación final

### En el VPS

Conecta al VPS para ver los logs en tiempo real:

```bash
ssh root@72.60.63.240

# Ver logs de Docker Compose
cd /opt/modules/requirements-management
docker-compose logs -f

# Ver estado de los servicios
docker-compose ps
```

## 🔍 Verificar que Funcionó

### 1. Verificar en GitHub Actions

- ✅ Todos los jobs deben estar en verde
- ✅ El último paso debe decir "Deployment successful"

### 2. Verificar en el VPS

```bash
ssh root@72.60.63.240

# Ver servicios corriendo
docker-compose ps

# Deberías ver:
# - postgres (healthy)
# - api (healthy)
# - portal (healthy)
```

### 3. Verificar Endpoints

```bash
# API Health Check
curl http://72.60.63.240:3000/api/v1/health/liveness

# Portal (si está configurado)
curl http://72.60.63.240:4200
```

## 🐛 Troubleshooting

### Error: "SSH connection failed"

**Solución**:
```bash
# Verificar conexión manualmente
ssh root@72.60.63.240

# Si falla, verificar:
# 1. IP correcta en VPS_HOST
# 2. Contraseña correcta en VPS_SSH_PASSWORD
```

### Error: "Docker is not installed"

**Solución**:
```bash
# Conectar al VPS e instalar Docker
ssh root@72.60.63.240
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Error: "Permission denied"

**Solución**:
```bash
# Verificar permisos en VPS
ssh root@72.60.63.240
sudo mkdir -p /opt/modules
sudo chown -R root:root /opt/modules
```

### Error: "Git clone failed"

**Solución**:
- Verificar que el repositorio sea público, o
- Configurar Deploy Key en GitHub:
  1. GitHub > Settings > Deploy keys > Add deploy key
  2. Copiar clave pública SSH del VPS
  3. Agregar al repositorio

## 📝 Próximos Pasos

Después del primer deployment exitoso:

1. ✅ **Configurar dominio** (si aplica)
   - `requirements.beyondnet.cloud` → Portal
   - `requirements-api.beyondnet.cloud` → API

2. ✅ **Configurar SSL** con Certbot
   ```bash
   sudo certbot --nginx -d requirements.beyondnet.cloud
   ```

3. ✅ **Configurar monitoreo** (ya está incluido)
   - Accede a `/portal/monitoring` para ver métricas

4. ✅ **Configurar backups** de base de datos
   ```bash
   # Agregar cron job para backups diarios
   ```

## 🎉 ¡Listo!

Una vez que el primer deployment sea exitoso, cada push a `main` o `develop` desplegará automáticamente.

**No necesitas hacer nada más** - GitHub Actions se encargará de todo.

---

**¿Problemas?** Revisa los logs en GitHub Actions o consulta [TROUBLESHOOTING_SSH.md](TROUBLESHOOTING_SSH.md)

