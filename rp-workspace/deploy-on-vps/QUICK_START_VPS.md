# 🚀 Quick Start - Deployment VPS Hostinger

Guía rápida para desplegar Requirements Management en tu VPS de Hostinger.

## ⚡ Inicio Rápido (5 comandos)

### 1. Conectar al VPS y ejecutar setup inicial

```bash
# Conectar al VPS
ssh root@tu-vps-ip

# Ejecutar setup inicial (o copiar y ejecutar scripts/quick-start-vps.sh)
bash <(curl -s https://raw.githubusercontent.com/tu-usuario/tu-repo/main/scripts/quick-start-vps.sh)
```

**O manualmente:**
```bash
# Copiar script al VPS
scp scripts/quick-start-vps.sh root@tu-vps-ip:/tmp/
ssh root@tu-vps-ip "bash /tmp/quick-start-vps.sh"
```

### 2. Clonar repositorio

```bash
cd /opt/modules
git clone <tu-repo-github-url> requirements-management
cd requirements-management
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp env.docker.example .env

# Editar con tus valores
nano .env
```

**Valores mínimos requeridos:**
```env
DB_USERNAME=requirements_user
DB_PASSWORD=<genera-un-password-fuerte>
JWT_SECRET=<genera-un-secret-min-32-caracteres>
CORS_ORIGIN=https://requirements.beyondnet.cloud
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
```

**Generar passwords:**
```bash
# Password para base de datos
openssl rand -base64 32

# JWT Secret
openssl rand -base64 48
```

### 4. Build y Deploy

```bash
# Usar docker-compose.prod.yml (sin puertos externos)
cp docker-compose.prod.yml docker-compose.yml

# Build
docker-compose build

# Deploy
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 5. Configurar Nginx y SSL

```bash
# Crear configuración Nginx
sudo nano /etc/nginx/sites-available/requirements-management.conf
```

**Pegar esta configuración:**

```nginx
# Requirements Management Portal
server {
    listen 80;
    server_name requirements.beyondnet.cloud;

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Requirements Management API
server {
    listen 80;
    server_name requirements-api.beyondnet.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Habilitar y configurar SSL:**

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/requirements-management.conf /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx

# Obtener certificados SSL
sudo certbot --nginx -d requirements.beyondnet.cloud -d requirements-api.beyondnet.cloud
```

### 6. Ejecutar migraciones

```bash
cd /opt/modules/requirements-management

# Esperar a que la API esté lista
sleep 60

# Ejecutar migraciones
docker-compose exec api npm run migration:run
```

### 7. Verificar

```bash
# Verificar contenedores
docker-compose ps

# Verificar API
curl http://localhost:3000/api/v1/health/liveness

# Verificar Portal
curl http://localhost:4200

# Verificar HTTPS (desde tu navegador)
# https://requirements.beyondnet.cloud
# https://requirements-api.beyondnet.cloud/api/v1/health/liveness
```

## ✅ Checklist Rápido

- [ ] VPS accesible vía SSH
- [ ] Setup inicial ejecutado
- [ ] Repositorio clonado
- [ ] `.env` configurado
- [ ] Contenedores corriendo (`docker-compose ps`)
- [ ] DNS configurado (`requirements.beyondnet.cloud` y `requirements-api.beyondnet.cloud`)
- [ ] Nginx configurado y funcionando
- [ ] SSL funcionando
- [ ] Migraciones ejecutadas
- [ ] Portal accesible vía HTTPS
- [ ] API accesible vía HTTPS

## 🚨 Troubleshooting Rápido

### Contenedores no inician
```bash
cd /opt/modules/requirements-management
docker-compose logs
docker-compose ps
```

### Error de conexión a base de datos
```bash
docker-compose exec postgres psql -U requirements_user -d requirements_db
docker-compose logs postgres
```

### Nginx no funciona
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
sudo systemctl reload nginx
```

### SSL no funciona
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

## 📚 Documentación Completa

Para más detalles, ver:
- **[PLAN_DEPLOYMENT_REQUIREMENTS.md](PLAN_DEPLOYMENT_REQUIREMENTS.md)** - Plan completo paso a paso

## 🎯 Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Actualizar código
git pull
docker-compose build
docker-compose up -d

# Backup de base de datos
docker-compose exec -T postgres pg_dump -U requirements_user requirements_db > /opt/backups/backup_$(date +%Y%m%d).sql
```

---

**¡Listo para empezar!** 🚀

