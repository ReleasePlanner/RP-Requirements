# 🚀 Quick Deployment Guide

Guía rápida para compilar y desplegar el sistema.

## ⚡ Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
cp env.docker.example .env
# Editar .env con tus valores
```

### 2. Build y Deploy

```bash
# Opción 1: Docker Compose (recomendado)
make up
# o
docker-compose up -d

# Opción 2: Build local
./scripts/build.sh all
```

### 3. Verificar

```bash
make health
# o
curl http://localhost:3000/api/v1/health/liveness
curl http://localhost:4200
```

## 📦 Build Individual

### API

```bash
# Local
cd apps/api && npm run build

# Docker
docker build -f apps/api/Dockerfile -t rp-api:latest .
```

### Portal

```bash
# Local
cd apps/portal && npm run build

# Docker
docker build -f apps/portal/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
  -t rp-portal:latest .
```

## 🔧 Comandos Útiles

```bash
make up          # Iniciar todo
make down        # Detener todo
make build       # Build imágenes
make logs        # Ver logs
make health      # Verificar salud
```

## 📚 Documentación Completa

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para más detalles.

