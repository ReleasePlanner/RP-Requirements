# 🚀 Inicio del Deployment - Requirements Management

## ⚡ Opción 1: Deployment Automático (Recomendado)

### Configurar variables y ejecutar

```bash
# Desde tu máquina local, configurar variables
export VPS_HOST=tu-vps-ip
export VPS_USER=root
export GIT_REPO_URL=https://github.com/tu-usuario/tu-repo.git
export VPS_SSH_KEY=~/.ssh/id_rsa  # Opcional, por defecto usa ~/.ssh/id_rsa

# Ejecutar script de deployment
./scripts/deploy-requirements-vps.sh
```

El script automáticamente:
1. ✅ Verifica conexión SSH
2. ✅ Ejecuta setup inicial del VPS
3. ✅ Clona el repositorio
4. ✅ Prepara archivo .env
5. ✅ Build y deploy de contenedores
6. ✅ Ejecuta migraciones
7. ✅ Verifica deployment

**Nota:** El script te pedirá que configures el `.env` manualmente antes de continuar.

---

## 🔧 Opción 2: Deployment Manual Paso a Paso

Si prefieres hacerlo manualmente, sigue estos pasos:

### Paso 1: Conectar al VPS

```bash
ssh root@tu-vps-ip
```

### Paso 2: Ejecutar Setup Inicial

```bash
# Copiar script al VPS
scp scripts/quick-start-vps.sh root@tu-vps-ip:/tmp/

# Conectar y ejecutar
ssh root@tu-vps-ip
bash /tmp/quick-start-vps.sh
```

### Paso 3: Clonar Repositorio

```bash
cd /opt/modules
git clone <tu-repo-github-url> requirements-management
cd requirements-management
```

### Paso 4: Configurar .env

```bash
cp env.docker.example .env
nano .env
```

**Valores críticos a cambiar:**
```env
DB_PASSWORD=<genera-con-openssl-rand-base64-32>
JWT_SECRET=<genera-con-openssl-rand-base64-48>
CORS_ORIGIN=https://requirements.beyondnet.cloud
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
```

**Generar passwords:**
```bash
openssl rand -base64 32  # Para DB_PASSWORD
openssl rand -base64 48  # Para JWT_SECRET
```

### Paso 5: Build y Deploy

```bash
# Usar docker-compose.prod.yml
cp docker-compose.prod.yml docker-compose.yml

# Build
docker-compose build

# Deploy
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Paso 6: Ejecutar Migraciones

```bash
# Esperar a que API esté lista (30-60 segundos)
sleep 60

# Ejecutar migraciones
docker-compose exec api npm run migration:run
```

### Paso 7: Verificar

```bash
# Ver estado
docker-compose ps

# Verificar API
curl http://localhost:3000/api/v1/health/liveness

# Verificar Portal
curl http://localhost:4200
```

### Paso 8: Configurar Nginx y SSL

Ver [QUICK_START_VPS.md](QUICK_START_VPS.md) - Paso 5

---

## 📋 Checklist Pre-Deployment

Antes de empezar, asegúrate de tener:

- [ ] Acceso SSH al VPS de Hostinger
- [ ] IP del VPS
- [ ] Clave SSH configurada (`~/.ssh/id_rsa` o similar)
- [ ] Repositorio en GitHub (público o con acceso SSH)
- [ ] Acceso al DNS de `beyondnet.cloud`
- [ ] Dominios configurados:
  - `requirements.beyondnet.cloud`
  - `requirements-api.beyondnet.cloud`

---

## 🚨 Troubleshooting Durante Deployment

### Error de conexión SSH
```bash
# Verificar que puedes conectar
ssh -v root@tu-vps-ip

# Verificar clave SSH
ssh-add -l
```

### Error al clonar repositorio
```bash
# Verificar que el repositorio es accesible
git ls-remote <tu-repo-url>

# Si es privado, configurar SSH en el VPS
ssh-keygen -t rsa -b 4096
# Agregar clave pública a GitHub
```

### Contenedores no inician
```bash
cd /opt/modules/requirements-management
docker-compose logs
docker-compose ps
```

### Error en migraciones
```bash
# Ver logs de API
docker-compose logs api

# Verificar conexión a base de datos
docker-compose exec postgres psql -U requirements_user -d requirements_db
```

---

## ✅ Post-Deployment

Una vez completado el deployment:

1. **Configurar DNS** (si no lo hiciste antes)
2. **Configurar Nginx** (ver QUICK_START_VPS.md)
3. **Configurar SSL** con Let's Encrypt
4. **Verificar acceso HTTPS**
5. **Configurar CI/CD** (opcional)

---

## 📚 Documentación de Referencia

- **[QUICK_START_VPS.md](QUICK_START_VPS.md)** - Guía rápida de 5 comandos
- **[PLAN_DEPLOYMENT_REQUIREMENTS.md](PLAN_DEPLOYMENT_REQUIREMENTS.md)** - Plan completo detallado

---

**¡Listo para empezar!** 🚀

Elige la opción que prefieras y sigue los pasos.

