# 📋 Plan de Deployment en VPS Hostinger

Plan completo y estructurado para desplegar múltiples módulos independientes (Requirements Management, Release Planner, etc.) en un VPS de Hostinger.

## 🎯 Objetivo

Desplegar múltiples módulos independientes en un solo VPS físico, donde cada módulo tiene:

- Portal Web (Next.js)
- API (NestJS)
- Base de datos PostgreSQL (independiente por módulo)
- Comunicación entre módulos vía REST API y Service Bus
  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

## 📊 Arquitectura Objetivo

```
VPS Hostinger (Servidor Físico)
│
├── Nginx (Reverse Proxy + SSL)
│   ├── requirements.beyondnet.cloud → Requirements Portal
│   ├── requirements-api.beyondnet.cloud → Requirements API
│   ├── release-planner.beyondnet.cloud → Release Planner Portal
│   ├── release-planner-api.beyondnet.cloud → Release Planner API
│   └── ... (más módulos)
│
├── Service Bus (RabbitMQ)
│   └── Comunicación asíncrona entre módulos
│
└── Docker Containers (Múltiples módulos)
    ├── Módulo: Requirements Management
    │   ├── requirements-portal (Next.js) - Puerto interno: 4200
    │   ├── requirements-api (NestJS) - Puerto interno: 3000
    │   └── requirements-db (PostgreSQL) - Puerto interno: 5432
    │
    ├── Módulo: Release Planner
    │   ├── release-planner-portal (Next.js) - Puerto interno: 4201
    │   ├── release-planner-api (NestJS) - Puerto interno: 3001
    │   └── release-planner-db (PostgreSQL) - Puerto interno: 5433
    │
    └── ... (más módulos)
```

## 📅 Fases del Plan

### FASE 1: Preparación y Configuración Inicial del VPS ⏱️ ~2 horas

#### 1.1 Acceso y Verificación del VPS

- [ ] Acceder al VPS vía SSH
- [ ] Verificar sistema operativo (Ubuntu 20.04+ o Debian 11+)
- [ ] Verificar recursos disponibles (RAM, CPU, Disco)
- [ ] Verificar IP pública y conectividad

**Comandos:**

```bash
ssh root@tu-vps-ip
uname -a
free -h
df -h
```

#### 1.2 Instalación de Software Base

- [ ] Actualizar sistema operativo
- [ ] Instalar Docker
- [ ] Instalar Docker Compose
- [ ] Instalar Nginx
- [ ] Instalar Certbot (para SSL)
- [ ] Configurar firewall (UFW)

**Script:** `scripts/setup-vps.sh` (ya creado)

**Comandos manuales:**

```bash
# Ejecutar script de setup
bash scripts/setup-vps.sh

# O manualmente:
apt update && apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
apt install nginx certbot python3-certbot-nginx -y
ufw allow 22,80,443/tcp && ufw enable
```

#### 1.3 Estructura de Directorios

- [ ] Crear estructura de directorios en `/opt/`
- [ ] Configurar permisos adecuados
- [ ] Crear scripts de gestión

**Estructura:**

```
/opt/
├── modules/              # Módulos desplegados
│   ├── requirements-management/
│   ├── release-planner/
│   └── ...
├── service-bus/          # RabbitMQ compartido
├── scripts/              # Scripts de gestión
└── backups/              # Backups de bases de datos
```

**Comandos:**

```bash
mkdir -p /opt/{modules,service-bus,scripts,backups}
chmod 755 /opt/modules
```

---

### FASE 2: Configuración del Service Bus ⏱️ ~30 minutos

#### 2.1 Instalación de RabbitMQ

- [ ] Crear `docker-compose.yml` para RabbitMQ
- [ ] Configurar variables de entorno
- [ ] Iniciar RabbitMQ
- [ ] Verificar funcionamiento
- [ ] Configurar red compartida para módulos

**Archivo:** `/opt/service-bus/docker-compose.yml`

**Comandos:**

```bash
cd /opt/service-bus
# Crear docker-compose.yml (ver docs/DEPLOYMENT_MULTI_MODULE.md)
docker-compose up -d
docker-compose ps
# Acceder a Management UI: http://tu-vps-ip:15672
```

