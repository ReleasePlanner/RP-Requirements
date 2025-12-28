# 🐳 Estructura Docker para Monorepo con DockerDeploy

## 📋 Contexto del Monorepo

Este proyecto es un **monorepo Nx** con múltiples aplicaciones. DockerDeploy necesita que el **contexto de build** sea la raíz del monorepo (`rp-workspace/`).

## 🏗️ Estructura de Archivos

```
rp-workspace/                    ← Contexto raíz del monorepo (DockerDeploy usa este)
├── package.json                 ← Archivo raíz del monorepo
├── nx.json
├── tsconfig.base.json
│
├── apps/                        ← Aplicaciones del monorepo
│   ├── api/
│   │   ├── Dockerfile          ← Dockerfile de API
│   │   ├── package.json
│   │   └── src/
│   └── portal/
│       ├── Dockerfile          ← Dockerfile de Portal
│       ├── package.json
│       └── src/
│
└── services/                    ← Configuración Docker Compose por servicio
    ├── api/
    │   └── docker-compose.yml   ← Compose Path: services/api/docker-compose.yml
    ├── portal/
    │   └── docker-compose.yml   ← Compose Path: services/portal/docker-compose.yml
    ├── postgres/
    │   └── docker-compose.yml
    └── ...
```

## 🎯 Configuración DockerDeploy

### Contexto de Build

**Contexto**: `rp-workspace/` (raíz del monorepo)

DockerDeploy debe configurarse con:
- **Context Path**: `.` (raíz del workspace)
- **Compose Path**: `services/<service>/docker-compose.yml`

### Dockerfiles

Los Dockerfiles están en `apps/<app>/Dockerfile` y esperan el contexto raíz del monorepo:

```dockerfile
# Ejemplo: apps/api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copia archivos raíz del monorepo
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copia archivos de la app específica
COPY apps/api/package*.json ./apps/api/
COPY apps/api/ ./apps/api/
```

### Docker Compose

Los `docker-compose.yml` en `services/` usan:
- **context**: `../../` (relativo desde `services/<service>/`)
- **dockerfile**: `apps/<app>/Dockerfile` (relativo al contexto)

```yaml
# Ejemplo: services/api/docker-compose.yml
services:
  api:
    build:
      context: ../../          # Raíz del monorepo
      dockerfile: apps/api/Dockerfile
```

## 🚀 Configuración DockerDeploy

### Para cada servicio:

1. **Service Name**: `api`, `portal`, `postgres`, etc.
2. **Context Path**: `.` (raíz del workspace `rp-workspace/`)
3. **Compose Path**: `services/<service>/docker-compose.yml`

### Ejemplo de Configuración DockerDeploy:

```yaml
services:
  api:
    context_path: .                    # Raíz del monorepo
    compose_path: services/api/docker-compose.yml
    
  portal:
    context_path: .                    # Raíz del monorepo
    compose_path: services/portal/docker-compose.yml
    
  postgres:
    context_path: .                    # Raíz del monorepo
    compose_path: services/postgres/docker-compose.yml
```

## 📝 Compose Paths por Servicio

| Servicio | Compose Path | Dockerfile Path |
|----------|-------------|-----------------|
| API | `services/api/docker-compose.yml` | `apps/api/Dockerfile` |
| Portal | `services/portal/docker-compose.yml` | `apps/portal/Dockerfile` |
| PostgreSQL | `services/postgres/docker-compose.yml` | (imagen oficial) |
| RabbitMQ | `services/rabbitmq/docker-compose.yml` | (imagen oficial) |
| Prometheus | `services/prometheus/docker-compose.yml` | (imagen oficial) |
| Grafana | `services/grafana/docker-compose.yml` | (imagen oficial) |

## 🔧 Build Manual (para testing)

### Build desde la raíz del monorepo:

```bash
cd rp-workspace

# Build API
docker build -f apps/api/Dockerfile -t rp-api:latest .

# Build Portal
docker build -f apps/portal/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
  -t rp-portal:latest .
```

### Build con Docker Compose:

```bash
cd rp-workspace

# Build API
docker-compose -f services/api/docker-compose.yml build

# Build Portal
docker-compose -f services/portal/docker-compose.yml build
```

## ✅ Verificación

### Verificar contexto correcto:

```bash
cd rp-workspace

# Verificar que el contexto tiene los archivos necesarios
ls -la package.json nx.json tsconfig.base.json
ls -la apps/api/Dockerfile
ls -la apps/portal/Dockerfile

# Verificar docker-compose.yml
cat services/api/docker-compose.yml | grep -A 3 "build:"
# Debe mostrar:
#   context: ../../
#   dockerfile: apps/api/Dockerfile
```

## 🎯 Ventajas de esta Estructura

1. **Contexto único**: Un solo contexto (raíz del monorepo) para todos los builds
2. **Dockerfiles en apps/**: Los Dockerfiles están junto al código fuente
3. **Compose Paths independientes**: Cada servicio puede deployarse por separado
4. **Compatibilidad con DockerDeploy**: Estructura estándar para monorepos
5. **Builds eficientes**: El contexto incluye solo lo necesario del monorepo

## 📚 Referencias

- [DockerDeploy Compose Paths](DOCKERDEPLOY_COMPOSE_PATHS.md)
- [Plan de Reorganización](PLAN_REORGANIZACION_DOCKERDEPLOY.md)
- [Docker Verification](DOCKER_VERIFICATION.md)

---

**Estructura optimizada para DockerDeploy con monorepos** ✅

