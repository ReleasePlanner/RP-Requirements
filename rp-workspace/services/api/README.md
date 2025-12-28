# API Service (NestJS)

## 📋 Descripción

Servicio API construido con NestJS siguiendo Clean Architecture.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/api/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/api/docker-compose.yml
docker-compose -f services/api/docker-compose.yml up -d
```

### Manual

```bash
cd services/api
docker-compose up -d
```

## 📝 Variables de Entorno

Ver `.env.example` o `env.docker.example` en la raíz del workspace.

**Variables requeridas**:

- `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET` (mínimo 32 caracteres)
- `RABBITMQ_USER`, `RABBITMQ_PASSWORD`

## 🔗 Dependencias

- PostgreSQL (debe estar corriendo)
- RabbitMQ (debe estar corriendo)

## 🌐 Redes

- `rp-network`: Para comunicación con PostgreSQL y RabbitMQ
- `suite-global`: Para comunicación con otros monorepos

## 📊 Health Check

Endpoint: `http://localhost:3000/api/v1/health/liveness`
