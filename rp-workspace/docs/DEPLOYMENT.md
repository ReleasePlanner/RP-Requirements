# 🚀 Guía de Deployment y Compilación

Esta guía describe cómo compilar y desplegar el sistema completo.

## 📋 Requisitos Previos

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 20.x
- npm o yarn

## 🏗️ Compilación Local

### Compilar API

```bash
cd apps/api
npm install
npm run build
```

### Compilar Portal

```bash
cd apps/portal
npm install
npm run build
```

### Compilar Todo

```bash
# Usando el script
./scripts/build.sh all

# O manualmente
npm run build:api
cd apps/portal && npm run build
```

## 🐳 Docker Build

### Build Individual

```bash
# API
docker build -f apps/api/Dockerfile -t rp-api:latest .

# Portal
docker build -f apps/portal/Dockerfile --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 -t rp-portal:latest .
```

### Build con Docker Compose

```bash
# Build todas las imágenes
docker-compose build

# Build específico
docker-compose build api
docker-compose build portal
```

## 📦 Estructura de Build

### API Build

1. **Stage 1: Builder**
   - Copia archivos de configuración (package.json, tsconfig, etc.)
   - Instala dependencias completas
   - Copia código fuente
   - Compila TypeScript a JavaScript

2. **Stage 2: Production**
   - Copia solo dependencias de producción
   - Copia artefactos compilados
   - Configura usuario no-root
   - Expone puerto 3000

### Portal Build

1. **Stage 1: Builder**
   - Copia archivos de configuración
   - Instala dependencias completas
   - Copia código fuente
   - Build de Next.js (SSR + Static)

2. **Stage 2: Production**
   - Copia solo dependencias de producción
   - Copia artefactos compilados (.next, public, src)
   - Configura usuario no-root
   - Expone puerto 4200

## 🔧 Variables de Entorno

### API

Ver `apps/api/src/shared/config/env.example` para todas las variables.

**Requeridas:**
- `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET` (mínimo 32 caracteres)

**Opcionales:**
- `NODE_ENV` (default: development)
- `PORT` (default: 3000)
- `LOG_LEVEL` (default: info)
- `ENABLE_MONITORING` (default: true)
- `METRICS_RETENTION_MS` (default: 3600000)

### Portal

**Requeridas:**
- `NEXT_PUBLIC_API_URL` - URL de la API accesible desde el navegador

**Opcionales:**
- `NODE_ENV` (default: development)
- `PORT` (default: 4200)

## 🚀 Deployment con Docker Compose

### Desarrollo

```bash
# Iniciar todo
docker-compose up

# En background
docker-compose up -d

# Con hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Producción

```bash
# 1. Configurar variables de entorno
cp env.docker.example .env
# Editar .env con valores de producción

# 2. Build imágenes
docker-compose build

# 3. Iniciar servicios
docker-compose up -d

# 4. Verificar
docker-compose ps
docker-compose logs -f
```

## 📊 Monitoreo en Producción

El sistema de monitoreo está habilitado por defecto. Accede a:

- **API Metrics**: `http://localhost:3000/api/v1/monitoring/metrics`
- **Portal Dashboard**: `http://localhost:4200/portal/monitoring`

## 🔍 Troubleshooting

### Build Falla

1. **Verificar dependencias:**
   ```bash
   npm ci
   ```

2. **Limpiar cache:**
   ```bash
   docker-compose build --no-cache
   ```

3. **Verificar logs:**
   ```bash
   docker-compose build 2>&1 | tee build.log
   ```

### Imagen muy grande

- Usa multi-stage builds (ya implementado)
- Verifica `.dockerignore`
- Usa `npm ci --only=production` en producción

### Errores de permisos

- Los Dockerfiles crean usuarios no-root
- Verifica ownership de volúmenes
- Ajusta permisos si es necesario

### Logs no se guardan

- Verifica que el volumen de logs esté montado
- Verifica permisos del directorio logs
- Verifica variable `LOG_DIR` si está configurada

## 📝 Mejores Prácticas

1. **Siempre usar `npm ci`** en lugar de `npm install` en CI/CD
2. **Usar multi-stage builds** para imágenes más pequeñas
3. **No incluir node_modules** en imágenes (usar .dockerignore)
4. **Usar usuarios no-root** para seguridad
5. **Configurar health checks** para orquestación
6. **Usar variables de entorno** para configuración
7. **Separar builds de desarrollo y producción**

## 🔗 Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)

