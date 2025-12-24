# 📋 Plan de Deployment - Requirements Management en VPS Hostinger

Plan simplificado para desplegar **solo el módulo de Requirements Management** en tu VPS de Hostinger.

> 💡 **¿Quieres empezar rápido?** Ver [QUICK_START_VPS.md](QUICK_START_VPS.md) para una guía de 5 comandos.

## 🎯 Objetivo

Desplegar el módulo Requirements Management (Portal + API + PostgreSQL) en el VPS de Hostinger con dominio `beyondnet.cloud`.

## 📊 Arquitectura Simplificada

```
VPS Hostinger
│
├── Nginx (Reverse Proxy + SSL)
│   ├── requirements.beyondnet.cloud → Requirements Portal
│   └── requirements-api.beyondnet.cloud → Requirements API
│
└── Docker Containers
    ├── requirements-portal (Next.js) - Puerto interno: 4200
    ├── requirements-api (NestJS) - Puerto interno: 3000
    └── requirements-db (PostgreSQL) - Puerto interno: 5432
```

## ⏱️ Timeline Estimado

**Total: ~4-5 horas**

| Fase | Descripción | Tiempo |
|------|-------------|--------|
| Fase 1 | Preparación VPS | 1 hora |
| Fase 2 | Deployment del Módulo | 1 hora |
| Fase 3 | Configuración Nginx + SSL | 1 hora |
| Fase 4 | Verificación y Ajustes | 30 min |
| Fase 5 | CI/CD (Opcional) | 1 hora |

## 📋 Checklist Completo

### ✅ FASE 1: Preparación del VPS (1 hora)

#### 1.1 Acceso al VPS
- [ ] Acceder al VPS vía SSH
- [ ] Verificar sistema operativo
- [ ] Verificar recursos (RAM, CPU, Disco)

**Comandos:**
```bash
ssh root@tu-vps-ip
uname -a
free -h
df -h
```

#### 1.2 Instalación de Software Base
- [ ] Ejecutar script de setup inicial

**Opción A: Usar script automático**
```bash
# Desde tu máquina local
scp scripts/setup-vps.sh root@tu-vps-ip:/tmp/
ssh root@tu-vps-ip "bash /tmp/setup-vps.sh"
```

**Opción B: Instalación manual**
```bash
# En el VPS
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Nginx y Certbot
apt install nginx certbot python3-certbot-nginx -y

# Configurar firewall
ufw allow 22,80,443/tcp
ufw enable
```

#### 1.3 Crear Estructura de Directorios
```bash
mkdir -p /opt/modules/requirements-management
mkdir -p /opt/backups
chmod 755 /opt/modules
```

---

### ✅ FASE 2: Deployment del Módulo (1 hora)

#### 2.1 Clonar Repositorio
```bash
cd /opt/modules
git clone <tu-repo-github-url> requirements-management
cd requirements-management
```

#### 2.2 Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp env.docker.example .env

# Editar con tus valores
nano .env
```

**Configuración mínima requerida en `.env`:**

```env
# ============================================
# Server Configuration
# ============================================
NODE_ENV=production
PORT=3000

# ============================================
# Database Configuration
# ============================================
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=requirements_user
DB_PASSWORD=<GENERA_UN_PASSWORD_FUERTE_AQUI>
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET=<GENERA_UN_SECRET_MIN_32_CARACTERES>
JWT_EXPIRES_IN=1d

# ============================================
# CORS Configuration
# ============================================
CORS_ORIGIN=https://requirements.beyondnet.cloud

# ============================================
# Portal Configuration
# ============================================
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
PORTAL_PORT=4200

# ============================================
# Monitoring
# ============================================
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
LOG_LEVEL=info
```

**Generar passwords seguros:**
```bash
# Generar password para base de datos
openssl rand -base64 32

