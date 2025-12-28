# Grafana Service

## 📋 Descripción

Sistema de visualización de métricas y dashboards.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/grafana/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/grafana/docker-compose.yml
docker-compose -f services/grafana/docker-compose.yml up -d
```

### Manual

```bash
cd services/grafana
docker-compose up -d
```

## 📝 Variables de Entorno

**Variables requeridas**:
- `GRAFANA_USER`: Usuario administrador
- `GRAFANA_PASSWORD`: Contraseña administrador
- `GRAFANA_ROOT_URL`: URL base de Grafana

## 🔗 Dependencias

- Prometheus (debe estar corriendo)

## 🌐 Redes

- `rp-network`: Red interna para comunicación con Prometheus

## 💾 Volumes

- `grafana_data`: Datos de Grafana (dashboards, usuarios, etc.)
- `provisioning/`: Configuración de datasources y dashboards
- `dashboards/`: Dashboards personalizados

## 📊 Health Check

Endpoint: `http://localhost:3000/api/health`

## 🔧 Acceso

- URL: `http://localhost:3001` (desarrollo)
- Credenciales: Ver variables de entorno

