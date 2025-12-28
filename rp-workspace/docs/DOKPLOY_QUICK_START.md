# ⚡ Dokploy Quick Start

## 🚀 Configuración Rápida en 5 Pasos

### Paso 1: Crear Redes Docker

```bash
docker network create rp-requirements-network
docker network create suite-beyondnet-global
```

### Paso 2: Configurar PostgreSQL

1. Crear aplicación en Dokploy
2. **Compose Path**: `services/postgres/docker-compose.yml`
3. **Build Context**: `.`
4. **Variables**:
   ```env
   DB_USERNAME=postgres
   DB_PASSWORD=tu_password
   DB_DATABASE=requirements_db
   ```

### Paso 3: Configurar RabbitMQ

1. Crear aplicación en Dokploy
2. **Compose Path**: `services/rabbitmq/docker-compose.yml`
3. **Build Context**: `.`
4. **Variables**:
   ```env
   RABBITMQ_USER=admin
   RABBITMQ_PASSWORD=tu_password
   ```

### Paso 4: Configurar API

1. Crear aplicación en Dokploy
2. **Compose Path**: `services/api/docker-compose.yml`
3. **Build Context**: `.`
4. **Variables** (ver [DOKPLOY_SETUP.md](DOKPLOY_SETUP.md#variables-api))
5. **Importante**: `DB_HOST=rp-requirements-postgres` y `RABBITMQ_HOST=rp-requirements-rabbitmq`

### Paso 5: Configurar Portal

1. Crear aplicación en Dokploy
2. **Compose Path**: `services/portal/docker-compose.yml`
3. **Build Context**: `.`
4. **Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api/v1
   ```

---

## 📋 Checklist de Configuración

- [ ] Redes Docker creadas
- [ ] PostgreSQL configurado y corriendo
- [ ] RabbitMQ configurado y corriendo
- [ ] API configurada con variables correctas
- [ ] Portal configurado con `NEXT_PUBLIC_API_URL`
- [ ] Health checks pasando

---

## 🔍 Verificación Rápida

```bash
# Ver servicios corriendo
docker ps --filter "name=rp-requirements"

# Verificar API
curl http://localhost:3000/api/v1/health/liveness

# Verificar Portal
curl http://localhost:4200
```

---

**Para configuración detallada, ver [DOKPLOY_SETUP.md](DOKPLOY_SETUP.md)**

