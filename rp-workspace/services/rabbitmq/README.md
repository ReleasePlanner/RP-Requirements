# RabbitMQ Service

## 📋 Descripción

Message broker RabbitMQ con Management UI para comunicación asíncrona entre servicios.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/rabbitmq/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/rabbitmq/docker-compose.yml
docker-compose -f services/rabbitmq/docker-compose.yml up -d
```

### Manual

```bash
cd services/rabbitmq
docker-compose up -d
```

## 📝 Variables de Entorno

**Variables requeridas**:
- `RABBITMQ_USER`: Usuario de RabbitMQ
- `RABBITMQ_PASSWORD`: Contraseña de RabbitMQ
- `RABBITMQ_VHOST`: Virtual host (default: `/`)

## 🌐 Redes

- `rp-network`: Red interna para comunicación con otros servicios

## 💾 Volumes

- `rabbitmq_data`: Datos persistentes de RabbitMQ

## 🔧 Management UI

Accesible en: `http://localhost:15672` (solo en desarrollo)

## 📊 Health Check

Verifica que RabbitMQ esté funcionando correctamente.

