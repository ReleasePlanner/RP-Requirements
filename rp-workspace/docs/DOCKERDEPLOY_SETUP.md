# 🚀 Configuración DockerDeploy para Monorepo

## 📋 Configuración Requerida

### Context Path

**Context Path**: `.` (raíz del workspace `rp-workspace/`)

DockerDeploy debe ejecutarse desde la raíz del workspace, donde está el `package.json` del monorepo.

### Compose Paths

Cada servicio tiene su propio Compose Path:

| Servicio | Compose Path |
|----------|-------------|
| API | `services/api/docker-compose.yml` |
| Portal | `services/portal/docker-compose.yml` |
| PostgreSQL | `services/postgres/docker-compose.yml` |
| RabbitMQ | `services/rabbitmq/docker-compose.yml` |
| Prometheus | `services/prometheus/docker-compose.yml` |
| Grafana | `services/grafana/docker-compose.yml` |

## ⚙️ Configuración DockerDeploy

### Ejemplo de Configuración YAML

```yaml
services:
  api:
    name: rp-requirements-api
    context_path: .                              # Raíz del workspace
    compose_path: services/api/docker-compose.yml
    environment:
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      # ... más variables
    
  portal:
    name: rp-requirements-portal
    context_path: .                              # Raíz del workspace
    compose_path: services/portal/docker-compose.yml
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    
  postgres:
    name: rp-requirements-postgres
    context_path: .                              # Raíz del workspace
    compose_path: services/postgres/docker-compose.yml
    environment:
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_DATABASE}
```

## 🔧 Estructura de Build

### Contexto de Build

El contexto es la raíz del monorepo (`rp-workspace/`), que contiene:

```
rp-workspace/                    ← Contexto de build
├── package.json                 ← Archivo raíz del monorepo
├── nx.json                      ← Configuración Nx
├── tsconfig.base.json           ← TypeScript base
├── apps/                        ← Aplicaciones
│   ├── api/
│   │   ├── Dockerfile          ← Dockerfile de API
│   │   └── src/
│   └── portal/
│       ├── Dockerfile          ← Dockerfile de Portal
│       └── src/
└── services/                    ← Docker Compose por servicio
    └── api/
        └── docker-compose.yml
```

### Dockerfiles

Los Dockerfiles están en `apps/<app>/Dockerfile` y esperan el contexto raíz:

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copia archivos raíz del monorepo
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copia archivos de la app
COPY apps/api/package*.json ./apps/api/
COPY apps/api/ ./apps/api/
```

### Docker Compose

Los `docker-compose.yml` en `services/` usan:

```yaml
# services/api/docker-compose.yml
services:
  api:
    build:
      context: .                 # Raíz del monorepo (donde DockerDeploy ejecuta)
      dockerfile: apps/api/Dockerfile
```

## 📝 Variables de Entorno

### Variables Requeridas

Cada servicio necesita variables específicas. Ver `env.docker.example` en la raíz del workspace.

**API**:
- `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET` (mínimo 32 caracteres)
- `RABBITMQ_USER`, `RABBITMQ_PASSWORD`

**Portal**:
- `NEXT_PUBLIC_API_URL`

**PostgreSQL**:
- `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`

**RabbitMQ**:
- `RABBITMQ_USER`, `RABBITMQ_PASSWORD`

## 🔗 Dependencias entre Servicios

### Orden de Deployment

1. **Infraestructura Base**:
   - PostgreSQL
   - RabbitMQ

2. **Monitoreo** (opcional):
   - Prometheus
   - Grafana

3. **Aplicaciones**:
   - API (requiere PostgreSQL y RabbitMQ)
   - Portal (requiere API)

### Redes Externas

Antes de deployar, crear las redes:

```bash
docker network create rp-requirements-network
docker network create suite-beyondnet-global
```

### Volumes Externos

Crear los volumes antes del deployment:

```bash
docker volume create rp-requirements-postgres-data
docker volume create rp-requirements-rabbitmq-data
docker volume create rp-requirements-prometheus-data
docker volume create rp-requirements-grafana-data
docker volume create rp-requirements-api-logs
```

## ✅ Verificación

### Verificar Context Path

```bash
cd rp-workspace

# Verificar que estamos en la raíz del monorepo
ls -la package.json nx.json tsconfig.base.json

# Verificar Dockerfiles
ls -la apps/api/Dockerfile apps/portal/Dockerfile

# Verificar docker-compose.yml
cat services/api/docker-compose.yml | grep -A 2 "build:"
# Debe mostrar:
#   context: .
#   dockerfile: apps/api/Dockerfile
```

### Build Manual (para testing)

```bash
cd rp-workspace

# Build API
docker build -f apps/api/Dockerfile -t rp-api:latest .

# Build Portal
docker build -f apps/portal/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
  -t rp-portal:latest .

# Build con docker-compose
docker-compose -f services/api/docker-compose.yml build
```

## 🎯 Ventajas de esta Configuración

1. **Contexto único**: Un solo contexto (raíz del monorepo) para todos los builds
2. **Dockerfiles junto al código**: Los Dockerfiles están en `apps/` junto al código fuente
3. **Compose Paths independientes**: Cada servicio puede deployarse por separado
4. **Compatibilidad DockerDeploy**: Estructura estándar para monorepos
5. **Builds eficientes**: El contexto incluye solo lo necesario del monorepo

## 📚 Referencias

- [Docker Monorepo Structure](DOCKER_MONOREPO_STRUCTURE.md)
- [DockerDeploy Compose Paths](DOCKERDEPLOY_COMPOSE_PATHS.md)
- [Docker Verification](DOCKER_VERIFICATION.md)

---

**Configuración lista para DockerDeploy** ✅