#### 2.2 Configuración de Red Compartida

- [ ] Crear red Docker compartida `service-bus-network`
- [ ] Verificar que todos los módulos puedan conectarse

**Comando:**

```bash
docker network create service-bus-network
docker network ls
```

---

### FASE 3: Deployment del Primer Módulo (Requirements Management) ⏱️ ~1 hora

#### 3.1 Preparación del Repositorio

- [ ] Clonar repositorio en VPS
- [ ] Configurar variables de entorno (`.env`)
- [ ] Ajustar `docker-compose.yml` para producción

**Comandos:**

```bash
cd /opt/modules
git clone <tu-repo-github> requirements-management
cd requirements-management
cp env.docker.example .env
nano .env  # Configurar valores de producción
```

**Variables críticas en `.env`:**

```env
# API
NODE_ENV=production
PORT=3000

# Database
DB_USERNAME=requirements_user
DB_PASSWORD=<password-fuerte>
DB_DATABASE=requirements_db

# JWT
JWT_SECRET=<secret-min-32-caracteres>

# CORS
CORS_ORIGIN=https://requirements.beyondnet.cloud

# Portal
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1

# Service Bus
SERVICE_BUS_URL=amqp://admin:password@service-bus-rabbitmq:5672
```

#### 3.2 Ajustes en docker-compose.yml

- [ ] Remover mapeo de puertos externos (usar Nginx)
- [ ] Configurar red compartida para Service Bus
- [ ] Configurar volúmenes persistentes
- [ ] Configurar restart policies

**Cambios necesarios:**

```yaml
# Remover ports de api y portal
# Agregar network compartida:
networks:
  rp-network:
    driver: bridge
  service-bus-network:
    external: true
```

#### 3.3 Build y Deploy

- [ ] Construir imágenes Docker
- [ ] Iniciar contenedores
- [ ] Ejecutar migraciones de base de datos
- [ ] Verificar logs y estado

**Comandos:**

```bash
cd /opt/modules/requirements-management
docker-compose build
docker-compose up -d
docker-compose logs -f  # Verificar logs
docker-compose exec api npm run migration:run
docker-compose ps  # Verificar estado
```

#### 3.4 Verificación Local

- [ ] Verificar que API responde internamente
- [ ] Verificar que Portal responde internamente
- [ ] Verificar conexión a base de datos

**Comandos:**

```bash
# Desde el VPS
curl http://localhost:3000/api/v1/health/liveness
curl http://localhost:4200
docker-compose exec postgres psql -U requirements_user -d requirements_db -c "SELECT 1;"
```

---

### FASE 4: Configuración de Nginx ⏱️ ~1 hora

#### 4.1 Configuración de Dominios

- [ ] Configurar DNS (A records) apuntando a IP del VPS
- [ ] Verificar resolución DNS
- [ ] Crear configuración Nginx para cada servicio

**DNS Records necesarios:**

```
requirements.beyondnet.cloud → IP_VPS
requirements-api.beyondnet.cloud → IP_VPS
release-planner.beyondnet.cloud → IP_VPS
release-planner-api.beyondnet.cloud → IP_VPS
```

#### 4.2 Configuración Nginx para Requirements Management

- [ ] Crear configuración para Portal
- [ ] Crear configuración para API
- [ ] Habilitar configuración
- [ ] Verificar sintaxis
- [ ] Recargar Nginx

**Archivo:** `/etc/nginx/sites-available/requirements-management.conf`

**Comandos:**

