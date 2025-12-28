# Portal Service (Next.js)

## 📋 Descripción

Frontend web application construido con Next.js 16.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/portal/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/portal/docker-compose.yml
docker-compose -f services/portal/docker-compose.yml up -d
```

### Manual

```bash
cd services/portal
docker-compose up -d
```

## 📝 Variables de Entorno

**Variables requeridas**:
- `NEXT_PUBLIC_API_URL`: URL de la API accesible desde el navegador

## 🔗 Dependencias

- API (debe estar corriendo y saludable)

## 🌐 Redes

- `suite-global`: Para comunicación con el proxy/Nginx

## 📊 Health Check

Endpoint: `http://localhost:4200`

