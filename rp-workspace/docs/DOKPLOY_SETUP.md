# 🚀 Configuración Dokploy para Monorepo

## 📋 Guía Rápida de Configuración

Esta guía te ayudará a configurar todos los servicios en Dokploy de forma sencilla.

---

## 🎯 Compose Paths por Servicio

### Tabla de Referencia Rápida

| Servicio | Compose Path | Context | Variables Requeridas |
|----------|-------------|---------|---------------------|
| **PostgreSQL** | `services/postgres/docker-compose.yml` | `.` | `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` |
| **RabbitMQ** | `services/rabbitmq/docker-compose.yml` | `.` | `RABBITMQ_USER`, `RABBITMQ_PASSWORD` |
| **API** | `services/api/docker-compose.yml` | `.` | Ver [Variables API](#variables-api) |
| **Portal** | `services/portal/docker-compose.yml` | `.` | `NEXT_PUBLIC_API_URL` |
| **Prometheus** | `services/prometheus/docker-compose.yml` | `.` | Ninguna |
| **Grafana** | `services/grafana/docker-compose.yml` | `.` | `GRAFANA_USER`, `GRAFANA_PASSWORD` |

---

## 📝 Configuración en Dokploy

### Paso 1: Crear Aplicación en Dokploy

Para cada servicio, crea una nueva aplicación en Dokploy:

1. **Nombre de la Aplicación**: `rp-requirements-<servicio>`
   - Ejemplo: `rp-requirements-api`, `rp-requirements-postgres`

2. **Tipo**: Docker Compose

3. **Repository**: Tu repositorio Git

4. **Branch**: `main` o `master`

5. **Compose Path**: Ver tabla arriba
   - Ejemplo: `services/api/docker-compose.yml`

6. **Build Context**: `.` (punto - raíz del workspace)

---

## 🔧 Configuración Detallada por Servicio

### 1. PostgreSQL

**Configuración Dokploy:**
- **Name**: `rp-requirements-postgres`
- **Compose Path**: `services/postgres/docker-compose.yml`
- **Build Context**: `.`
- **Environment Variables**:
  ```env
  DB_USERNAME=postgres
  DB_PASSWORD=tu_password_seguro
  DB_DATABASE=requirements_db
  ```

**Orden de Deployment**: Primero (infraestructura base)

---

### 2. RabbitMQ

**Configuración Dokploy:**
- **Name**: `rp-requirements-rabbitmq`
- **Compose Path**: `services/rabbitmq/docker-compose.yml`
- **Build Context**: `.`
- **Environment Variables**:
  ```env
  RABBITMQ_USER=admin
  RABBITMQ_PASSWORD=tu_password_seguro
  RABBITMQ_VHOST=/
  ```

**Orden de Deployment**: Segundo (infraestructura base)

---

### 3. API (NestJS)

**Configuración Dokploy:**
- **Name**: `rp-requirements-api`
- **Compose Path**: `services/api/docker-compose.yml`
- **Build Context**: `.`
- **Build Command**: (Dokploy lo maneja automáticamente)
- **Environment Variables**: Ver sección [Variables API](#variables-api)

**Orden de Deployment**: Tercero (después de PostgreSQL y RabbitMQ)

#### Variables API {#variables-api}

```env
# Server
NODE_ENV=production
PORT=3000

# Database (debe coincidir con PostgreSQL)
DB_HOST=rp-requirements-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# RabbitMQ (debe coincidir con RabbitMQ)
RABBITMQ_HOST=rp-requirements-rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=tu_password_seguro
RABBITMQ_VHOST=/
RABBITMQ_QUEUE=requirements_queue

# JWT (IMPORTANTE: Cambiar en producción)
JWT_SECRET=tu_jwt_secret_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=https://tu-dominio.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Request Timeout
REQUEST_TIMEOUT=30000

# Logging
LOG_LEVEL=info

# Monitoring
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
PROMETHEUS_ENABLED=true
PROMETHEUS_PATH=/metrics
```

**Nota**: `DB_HOST` y `RABBITMQ_HOST` deben usar los nombres de los contenedores Docker, no `localhost`.

---

### 4. Portal (Next.js)

**Configuración Dokploy:**
- **Name**: `rp-requirements-portal`
- **Compose Path**: `services/portal/docker-compose.yml`
- **Build Context**: `.`
- **Build Args**:
  ```env
  NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api/v1
  ```
- **Environment Variables**:
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api/v1
  PORT=4200
  ```

**Orden de Deployment**: Cuarto (después de API)

---

### 5. Prometheus (Opcional)

**Configuración Dokploy:**
- **Name**: `rp-requirements-prometheus`
- **Compose Path**: `services/prometheus/docker-compose.yml`
- **Build Context**: `.`
- **Environment Variables**: Ninguna requerida

**Orden de Deployment**: Opcional (puede ir después de infraestructura)

---

### 6. Grafana (Opcional)

**Configuración Dokploy:**
- **Name**: `rp-requirements-grafana`
- **Compose Path**: `services/grafana/docker-compose.yml`
- **Build Context**: `.`
- **Environment Variables**:
  ```env
  GRAFANA_USER=admin
  GRAFANA_PASSWORD=tu_password_seguro
  GRAFANA_ROOT_URL=https://grafana.tu-dominio.com
  ```

**Orden de Deployment**: Opcional (después de Prometheus)

---

## 🔗 Redes Docker

### Redes Requeridas

Antes de deployar, asegúrate de crear las redes Docker:

```bash
# Red interna del monorepo
docker network create rp-requirements-network

# Red global (si usas otros monorepos)
docker network create suite-beyondnet-global
```

**Nota**: Dokploy puede crear estas redes automáticamente si no existen.

---

## 💾 Volumes Docker

### Volumes Requeridos

Los volumes se crearán automáticamente si no existen, pero puedes crearlos manualmente:

```bash
docker volume create rp-requirements-postgres-data
docker volume create rp-requirements-rabbitmq-data
docker volume create rp-requirements-prometheus-data
docker volume create rp-requirements-grafana-data
docker volume create rp-requirements-api-logs
```

---

## 📋 Orden de Deployment Recomendado

### Opción 1: Deployment Manual (Recomendado)

1. **Infraestructura Base**:
   - PostgreSQL
   - RabbitMQ

2. **Monitoreo** (opcional):
   - Prometheus
   - Grafana

3. **Aplicaciones**:
   - API
   - Portal

### Opción 2: Deployment Automático

Configura Dokploy para deployar automáticamente en el orden correcto usando dependencias.

---

## ✅ Verificación Post-Deployment

### Verificar Servicios

```bash
# Ver todos los contenedores
docker ps --filter "name=rp-requirements"

# Ver logs de un servicio
docker logs rp-requirements-api
docker logs rp-requirements-portal
```

### Health Checks

```bash
# API
curl http://localhost:3000/api/v1/health/liveness

# Portal
curl http://localhost:4200
```

---

## 🔧 Troubleshooting

### Problema: Servicios no se conectan entre sí

**Solución**: Verifica que los servicios estén en la misma red Docker (`rp-network`).

### Problema: Variables de entorno no se aplican

**Solución**: Verifica que las variables estén configuradas en Dokploy y que los nombres coincidan exactamente.

### Problema: Build falla

**Solución**: Verifica que el Build Context sea `.` (punto) y que el Compose Path sea correcto.

---

## 📚 Referencias

- [Docker Monorepo Structure](DOCKER_MONOREPO_STRUCTURE.md)
- [DockerDeploy Compose Paths](DOCKERDEPLOY_COMPOSE_PATHS.md)
- [Docker Verification](DOCKER_VERIFICATION.md)

---

**Configuración lista para Dokploy** ✅