```bash
sudo nano /etc/nginx/sites-available/requirements-management.conf
sudo ln -s /etc/nginx/sites-available/requirements-management.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4.3 Configuración SSL con Let's Encrypt

- [ ] Obtener certificados SSL
- [ ] Configurar renovación automática
- [ ] Verificar HTTPS funcionando

**Comandos:**

```bash
sudo certbot --nginx -d requirements.beyondnet.cloud -d requirements-api.beyondnet.cloud
sudo certbot renew --dry-run  # Verificar renovación automática
```

---

### FASE 5: Deployment de Módulos Adicionales ⏱️ ~45 minutos por módulo

#### 5.1 Release Planner (Ejemplo)

- [ ] Clonar repositorio
- [ ] Configurar `.env` con puertos diferentes
- [ ] Ajustar `docker-compose.yml` (puertos internos diferentes)
- [ ] Build y deploy
- [ ] Configurar Nginx
- [ ] Configurar SSL

**Puertos internos sugeridos:**

- Release Planner Portal: 4201
- Release Planner API: 3001
- Release Planner DB: 5433

**Comandos:**

```bash
cd /opt/modules
git clone <release-planner-repo> release-planner
cd release-planner
# Configurar .env con puertos diferentes
docker-compose build && docker-compose up -d
```

#### 5.2 Repetir para cada módulo adicional

- [ ] Seguir mismo proceso
- [ ] Usar puertos internos únicos
- [ ] Configurar dominios únicos
- [ ] Configurar SSL

---

### FASE 6: Integración Service Bus ⏱️ ~1 hora

#### 6.1 Configuración en APIs

- [ ] Instalar cliente RabbitMQ en cada API
- [ ] Configurar conexión a Service Bus
- [ ] Crear servicios de mensajería
- [ ] Implementar publishers y consumers

**Ejemplo de configuración:**

```typescript
// En cada API
import { connect } from "amqplib";

const serviceBusUrl = process.env.SERVICE_BUS_URL;
const connection = await connect(serviceBusUrl);
```

#### 6.2 Testing de Comunicación

- [ ] Enviar mensaje desde Requirements API
- [ ] Recibir mensaje en Release Planner API
- [ ] Verificar en RabbitMQ Management UI

---

### FASE 7: CI/CD con GitHub Actions ⏱️ ~1 hora

#### 7.1 Configuración de Secrets en GitHub

- [ ] Agregar `VPS_HOST` (IP del VPS)
- [ ] Agregar `VPS_USER` (usuario SSH)
- [ ] Agregar `VPS_SSH_KEY` (clave privada SSH)
- [ ] Agregar otros secrets necesarios

**En GitHub:** Settings → Secrets and variables → Actions

#### 7.2 Crear Workflow de Deployment

- [ ] Crear `.github/workflows/deploy-vps.yml`
- [ ] Configurar trigger (push a main)
- [ ] Configurar SSH deployment
- [ ] Probar deployment automático

**Workflow básico:**

```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/modules/requirements-management
            git pull
            docker-compose build
            docker-compose up -d
```

---

### FASE 8: Monitoreo y Logs ⏱️ ~1 hora

#### 8.1 Configuración de Logs

- [ ] Configurar rotación de logs
- [ ] Configurar agregación de logs (opcional)
- [ ] Verificar acceso a logs

**Comandos:**

```bash
# Ver logs de un módulo
cd /opt/modules/requirements-management
docker-compose logs -f

# Ver logs de todos los módulos
/opt/scripts/logs-all.sh
```

#### 8.2 Health Checks

- [ ] Verificar endpoints de health de cada API
- [ ] Configurar monitoreo básico (opcional)
- [ ] Configurar alertas (opcional)

**Endpoints:**

- `/api/v1/health/liveness`
- `/api/v1/health/readiness`
- `/api/v1/monitoring/health/detailed`

---

### FASE 9: Backups y Seguridad ⏱️ ~1 hora

#### 9.1 Configuración de Backups

- [ ] Crear script de backup de bases de datos
- [ ] Configurar cron para backups diarios
- [ ] Verificar restauración de backups

**Script:** `/opt/scripts/backup-databases.sh` (ya creado)

**Cron:**

```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * /opt/scripts/backup-databases.sh
```

#### 9.2 Seguridad

- [ ] Verificar firewall configurado
- [ ] Verificar SSL en todos los dominios
- [ ] Cambiar passwords por defecto
- [ ] Configurar fail2ban (opcional)
- [ ] Revisar permisos de archivos

---

### FASE 10: Documentación y Handoff ⏱️ ~30 minutos

#### 10.1 Documentación

- [ ] Documentar estructura de directorios
- [ ] Documentar comandos de gestión
- [ ] Documentar procedimientos de backup/restore
- [ ] Documentar troubleshooting común

#### 10.2 Scripts de Gestión

- [ ] Verificar scripts de gestión funcionando
- [ ] Documentar uso de scripts
- [ ] Crear alias útiles (opcional)

**Scripts disponibles:**

- `/opt/scripts/manage-modules.sh <module> <action>`
- `/opt/scripts/status-all.sh`
- `/opt/scripts/backup-databases.sh`

---

## 📝 Checklist de Deployment por Módulo

Para cada nuevo módulo, seguir este checklist:

### Pre-Deployment

- [ ] Repositorio clonado en `/opt/modules/<module-name>`
- [ ] `.env` configurado con valores de producción
- [ ] `docker-compose.yml` ajustado (sin puertos externos, red compartida)
- [ ] Puertos internos únicos asignados

### Deployment

- [ ] `docker-compose build` ejecutado exitosamente
- [ ] `docker-compose up -d` ejecutado exitosamente
- [ ] Migraciones ejecutadas
- [ ] Logs verificados sin errores críticos
- [ ] Health checks pasando

### Post-Deployment

- [ ] Nginx configurado y habilitado
- [ ] SSL configurado y funcionando
- [ ] Dominio accesible desde internet
- [ ] API accesible desde Portal
- [ ] Service Bus conectado (si aplica)

---

## 🔧 Comandos de Gestión Diaria

### Ver estado de todos los módulos

```bash
/opt/scripts/status-all.sh
```

### Gestionar un módulo específico

```bash
# Iniciar
/opt/scripts/manage-modules.sh requirements-management start

