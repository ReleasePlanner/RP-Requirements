# 📋 Plan de Reorganización para DockerDeploy

## 🎯 Objetivo

Reorganizar la estructura del código fuente para cumplir con el estándar de **Compose Path** de DockerDeploy, donde cada servicio debe tener su propio directorio con su `docker-compose.yml` y `Dockerfile`.

---

## 📊 Análisis de Estructura Actual

### Estructura Actual

```
rp-workspace/
├── docker-compose.yml          # Todos los servicios juntos
├── docker-compose.prod.yml     # Override para producción
├── docker-compose.dev.yml      # Override para desarrollo
├── apps/
│   ├── api/
│   │   └── Dockerfile          # Dockerfile del API
│   └── portal/
│       └── Dockerfile          # Dockerfile del Portal
└── monitoring/
    ├── prometheus/
    └── grafana/
```

### Problema

- ❌ Un solo `docker-compose.yml` con todos los servicios
- ❌ Dockerfiles en subdirectorios de apps
- ❌ No sigue el estándar de DockerDeploy (Compose Path por servicio)
- ❌ Dificulta el deployment independiente de servicios

---

## 🎯 Estructura Propuesta (Estándar DockerDeploy)

### Estructura Recomendada

```
rp-workspace/
├── services/                    # Directorio de servicios
│   ├── api/                    # Servicio API
│   │   ├── docker-compose.yml  # Compose específico del API
│   │   ├── Dockerfile          # Dockerfile del API
│   │   ├── .env.example        # Variables de entorno del API
│   │   └── README.md           # Documentación del servicio
│   │
│   ├── portal/                 # Servicio Portal
│   │   ├── docker-compose.yml  # Compose específico del Portal
│   │   ├── Dockerfile          # Dockerfile del Portal
│   │   ├── .env.example        # Variables de entorno del Portal
│   │   └── README.md           # Documentación del servicio
│   │
│   ├── postgres/               # Servicio PostgreSQL
│   │   ├── docker-compose.yml  # Compose específico de PostgreSQL
│   │   ├── .env.example        # Variables de entorno
│   │   └── init-scripts/       # Scripts de inicialización (opcional)
│   │
│   ├── rabbitmq/               # Servicio RabbitMQ
│   │   ├── docker-compose.yml  # Compose específico de RabbitMQ
│   │   ├── .env.example        # Variables de entorno
│   │   └── config/             # Configuración de RabbitMQ (opcional)
│   │
│   ├── prometheus/             # Servicio Prometheus
│   │   ├── docker-compose.yml  # Compose específico de Prometheus
│   │   ├── prometheus.yml      # Configuración de Prometheus
│   │   └── .env.example        # Variables de entorno
│   │
│   └── grafana/                # Servicio Grafana
│       ├── docker-compose.yml  # Compose específico de Grafana
│       ├── provisioning/       # Provisioning de Grafana
│       └── .env.example        # Variables de entorno
│
├── docker-compose.yml          # Compose maestro (orquesta todos los servicios)
├── docker-compose.prod.yml     # Override para producción
├── docker-compose.dev.yml      # Override para desarrollo
├── .env.example                # Variables de entorno globales
└── apps/                       # Código fuente (sin cambios)
    ├── api/
    └── portal/
```

---

## 🔄 Plan de Migración

### Fase 1: Crear Estructura de Servicios

1. **Crear directorio `services/`**
   ```bash
   mkdir -p services/{api,portal,postgres,rabbitmq,prometheus,grafana}
   ```

2. **Mover Dockerfiles a sus servicios**
   - `apps/api/Dockerfile` → `services/api/Dockerfile`
   - `apps/portal/Dockerfile` → `services/portal/Dockerfile`

3. **Crear docker-compose.yml individuales para cada servicio**

### Fase 2: Crear Compose Individuales