# Generar JWT secret
openssl rand -base64 48
```

#### 2.3 Ajustar docker-compose.yml para Producción

**Cambios necesarios:**

1. **Remover mapeo de puertos externos** (usaremos Nginx):
```yaml
# REMOVER estas líneas de api y portal:
# ports:
#   - "${API_PORT:-3000}:3000"
#   - "${PORTAL_PORT:-4200}:4200"
```

2. **Mantener puerto de PostgreSQL solo interno** (ya está bien configurado)

El `docker-compose.yml` debería quedar así para producción:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: rp-requirements-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_DATABASE:-requirements_db}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - rp-network
    # Sin mapeo de puerto externo (solo interno)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-postgres} -d ${DB_DATABASE:-requirements_db}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: rp-requirements-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:-postgres}
      DB_DATABASE: ${DB_DATABASE:-requirements_db}
      DB_SYNCHRONIZE: ${DB_SYNCHRONIZE:-false}
      DB_LOGGING: ${DB_LOGGING:-false}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-1d}
      CORS_ORIGIN: ${CORS_ORIGIN}
      ENABLE_MONITORING: ${ENABLE_MONITORING:-true}
      METRICS_RETENTION_MS: ${METRICS_RETENTION_MS:-3600000}
    networks:
      - rp-network
    # Sin mapeo de puerto externo (Nginx hará proxy)
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/v1/health/liveness', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    volumes:
      - api_logs:/app/logs

  portal:
    build:
      context: .
      dockerfile: apps/portal/Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    container_name: rp-requirements-portal
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      PORT: 4200
    networks:
      - rp-network
    # Sin mapeo de puerto externo (Nginx hará proxy)
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4200"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

networks:
  rp-network:
    driver: bridge

volumes:
  postgres_data:
    name: rp-requirements-postgres-data
    driver: local
  api_logs:
    name: rp-requirements-api-logs
    driver: local
```

#### 2.4 Build y Deploy
```bash
cd /opt/modules/requirements-management

# Build de imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# En otra terminal, verificar estado
docker-compose ps
```

#### 2.5 Ejecutar Migraciones
```bash
# Esperar a que la API esté lista (30-60 segundos)
sleep 60

# Ejecutar migraciones
docker-compose exec api npm run migration:run

# (Opcional) Seed de datos iniciales
docker-compose exec api npm run seed:run
```

#### 2.6 Verificación Local
```bash
# Verificar API responde internamente
curl http://localhost:3000/api/v1/health/liveness

# Verificar Portal responde internamente
curl http://localhost:4200

# Verificar base de datos
docker-compose exec postgres psql -U requirements_user -d requirements_db -c "SELECT 1;"
```

---

### ✅ FASE 3: Configuración Nginx + SSL (1 hora)

#### 3.1 Configurar DNS

**En tu proveedor de DNS (donde gestionas beyondnet.cloud):**

Crear los siguientes registros A:
```
requirements.beyondnet.cloud        → IP_DEL_VPS
requirements-api.beyondnet.cloud    → IP_DEL_VPS
```

**Verificar DNS:**
```bash
# Desde tu máquina local
nslookup requirements.beyondnet.cloud
nslookup requirements-api.beyondnet.cloud
```

#### 3.2 Crear Configuración Nginx

**Crear archivo:** `/etc/nginx/sites-available/requirements-management.conf`

```bash
sudo nano /etc/nginx/sites-available/requirements-management.conf
```

**Contenido:**

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

#### 3.3 Habilitar Configuración
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/requirements-management.conf /etc/nginx/sites-enabled/

# Verificar sintaxis
sudo nginx -t

# Si todo está bien, recargar Nginx
sudo systemctl reload nginx
```

#### 3.4 Configurar SSL con Let's Encrypt
```bash
# Obtener certificados SSL
sudo certbot --nginx -d requirements.beyondnet.cloud -d requirements-api.beyondnet.cloud

# Seguir las instrucciones interactivas:
# - Email: tu email
# - Aceptar términos
# - Opción 2: Redirect (recomendado)

# Verificar renovación automática
sudo certbot renew --dry-run
```

**Verificar SSL:**
```bash
# Ver certificados instalados
sudo certbot certificates

# Probar acceso HTTPS
curl https://requirements.beyondnet.cloud
curl https://requirements-api.beyondnet.cloud/api/v1/health/liveness
```

---

### ✅ FASE 4: Verificación Final (30 minutos)

#### 4.1 Verificar Portal
- [ ] Acceder a `https://requirements.beyondnet.cloud`
- [ ] Verificar que carga correctamente
- [ ] Verificar que puede conectarse a la API