# Detener
/opt/scripts/manage-modules.sh requirements-management stop

# Reiniciar
/opt/scripts/manage-modules.sh requirements-management restart

# Ver logs
/opt/scripts/manage-modules.sh requirements-management logs

# Actualizar (git pull + rebuild)
/opt/scripts/manage-modules.sh requirements-management update
```

### Ver logs de todos los módulos

```bash
/opt/scripts/logs-all.sh
```

### Backup manual

```bash
/opt/scripts/backup-databases.sh
```

### Verificar SSL

```bash
sudo certbot certificates
```

### Verificar Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

---

## 🚨 Troubleshooting Común

### Módulo no inicia

```bash
cd /opt/modules/<module-name>
docker-compose logs
docker-compose ps
docker-compose down && docker-compose up -d
```

### Error de conexión a base de datos

```bash
docker-compose exec postgres psql -U <user> -d <database>
docker-compose logs postgres
```

### Error de Nginx

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
sudo systemctl reload nginx
```

### Puerto en uso

```bash
sudo netstat -tulpn | grep :<port>
docker ps | grep <port>
```

### Service Bus no conecta

```bash
cd /opt/service-bus
docker-compose logs rabbitmq
docker-compose ps
```

---

## 📊 Estimación de Tiempo Total

| Fase                            | Tiempo Estimado                |
| ------------------------------- | ------------------------------ |
| Fase 1: Preparación VPS         | 2 horas                        |
| Fase 2: Service Bus             | 30 minutos                     |
| Fase 3: Primer Módulo           | 1 hora                         |
| Fase 4: Nginx                   | 1 hora                         |
| Fase 5: Módulos Adicionales     | 45 min/módulo                  |
| Fase 6: Service Bus Integration | 1 hora                         |
| Fase 7: CI/CD                   | 1 hora                         |
| Fase 8: Monitoreo               | 1 hora                         |
| Fase 9: Backups/Seguridad       | 1 hora                         |
| Fase 10: Documentación          | 30 minutos                     |
| **TOTAL**                       | **~10 horas** (para 2 módulos) |

---

## ✅ Criterios de Éxito

- [ ] Todos los módulos desplegados y funcionando
- [ ] Todos los dominios accesibles vía HTTPS
- [ ] Service Bus funcionando y módulos comunicándose
- [ ] Backups automáticos configurados
- [ ] CI/CD funcionando
- [ ] Monitoreo básico funcionando
- [ ] Documentación completa

---

## 📚 Recursos Adicionales

- [Guía Completa de Deployment Multi-Módulo](DEPLOYMENT_MULTI_MODULE.md)
- [Scripts de Deployment](scripts/)
- [Documentación de Docker Compose](README_DOCKER.md)
- [Documentación de CI/CD](CI_CD.md)

---

**Última actualización:** $(date)
**Versión del Plan:** 1.0
