# Services Directory

## 📋 Estructura de Servicios

Este directorio contiene la configuración Docker Compose individual para cada servicio, siguiendo el estándar **DockerDeploy Compose Path**.

## 🎯 Compose Paths para DockerDeploy

Cada servicio tiene su propio `docker-compose.yml` que puede ser deployado independientemente:

- **API**: `services/api/docker-compose.yml`
- **Portal**: `services/portal/docker-compose.yml`
- **PostgreSQL**: `services/postgres/docker-compose.yml`
- **RabbitMQ**: `services/rabbitmq/docker-compose.yml`
- **Prometheus**: `services/prometheus/docker-compose.yml`
- **Grafana**: `services/grafana/docker-compose.yml`

## 🚀 Deployment Individual

Cada servicio puede deployarse de forma independiente:

```bash
# Deploy solo PostgreSQL
docker-compose -f services/postgres/docker-compose.yml up -d

# Deploy solo RabbitMQ
docker-compose -f services/rabbitmq/docker-compose.yml up -d

# Deploy solo API
docker-compose -f services/api/docker-compose.yml up -d

# Deploy solo Portal
docker-compose -f services/portal/docker-compose.yml up -d
```

## 📋 Orden de Deployment Recomendado

1. **Infraestructura Base**:
   ```bash
   docker-compose -f services/postgres/docker-compose.yml up -d
   docker-compose -f services/rabbitmq/docker-compose.yml up -d
   ```

2. **Monitoreo** (opcional):
   ```bash
   docker-compose -f services/prometheus/docker-compose.yml up -d
   docker-compose -f services/grafana/docker-compose.yml up -d
   ```

3. **Aplicaciones**:
   ```bash
   docker-compose -f services/api/docker-compose.yml up -d
   docker-compose -f services/portal/docker-compose.yml up -d
   ```

## 🔧 Configuración

### Redes Externas Requeridas

Antes de deployar, asegúrate de crear las redes externas:

```bash
# Red interna del monorepo
docker network create rp-requirements-network

# Red global (si no existe)
docker network create suite-beyondnet-global
```

### Volumes Externos Requeridos

Los volumes deben crearse antes del deployment:

```bash
docker volume create rp-requirements-postgres-data
docker volume create rp-requirements-rabbitmq-data
docker volume create rp-requirements-prometheus-data
docker volume create rp-requirements-grafana-data
docker volume create rp-requirements-api-logs
```

## 📝 Variables de Entorno

Cada servicio puede tener su propio `.env` o usar las variables globales del workspace.

Ver `env.docker.example` en la raíz del workspace para todas las variables.

## 📚 Documentación por Servicio

- [API](api/README.md)
- [Portal](portal/README.md)
- [PostgreSQL](postgres/README.md)
- [RabbitMQ](rabbitmq/README.md)
- [Prometheus](prometheus/README.md)
- [Grafana](grafana/README.md)

## 🔗 Dependencias entre Servicios

```
postgres ──┐
           ├──> api ──> portal
rabbitmq ──┘

prometheus ──> grafana
```

## ✅ Verificación

Para verificar que todos los servicios están corriendo:

```bash
docker ps --filter "name=rp-requirements"
```

