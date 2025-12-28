# PostgreSQL Service

## 📋 Descripción

Base de datos PostgreSQL 15 para el sistema de Requirements.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/postgres/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/postgres/docker-compose.yml
docker-compose -f services/postgres/docker-compose.yml up -d
```

### Manual

```bash
cd services/postgres
docker-compose up -d
```

## 📝 Variables de Entorno

**Variables requeridas**:
- `DB_USERNAME`: Usuario de PostgreSQL
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `DB_DATABASE`: Nombre de la base de datos

## 🌐 Redes

- `rp-network`: Red interna para comunicación con otros servicios

## 💾 Volumes

- `postgres_data`: Datos persistentes de PostgreSQL

## 📊 Health Check

Verifica que PostgreSQL esté listo para conexiones.

