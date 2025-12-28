# 🐳 DockerDeploy Compose Paths

## 📋 Estándar DockerDeploy

Cada servicio tiene su propio **Compose Path** que DockerDeploy puede usar para deployment independiente.

---

## 🎯 Compose Paths por Servicio

### 1. API (NestJS)
**Compose Path**: `services/api/docker-compose.yml`

```bash
docker-compose -f services/api/docker-compose.yml up -d
```

### 2. Portal (Next.js)
**Compose Path**: `services/portal/docker-compose.yml`

```bash
docker-compose -f services/portal/docker-compose.yml up -d
```

### 3. PostgreSQL
**Compose Path**: `services/postgres/docker-compose.yml`

```bash
docker-compose -f services/postgres/docker-compose.yml up -d
```

### 4. RabbitMQ
**Compose Path**: `services/rabbitmq/docker-compose.yml`

```bash
docker-compose -f services/rabbitmq/docker-compose.yml up -d
```

### 5. Prometheus
**Compose Path**: `services/prometheus/docker-compose.yml`

```bash
docker-compose -f services/prometheus/docker-compose.yml up -d
```

### 6. Grafana
**Compose Path**: `services/grafana/docker-compose.yml`

```bash
docker-compose -f services/grafana/docker-compose.yml up -d
```

---

## 📁 Estructura de Directorios

```
rp-workspace/
├── services/
│   ├── api/
│   │   ├── docker-compose.yml  ← Compose Path para DockerDeploy
│   │   ├── Dockerfile
│   │   └── README.md
│   ├── portal/
│   │   ├── docker-compose.yml  ← Compose Path para DockerDeploy
│   │   ├── Dockerfile
│   │   └── README.md
│   ├── postgres/
│   │   ├── docker-compose.yml  ← Compose Path para DockerDeploy
│   │   └── README.md
│   ├── rabbitmq/
│   │   ├── docker-compose.yml  ← Compose Path para DockerDeploy
│   │   └── README.md
│   ├── prometheus/
│   │   ├── docker-compose.yml  ← Compose Path para DockerDeploy
│   │   ├── prometheus.yml
│   │   └── README.md
│   └── grafana/
│       ├── docker-compose.yml  ← Compose Path para DockerDeploy
│       ├── provisioning/
│       └── README.md
└── apps/                        # Código fuente (sin cambios)
    ├── api/
    └── portal/
```

---

## 🚀 Deployment con DockerDeploy

### Configuración en DockerDeploy

Para cada servicio, configura:

1. **Service Name**: Nombre del servicio (ej: `api`, `portal`, `postgres`)
2. **Compose Path**: Ruta al `docker-compose.yml` del servicio
   - Ejemplo: `services/api/docker-compose.yml`
3. **Context**: Directorio raíz del workspace (`rp-workspace/`)

### Ejemplo de Configuración DockerDeploy

```yaml
# Ejemplo de configuración para DockerDeploy
services:
  api:
    compose_path: services/api/docker-compose.yml
    context: rp-workspace/
    
  portal:
    compose_path: services/portal/docker-compose.yml
    context: rp-workspace/
    
  postgres:
    compose_path: services/postgres/docker-compose.yml
    context: rp-workspace/
    
  rabbitmq:
    compose_path: services/rabbitmq/docker-compose.yml
    context: rp-workspace/
```

---

## 📋 Orden de Deployment

### 1. Infraestructura Base (Primero)

```bash
# PostgreSQL
docker-compose -f services/postgres/docker-compose.yml up -d

# RabbitMQ
docker-compose -f services/rabbitmq/docker-compose.yml up -d
```

### 2. Monitoreo (Opcional)

```bash
# Prometheus
docker-compose -f services/prometheus/docker-compose.yml up -d

# Grafana
docker-compose -f services/grafana/docker-compose.yml up -d
```

### 3. Aplicaciones (Después de infraestructura)

```bash
# API (requiere postgres y rabbitmq)
docker-compose -f services/api/docker-compose.yml up -d

# Portal (requiere api)
docker-compose -f services/portal/docker-compose.yml up -d
```

---

## ⚙️ Requisitos Previos

### Redes Externas

Antes de deployar cualquier servicio, crear las redes:

```bash
# Red interna del monorepo
docker network create rp-requirements-network

# Red global (si no existe)
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

---

## 🔧 Variables de Entorno

Cada servicio puede usar:
- Variables del archivo `.env` en la raíz del workspace
- Variables específicas del servicio
- Variables inyectadas por DockerDeploy

Ver `env.docker.example` para todas las variables disponibles.

---

## ✅ Verificación

### Verificar servicios corriendo

```bash
docker ps --filter "name=rp-requirements"
```

### Verificar logs

```bash
# API
docker logs rp-requirements-api

# Portal
docker logs rp-requirements-portal

# PostgreSQL
docker logs rp-requirements-postgres
```

### Verificar health checks

```bash
# API
curl http://localhost:3000/api/v1/health/liveness

# Portal
curl http://localhost:4200
```

---

## 📚 Documentación Adicional

- [README de Services](services/README.md)
- [Plan de Reorganización](PLAN_REORGANIZACION_DOCKERDEPLOY.md)
- [Documentación de API](services/api/README.md)
- [Documentación de Portal](services/portal/README.md)

---

**Estructura lista para DockerDeploy** ✅

