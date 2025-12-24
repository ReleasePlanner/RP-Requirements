# 🐳 Docker Setup Guide

Guía completa para desplegar el sistema completo (API, Portal y PostgreSQL) usando Docker Compose.

## 📋 Requisitos Previos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Al menos 2GB de RAM disponible
- Puertos 3000, 4200 y 5432 disponibles

## ⚡ Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env  # o tu editor preferido
```

**Variables importantes a configurar:**
- `JWT_SECRET`: Cambiar por un valor seguro (mínimo 32 caracteres)
- `DB_PASSWORD`: Cambiar la contraseña de PostgreSQL
- `NEXT_PUBLIC_API_URL`: URL donde el Portal puede acceder a la API

### 2. Iniciar Servicios

**Opción 1: Usando Make (recomendado)**
```bash
make up
```

**Opción 2: Usando Docker Compose**
```bash
docker-compose up -d
```

**Opción 3: Usando el script**
```bash
./scripts/docker-setup.sh
```

### 3. Verificar que Todo Funciona

```bash
# Ver estado de servicios
make ps
# o
docker-compose ps

# Ver logs
make logs
# o
docker-compose logs -f

# Verificar salud de servicios
make health
```

### 4. Acceder a las Aplicaciones

- **API**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3000/api/docs
- **Portal**: http://localhost:4200
- **PostgreSQL**: localhost:5432

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar servicios
make up

# Iniciar en modo desarrollo
make up-dev

# Detener servicios
make down

# Reiniciar servicios
make restart

# Ver logs
make logs              # Todos los servicios
make logs-api         # Solo API
make logs-portal      # Solo Portal
make logs-db          # Solo PostgreSQL
```

### Base de Datos

```bash
# Ejecutar migraciones
make migrate

# Seedear base de datos
make seed

# Acceder a PostgreSQL
make shell-db
```

### Desarrollo

```bash
# Modo desarrollo (con hot-reload)
make up-dev

# Rebuild imágenes
make build

# Acceder a shell de contenedores
make shell-api
make shell-portal
```

### Limpieza

```bash
# Detener y eliminar contenedores y volúmenes
make clean

# Solo eliminar contenedores (mantiene datos)
make down
```

## 🔧 Configuración Avanzada

### Modo Desarrollo

Para desarrollo con hot-reload y volúmenes montados:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Personalizar Configuración

Crea un archivo `docker-compose.override.yml` (no se commitea) para personalizar:

```yaml
version: '3.8'

services:
  api:
    environment:
      LOG_LEVEL: debug
    volumes:
      - ./apps/api/src:/app/src
```

### Cambiar Puertos

Edita `.env`:

```bash
API_PORT=3001
PORTAL_PORT=4201
DB_PORT=5433
```

### Variables de Entorno por Servicio

Puedes sobrescribir variables en `docker-compose.override.yml`:

```yaml
services:
  api:
    environment:
      DB_SYNCHRONIZE: "true"
      DB_LOGGING: "true"
```

## 📊 Monitoreo y Salud

### Health Checks

Los servicios incluyen health checks automáticos:

```bash
# Verificar salud manualmente
docker-compose ps

# Verificar API
curl http://localhost:3000/api/v1/health/liveness

# Verificar Portal
curl http://localhost:4200
```

### Logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f api
docker-compose logs -f portal
docker-compose logs -f postgres

# Últimas 100 líneas
docker-compose logs --tail=100 api
```

## 🗄️ Base de Datos

### Acceso a PostgreSQL

```bash
# Usando make
make shell-db

# Usando docker-compose
docker-compose exec postgres psql -U postgres -d requirements_db

# Desde fuera del contenedor
psql -h localhost -p 5432 -U postgres -d requirements_db
```

### Backup y Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres requirements_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres requirements_db < backup.sql
```

### Persistencia de Datos

Los datos de PostgreSQL se almacenan en un volumen Docker:

```bash
# Ver volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect rp-requirements-postgres-data

# Eliminar datos (¡CUIDADO!)
docker-compose down -v
```

## 🐛 Troubleshooting

### Los servicios no inician

1. **Verificar logs:**
   ```bash
   docker-compose logs
   ```

2. **Verificar puertos disponibles:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

3. **Verificar variables de entorno:**
   ```bash
   docker-compose config
   ```

### La API no se conecta a la base de datos

1. Verificar que PostgreSQL esté saludable:
   ```bash
   docker-compose ps postgres
   ```

2. Verificar variables de entorno:
   ```bash
   docker-compose exec api env | grep DB_
   ```

3. Verificar conectividad:
   ```bash
   docker-compose exec api ping postgres
   ```

### El Portal no se conecta a la API

1. Verificar que `NEXT_PUBLIC_API_URL` esté correcto
2. Verificar CORS en la API
3. Verificar que la API esté accesible desde el navegador

### Rebuild después de cambios

```bash
# Rebuild específico
docker-compose build api
docker-compose up -d api

# Rebuild todo
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Estructura de Archivos

```
.
├── docker-compose.yml          # Configuración principal
├── docker-compose.dev.yml      # Override para desarrollo
├── docker-compose.override.yml.example  # Ejemplo de override
├── .env.example               # Variables de entorno de ejemplo
├── .env                       # Variables de entorno (no commiteado)
├── .dockerignore              # Archivos ignorados en build
├── Makefile                   # Comandos útiles
└── scripts/
    └── docker-setup.sh        # Script de setup interactivo
```

## 🔐 Seguridad

### Producción

1. **Cambiar todas las contraseñas por defecto**
2. **Usar JWT_SECRET fuerte** (mínimo 32 caracteres aleatorios)
3. **Configurar CORS_ORIGIN** correctamente
4. **No usar DB_SYNCHRONIZE=true** en producción
5. **Configurar SSL/TLS** para conexiones externas
6. **Usar secrets de Docker** para información sensible

### Generar JWT_SECRET Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🚀 Despliegue en Producción

### Recomendaciones

1. **Usar Docker Swarm o Kubernetes** para orquestación
2. **Configurar reverse proxy** (Nginx, Traefik)
3. **Implementar backups automáticos** de base de datos
4. **Configurar monitoreo** (Prometheus, Grafana)
5. **Usar secrets management** (Docker Secrets, Vault)
6. **Configurar logging centralizado** (ELK, Loki)

### Ejemplo con Nginx

```nginx
upstream api {
    server api:3000;
}

upstream portal {
    server portal:4200;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://api;
    }
}

server {
    listen 80;
    server_name portal.example.com;
    
    location / {
        proxy_pass http://portal;
    }
}
```

## 📚 Referencias

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## 🆘 Soporte

Para problemas:
1. Revisar logs: `docker-compose logs`
2. Verificar configuración: `docker-compose config`
3. Consultar documentación en `docs/`
4. Crear issue en el repositorio

