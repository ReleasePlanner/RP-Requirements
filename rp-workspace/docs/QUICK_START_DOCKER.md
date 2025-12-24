# 🚀 Quick Start - Docker Compose

Guía rápida para iniciar todo el sistema en 3 pasos.

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Configurar Variables de Entorno

```bash
cp env.docker.example .env
```

Edita `.env` y cambia al menos:
- `JWT_SECRET`: Genera uno seguro con `openssl rand -base64 32`
- `DB_PASSWORD`: Cambia la contraseña de PostgreSQL

### 2️⃣ Iniciar Servicios

```bash
# Opción A: Usando Make (recomendado)
make up

# Opción B: Usando Docker Compose
docker-compose up -d

# Opción C: Usando el script interactivo
./scripts/docker-setup.sh
```

### 3️⃣ Verificar

```bash
# Ver estado
make ps

# Ver logs
make logs

# Verificar salud
make health
```

## 🌐 Acceso

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **Portal**: http://localhost:4200
- **PostgreSQL**: localhost:5432

## 📝 Comandos Básicos

```bash
make up          # Iniciar
make down        # Detener
make restart     # Reiniciar
make logs        # Ver logs
make migrate     # Ejecutar migraciones
make seed        # Seedear base de datos
make clean       # Limpiar todo
```

## 🐛 Problemas Comunes

**Puerto en uso:**
```bash
# Cambiar puertos en .env
API_PORT=3001
PORTAL_PORT=4201
```

**Base de datos no conecta:**
```bash
# Verificar logs
make logs-db
```

**Reiniciar desde cero:**
```bash
make clean
make up
```

## 📚 Más Información

Ver [README_DOCKER.md](README_DOCKER.md) para documentación completa.

