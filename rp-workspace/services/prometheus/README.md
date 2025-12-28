# Prometheus Service

## 📋 Descripción

Sistema de recolección y almacenamiento de métricas para monitoreo.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/prometheus/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/prometheus/docker-compose.yml
docker-compose -f services/prometheus/docker-compose.yml up -d
```

### Manual

```bash
cd services/prometheus
docker-compose up -d
```

## 📝 Configuración

La configuración está en `prometheus.yml` en el mismo directorio.

**Scrape targets**:
- API Service: `api:3000/metrics`
- Prometheus mismo: `localhost:9090`

## 🌐 Redes

- `rp-network`: Red interna para comunicación con servicios monitoreados

## 💾 Volumes

- `prometheus_data`: Datos de métricas (retención: 30 días)

## 📊 Health Check

Endpoint: `http://localhost:9090/-/healthy`

## 🔗 Dependencias

- Servicios a monitorear (API, etc.)