#### 4.2 Verificar API
- [ ] Acceder a `https://requirements-api.beyondnet.cloud/api/v1/health/liveness`
- [ ] Verificar Swagger: `https://requirements-api.beyondnet.cloud/api/docs`
- [ ] Probar login desde el Portal

#### 4.3 Verificar Logs
```bash
cd /opt/modules/requirements-management

# Logs de API
docker-compose logs api --tail=50

# Logs de Portal
docker-compose logs portal --tail=50

# Logs de PostgreSQL
docker-compose logs postgres --tail=50
```

#### 4.4 Verificar Estado de Contenedores
```bash
docker-compose ps

# Deberías ver:
# - rp-requirements-postgres: Up
# - rp-requirements-api: Up (healthy)
# - rp-requirements-portal: Up (healthy)
```

---

### ✅ FASE 5: CI/CD (Opcional - 1 hora)

#### 5.1 Configurar Secrets en GitHub

**En GitHub:** Settings → Secrets and variables → Actions

Agregar los siguientes secrets:
- `VPS_HOST`: IP de tu VPS
- `VPS_USER`: usuario SSH (normalmente `root`)
- `VPS_SSH_KEY`: clave privada SSH

#### 5.2 Crear Workflow de Deployment

**Crear archivo:** `.github/workflows/deploy-vps.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/modules/requirements-management
            git pull origin main
            docker-compose build
            docker-compose up -d
            docker-compose exec -T api npm run migration:run || echo "Migrations skipped"
            echo "✅ Deployment completed!"
```

#### 5.3 Probar Deployment Automático
```bash
# Hacer un cambio pequeño y hacer push
git commit --allow-empty -m "Test deployment"
git push origin main

# Verificar en GitHub Actions que el workflow se ejecuta
```

---

## 🛠️ Comandos de Gestión Diaria

### Ver estado
```bash
cd /opt/modules/requirements-management
docker-compose ps
```

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo API
docker-compose logs -f api

# Solo Portal
docker-compose logs -f portal
```

### Reiniciar servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo API
docker-compose restart api

# Reiniciar solo Portal
docker-compose restart portal
```

### Actualizar código
```bash
cd /opt/modules/requirements-management
git pull
docker-compose build
docker-compose up -d
```

### Backup de base de datos
```bash
cd /opt/modules/requirements-management
docker-compose exec -T postgres pg_dump -U requirements_user requirements_db > /opt/backups/requirements_$(date +%Y%m%d_%H%M%S).sql
```

---

## 🚨 Troubleshooting

### Portal no carga
```bash
# Verificar logs
docker-compose logs portal

# Verificar que está corriendo
docker-compose ps portal

# Reiniciar
docker-compose restart portal
```

### API no responde
```bash
# Verificar logs
docker-compose logs api

# Verificar health check
curl http://localhost:3000/api/v1/health/liveness

# Reiniciar
docker-compose restart api
```

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Verificar logs
docker-compose logs postgres

# Probar conexión
docker-compose exec postgres psql -U requirements_user -d requirements_db
```

### Nginx no funciona
```bash
# Verificar sintaxis
sudo nginx -t

# Ver logs de error
sudo tail -f /var/log/nginx/error.log

# Recargar configuración
sudo systemctl reload nginx
```

### SSL no funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente si es necesario
sudo certbot renew

# Verificar que Nginx está usando SSL
sudo nginx -t
```

---

## ✅ Checklist Final

- [ ] VPS preparado con Docker y Nginx
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Contenedores corriendo
- [ ] Migraciones ejecutadas
- [ ] DNS configurado
- [ ] Nginx configurado
- [ ] SSL funcionando
- [ ] Portal accesible vía HTTPS
- [ ] API accesible vía HTTPS
- [ ] Login funcionando
- [ ] CI/CD configurado (opcional)

---

## 📚 Próximos Pasos

Una vez que este módulo esté funcionando correctamente:

1. **Monitoreo**: Configurar alertas y dashboards
2. **Backups automáticos**: Configurar cron para backups diarios
3. **Logs centralizados**: Configurar agregación de logs
4. **Otros módulos**: Cuando estés listo, seguir el mismo proceso para Release Planner y otros módulos

---

**¡Listo para empezar!** 🚀

Sigue las fases en orden y marca cada checklist conforme avances.