#### `services/api/docker-compose.yml`
```yaml
version: "3.8"

services:
  api:
    build:
      context: ../../  # Contexto raíz del workspace
      dockerfile: services/api/Dockerfile
    container_name: rp-requirements-api
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: 3000
      # ... resto de variables
    networks:
      - rp-network
      - suite-global
    volumes:
      - api_logs:/app/logs
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/v1/health/liveness', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  rp-network:
    external: true
    name: rp-requirements-network
  suite-global:
    external: true
    name: suite-beyondnet-global

volumes:
  api_logs:
    external: true
    name: rp-requirements-api-logs
```

#### `services/portal/docker-compose.yml`
```yaml
version: "3.8"

services:
  portal:
    build:
      context: ../../
      dockerfile: services/portal/Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    container_name: rp-requirements-portal
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: 4200
    networks:
      - suite-global
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4200"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  suite-global:
    external: true
    name: suite-beyondnet-global
```

#### `services/postgres/docker-compose.yml`
```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: rp-requirements-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - rp-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \"${POSTGRES_USER}\" -d \"${POSTGRES_DB}\""]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  rp-network:
    external: true
    name: rp-requirements-network

volumes:
  postgres_data:
    external: true
    name: rp-requirements-postgres-data
```

#### `services/rabbitmq/docker-compose.yml`
```yaml
version: "3.8"

services:
  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: rp-requirements-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - rp-network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5

networks:
  rp-network:
    external: true
    name: rp-requirements-network

volumes:
  rabbitmq_data:
    external: true
    name: rp-requirements-rabbitmq-data
```

#### `services/prometheus/docker-compose.yml`
```yaml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: rp-requirements-prometheus
    restart: unless-stopped
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=30d"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    networks:
      - rp-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9090/-/healthy"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  rp-network:
    external: true
    name: rp-requirements-network

volumes:
  prometheus_data:
    external: true
    name: rp-requirements-prometheus-data
```

#### `services/grafana/docker-compose.yml`
```yaml
version: "3.8"

services:
  grafana:
    image: grafana/grafana:latest
    container_name: rp-requirements-grafana
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_USER: ${GRAFANA_USER}
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
      GF_USERS_ALLOW_SIGN_UP: false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./provisioning:/etc/grafana/provisioning:ro
      - ./dashboards:/var/lib/grafana/dashboards:ro
    networks:
      - rp-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  rp-network:
    external: true
    name: rp-requirements-network

volumes:
  grafana_data:
    external: true
    name: rp-requirements-grafana-data
```

### Fase 3: Actualizar Compose Maestro

#### `docker-compose.yml` (Maestro)
```yaml
version: "3.8"

# Compose maestro que referencia los servicios individuales
# DockerDeploy puede usar este archivo o los individuales

services:
  # Los servicios se definen en sus respectivos directorios
  # Este archivo puede usarse para desarrollo local o como referencia
```

#### Alternativa: Usar `extends` o `include` (Docker Compose v2.20+)

Si DockerDeploy soporta `include`, podemos usar:

```yaml
version: "3.8"

include:
  - services/postgres/docker-compose.yml
  - services/rabbitmq/docker-compose.yml
  - services/api/docker-compose.yml
  - services/portal/docker-compose.yml
  - services/prometheus/docker-compose.yml
  - services/grafana/docker-compose.yml
```

### Fase 4: Actualizar Dockerfiles

Los Dockerfiles necesitan ajustar los paths del contexto:

#### `services/api/Dockerfile`
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Contexto es la raíz del workspace
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm ci

COPY apps/api/ ./apps/api/

WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:20-alpine
# ... resto igual
```

---

## 📋 Estándar DockerDeploy Compose Path

### Formato Esperado

DockerDeploy típicamente espera:

```
<workspace-root>/
├── services/
│   └── <service-name>/
│       ├── docker-compose.yml    # Compose Path para este servicio
│       ├── Dockerfile             # Dockerfile del servicio
│       └── .env.example           # Variables de entorno
```

### Compose Path por Servicio

- **API**: `services/api/docker-compose.yml`
- **Portal**: `services/portal/docker-compose.yml`
- **PostgreSQL**: `services/postgres/docker-compose.yml`
- **RabbitMQ**: `services/rabbitmq/docker-compose.yml`
- **Prometheus**: `services/prometheus/docker-compose.yml`
- **Grafana**: `services/grafana/docker-compose.yml`

---

## ✅ Checklist de Migración

### Preparación
- [ ] Crear directorio `services/`
- [ ] Crear subdirectorios para cada servicio
- [ ] Documentar estructura actual

### Migración de Archivos
- [ ] Mover Dockerfiles a `services/`
- [ ] Crear `docker-compose.yml` individuales
- [ ] Mover configuraciones de monitoreo
- [ ] Crear `.env.example` por servicio

### Actualización de Configuración
- [ ] Actualizar paths en Dockerfiles
- [ ] Actualizar contextos en docker-compose
- [ ] Configurar redes externas
- [ ] Configurar volumes externos

### Testing
- [ ] Probar build de cada servicio individualmente
- [ ] Probar compose maestro
- [ ] Verificar health checks
- [ ] Verificar conectividad entre servicios

### Documentación
- [ ] Actualizar README.md
- [ ] Documentar nueva estructura
- [ ] Crear guía de deployment con DockerDeploy

---

## 🚀 Comandos de Deployment con DockerDeploy

### Deployment Individual

```bash
# Deploy solo API
docker-compose -f services/api/docker-compose.yml up -d

# Deploy solo Portal
docker-compose -f services/portal/docker-compose.yml up -d

# Deploy solo PostgreSQL
docker-compose -f services/postgres/docker-compose.yml up -d
```

### Deployment Completo

```bash
# Opción 1: Usar compose maestro (si se implementa)
docker-compose up -d

# Opción 2: Deploy secuencial
docker-compose -f services/postgres/docker-compose.yml up -d
docker-compose -f services/rabbitmq/docker-compose.yml up -d
docker-compose -f services/api/docker-compose.yml up -d
docker-compose -f services/portal/docker-compose.yml up -d
docker-compose -f services/prometheus/docker-compose.yml up -d
docker-compose -f services/grafana/docker-compose.yml up -d
```

---

## 📝 Notas Importantes

### Contextos de Build

- Los Dockerfiles deben usar `context: ../../` (raíz del workspace)
- Los paths de COPY deben ser relativos al contexto raíz
- Ejemplo: `COPY apps/api/ ./apps/api/`

### Redes Externas

- Todos los servicios deben usar `suite-global` como red externa
- Servicios internos usan `rp-network` como red externa
- Las redes deben crearse antes del deployment

### Volumes Externos

- Todos los volumes deben ser externos
- Deben crearse antes del deployment
- Nombres consistentes: `rp-requirements-<service>-<type>`

### Variables de Entorno

- Cada servicio tiene su `.env.example`
- Variables globales en `.env` raíz
- DockerDeploy puede inyectar variables por servicio

---

## 🎯 Beneficios de esta Estructura

1. ✅ **Modularidad**: Cada servicio es independiente
2. ✅ **Escalabilidad**: Fácil agregar/quitar servicios
3. ✅ **DockerDeploy Compatible**: Sigue el estándar Compose Path
4. ✅ **Deployment Independiente**: Cada servicio puede deployarse por separado
5. ✅ **Mantenibilidad**: Más fácil de mantener y entender
6. ✅ **Testing**: Fácil probar servicios individualmente

---

## ⚠️ Consideraciones

1. **Redes Externas**: Deben existir antes del deployment
2. **Volumes Externos**: Deben crearse antes del deployment
3. **Orden de Deployment**: Servicios de infraestructura primero
4. **Dependencias**: Configurar `depends_on` correctamente
5. **Health Checks**: Todos los servicios deben tener health checks

---

**¿Proceder con la implementación de esta estructura?**

