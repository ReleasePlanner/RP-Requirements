# 📋 Requirements Management System

Complete requirements management system built with **NestJS** (API) and **Next.js** (Portal), following Clean Architecture principles, SOLID, and OWASP security best practices.

**Repository**: [ReleasePlanner/RP-Requirements](https://github.com/ReleasePlanner/RP-Requirements)

[![CI](https://github.com/ReleasePlanner/RP-Requirements/workflows/CI/badge.svg)](https://github.com/ReleasePlanner/RP-Requirements/actions)
[![Deploy to Hostinger VPS](https://github.com/ReleasePlanner/RP-Requirements/workflows/Deploy%20to%20Hostinger%20VPS/badge.svg)](https://github.com/ReleasePlanner/RP-Requirements/actions)

---

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Inicio Rápido](#-inicio-rápido)
- [Deployment](#-deployment)
- [Documentación](#-documentación)
- [Testing](#-testing)
- [Monitoreo](#-monitoreo)
- [Configuración](#-configuración)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Características Principales

### 📊 Gestión de Requisitos

- ✅ Gestión completa de requisitos con matriz de priorización Belcorp
- ✅ Asociación con Portfolios, Iniciativas, Epics
- ✅ Seguimiento de esfuerzo, valor de negocio y métricas
- ✅ Control de descubrimiento funcional y experimentación
- ✅ Referencias externas (Jira, Azure DevOps)
- ✅ Dependencias de equipos

### 🏗️ Arquitectura

- ✅ **Clean Architecture** con separación de capas
- ✅ **Principios SOLID** aplicados
- ✅ **Domain-Driven Design (DDD)**
- ✅ **TypeORM** para persistencia
- ✅ **PostgreSQL** como base de datos

### 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Rate Limiting (OWASP)
- ✅ Validación de entrada
- ✅ Sanitización de datos sensibles
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad

### 📊 Monitoreo

- ✅ Métricas en tiempo real
- ✅ Logging estructurado con Winston
- ✅ Health checks detallados
- ✅ Dashboard de monitoreo en Portal
- ✅ Métricas de rendimiento y errores

### 🚀 CI/CD

- ✅ GitHub Actions para CI/CD completo
- ✅ Tests automatizados con 100% de cobertura
- ✅ Deployment automatizado con Docker Compose
- ✅ Verificaciones de integridad pre-deployment
- ✅ Releases automatizados
- ✅ **Deployment automático a VPS Hostinger** 🆕

---

## 🏛️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Portal (Next.js)                     │
│              Port: 4200                                 │
│  - Dashboard                                            │
│  - Requirements Management                              │
│  - Monitoring Dashboard                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────────┐
│              API (NestJS)                               │
│              Port: 3000                                 │
│  ┌──────────────────────────────────────────────┐     │
│  │  Presentation Layer (Controllers)             │     │
│  │  - Auth, Requirements, Portfolios, etc.      │     │
│  └──────────────────┬───────────────────────────┘     │
│  ┌──────────────────▼───────────────────────────┐     │
│  │  Application Layer (Services)                 │     │
│  │  - Business Logic                             │     │
│  └──────────────────┬───────────────────────────┘     │
│  ┌──────────────────▼───────────────────────────┐     │
│  │  Domain Layer (Entities)                      │     │
│  │  - Requirement, Portfolio, Epic, etc.          │     │
│  └──────────────────┬───────────────────────────┘     │
│  ┌──────────────────▼───────────────────────────┐     │
│  │  Infrastructure Layer                         │     │
│  │  - Repositories, Database, External APIs     │     │
│  └──────────────────┬───────────────────────────┘     │
└──────────────────────┼──────────────────────────────────┘
                      │ TypeORM
┌──────────────────────▼──────────────────────────────────┐
│         PostgreSQL Database                             │
│         Port: 5432                                      │
│  - 18 Main entities                                     │
│  - Automatic migrations                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Opción 1: Docker Compose (Recomendado para Desarrollo Local)

```bash
# 1. Clonar repositorio
git clone https://github.com/ReleasePlanner/RP-Requirements.git
cd RP-Requirements/rp-workspace

# 2. Configurar variables de entorno
cp env.docker.example .env
# Editar .env con tus valores

# 3. Iniciar todos los servicios
make up
# o
docker-compose up -d

# 4. Verificar que todo funciona
make health
```

**Servicios Disponibles:**

- 🌐 Portal: http://localhost:4200
- 🔌 API: http://localhost:3000/api/v1
- 📚 Swagger: http://localhost:3000/api/docs
- 🗄️ PostgreSQL: localhost:5432

### Opción 2: Desarrollo Local

```bash
# 1. Entrar al workspace
cd rp-workspace

# 2. Instalar dependencias
npm ci

# 3. Configurar base de datos PostgreSQL
# Crear base de datos: requirements_db
# Configurar variables de entorno en apps/api/.env

# 4. Ejecutar migraciones y seed
cd apps/api
npm run migration:run
npm run seed:run

# 5. Iniciar API (desde rp-workspace)
cd ../..
npm run start:api

# 6. En otra terminal, iniciar Portal (desde rp-workspace)
cd rp-workspace
npm run start:portal
```

📖 **Guía Completa**: Ver [docs/QUICK_START_DOCKER.md](rp-workspace/docs/QUICK_START_DOCKER.md)

---

## 🚀 Deployment

### ⭐ Deployment Automático con GitHub Actions (Recomendado)

El sistema incluye deployment automático a VPS Hostinger mediante GitHub Actions.

#### Configuración Inicial

1. **Configurar Secrets en GitHub**:

   - ⚡ **Resumen Rápido**: [Resumen Configuración Secrets](rp-workspace/deploy-on-vps/RESUMEN_CONFIGURACION_SECRETS.md) (5 minutos)
   - 📖 **Guía Completa**: [Configurar Secrets en GitHub](rp-workspace/deploy-on-vps/CONFIGURAR_SECRETS_GITHUB.md) ⭐ (guía detallada paso a paso)
   - Ve a: `Settings > Secrets and variables > Actions` en tu repositorio
   - Agrega los secrets requeridos (ver guías arriba)

2. **Ejecutar Test SSH** (Recomendado primero):

   - Ve a: `Actions > Test SSH Connection > Run workflow`
   - Verifica que la conexión SSH funcione

3. **Deployment Automático**:
   - Push a `main` → Deployment a producción
   - Push a `develop` → Deployment a desarrollo
   - O ejecuta manualmente: `Actions > Deploy to Hostinger VPS > Run workflow`

📖 **Guía Completa**:

- [GitHub-Hostinger Integration](rp-workspace/deploy-on-vps/GITHUB_HOSTINGER_INTEGRATION.md) - Configuración completa
- [Primer Deployment](rp-workspace/deploy-on-vps/PRIMER_DEPLOYMENT.md) - Guía paso a paso
- [Ejecutar Test SSH](rp-workspace/deploy-on-vps/EJECUTAR_TEST_SSH.md) - Verificar conexión

#### Secrets Requeridos

**📖 Guía Completa**: Ver [Configurar Secrets en GitHub](rp-workspace/deploy-on-vps/CONFIGURAR_SECRETS_GITHUB.md)

**Configuración Rápida:**

1. Ve a: `Settings > Secrets and variables > Actions` en tu repositorio GitHub
2. Agrega los siguientes secrets:

**🔴 Obligatorios:**

- `VPS_HOST` - IP o dominio de tu VPS (ej: `72.60.63.240`)
- `VPS_USER` - Usuario SSH (ej: `root`)
- `VPS_SSH_KEY` **O** `VPS_SSH_PASSWORD` - Credenciales SSH (recomendado: usar SSH Key)
- `DB_USERNAME` - Usuario PostgreSQL (ej: `requirements_user`)
- `DB_PASSWORD` - Contraseña PostgreSQL
- `DB_DATABASE` - Nombre de BD (ej: `requirements_db`)
- `JWT_SECRET` - Secret JWT (mínimo 32 caracteres)

**🟡 Opcionales:**

- `DB_PORT` - Puerto PostgreSQL (default: `5432`)
- `JWT_EXPIRES_IN` - Expiración token (default: `1d`)
- `NEXT_PUBLIC_API_URL_DEV` - URL API desarrollo
- `NEXT_PUBLIC_API_URL_PRODUCTION` - URL API producción
- `API_DEV_URL`, `API_PRODUCTION_URL` - URLs completas para health checks
- `PORTAL_DEV_URL`, `PORTAL_PRODUCTION_URL` - URLs del Portal

**💡 Tip**: Usa SSH Key en lugar de contraseña para mayor seguridad. Ver la guía completa para instrucciones detalladas.

### Deployment Manual en VPS

Si prefieres deployment manual, consulta:

- [Plan de Deployment](rp-workspace/deploy-on-vps/PLAN_DEPLOYMENT_REQUIREMENTS.md) - Guía completa paso a paso
- [Quick Start VPS](rp-workspace/deploy-on-vps/QUICK_START_VPS.md) - 5 comandos rápidos
- [Scripts de Deployment](rp-workspace/deploy-on-vps/) - Scripts disponibles

### Deployment Local con Docker

```bash
# 1. Construir imágenes Docker
docker-compose build

# 2. Iniciar servicios
docker-compose up -d

# 3. Verificar salud
curl http://localhost:3000/api/v1/health/liveness
curl http://localhost:4200
```

📖 **Documentación Completa**: Ver [docs/DEPLOYMENT.md](rp-workspace/docs/DEPLOYMENT.md)

---

## 📚 Documentación

### 📖 Índice de Documentación

Toda la documentación está organizada en [`docs/`](rp-workspace/docs/) y [`deploy-on-vps/`](rp-workspace/deploy-on-vps/):

#### 🚀 Guías de Inicio Rápido

- **[QUICK_START_DOCKER.md](rp-workspace/docs/QUICK_START_DOCKER.md)** - Inicio rápido con Docker Compose (3 pasos)
- **[README_DEPLOYMENT.md](rp-workspace/docs/README_DEPLOYMENT.md)** - Guía rápida de deployment

#### 🐳 Docker y Deployment

- **[README_DOCKER.md](rp-workspace/docs/README_DOCKER.md)** - Guía completa de Docker Setup
- **[DEPLOYMENT.md](rp-workspace/docs/DEPLOYMENT.md)** - Guía completa de deployment y compilación

#### 🔄 CI/CD

- **[README_CI_CD.md](rp-workspace/docs/README_CI_CD.md)** - Guía rápida de CI/CD
- **[CI_CD.md](rp-workspace/docs/CI_CD.md)** - Documentación completa de CI/CD

#### 🚀 Deployment en VPS Hostinger

Todos los archivos de deployment están en [`deploy-on-vps/`](rp-workspace/deploy-on-vps/):

- **[RESUMEN_CONFIGURACION_SECRETS.md](rp-workspace/deploy-on-vps/RESUMEN_CONFIGURACION_SECRETS.md)** - ⚡ **Resumen Rápido** - Configuración en 5 minutos
- **[CONFIGURAR_SECRETS_GITHUB.md](rp-workspace/deploy-on-vps/CONFIGURAR_SECRETS_GITHUB.md)** - 🔐 **⭐ CÓMO CONFIGURAR SECRETS EN GITHUB** - Guía paso a paso completa
- **[GITHUB_HOSTINGER_INTEGRATION.md](rp-workspace/deploy-on-vps/GITHUB_HOSTINGER_INTEGRATION.md)** - 🔗 **GitHub Actions Integration** - Deployment automático desde GitHub
- **[PRIMER_DEPLOYMENT.md](rp-workspace/deploy-on-vps/PRIMER_DEPLOYMENT.md)** - ⭐ **Guía del Primer Deployment**
- **[EJECUTAR_TEST_SSH.md](rp-workspace/deploy-on-vps/EJECUTAR_TEST_SSH.md)** - 🧪 Ejecutar Test SSH Connection
- **[PLAN_DEPLOYMENT_REQUIREMENTS.md](rp-workspace/deploy-on-vps/PLAN_DEPLOYMENT_REQUIREMENTS.md)** - Plan completo paso a paso
- **[QUICK_START_VPS.md](rp-workspace/deploy-on-vps/QUICK_START_VPS.md)** - ⚡ Guía rápida de 5 comandos
- **[CHECKLIST_VERIFICACION.md](rp-workspace/deploy-on-vps/CHECKLIST_VERIFICACION.md)** - ✅ Checklist de verificación completa
- **[TROUBLESHOOTING_GITHUB_ACTIONS.md](rp-workspace/deploy-on-vps/TROUBLESHOOTING_GITHUB_ACTIONS.md)** - 🔧 Troubleshooting GitHub Actions
- **[TROUBLESHOOTING_SSH.md](rp-workspace/deploy-on-vps/TROUBLESHOOTING_SSH.md)** - 🔧 Troubleshooting SSH
- **[TROUBLESHOOTING_SSH_PERMISSION_DENIED.md](rp-workspace/deploy-on-vps/TROUBLESHOOTING_SSH_PERMISSION_DENIED.md)** - 🔧 **Permission denied (publickey,password)** - Solución paso a paso
- Ver [`deploy-on-vps/`](rp-workspace/deploy-on-vps/) para todos los scripts y documentación

#### 📊 Monitoreo y Verificación

- **[MONITORING.md](rp-workspace/docs/MONITORING.md)** - Sistema de monitoreo completo
- **[INTEGRITY_CHECKS.md](rp-workspace/docs/INTEGRITY_CHECKS.md)** - Verificación de integridad y cobertura
- **[INTEGRITY_REPORT.md](rp-workspace/docs/INTEGRITY_REPORT.md)** - Reporte de integridad del sistema
- **[INTEGRITY_CHECKLIST.md](rp-workspace/docs/INTEGRITY_CHECKLIST.md)** - Checklist de verificación

#### 🗄️ Base de Datos

- **[README-DATABASE.md](rp-workspace/docs/README-DATABASE.md)** - Documentación completa de base de datos
- **[requirements-fields.md](rp-workspace/docs/requirements-fields.md)** - Campos de requisitos y modelo de datos

#### 📝 Historial de Cambios

- **[CHANGELOG.md](rp-workspace/docs/CHANGELOG.md)** - Historial de cambios del proyecto

### 📖 Documentación por Aplicación

#### API (NestJS)

Ver documentación completa en [`apps/api/docs/`](rp-workspace/apps/api/docs/):

- Arquitectura y estructura
- Guías de testing
- Reglas de compatibilidad
- Guías de implementación

#### Portal (Next.js)

Ver [`apps/portal/README.md`](rp-workspace/apps/portal/README.md) para documentación del portal.

---

## 🧪 Testing

### Tests Unitarios

```bash
# Ejecutar todos los tests (desde rp-workspace)
cd rp-workspace/apps/api && npm test

# Tests con cobertura (desde rp-workspace)
cd rp-workspace/apps/api && npm run test:cov

# Verificar cobertura (100% requerido) (desde rp-workspace)
cd rp-workspace/apps/api && npm run test:cov:check
```

### Test Scenarios y Scripts de Verificación

El proyecto incluye scripts de testing y debugging en [`tests/`](rp-workspace/tests/):

- **[test-api.js](rp-workspace/tests/test-api.js)** - Tests básicos de API (login, autenticación)
- **[test-requirements.js](rp-workspace/tests/test-requirements.js)** - Tests específicos de requisitos
- **[verify-full-flow.js](rp-workspace/tests/verify-full-flow.js)** - Verificación del flujo completo
- **[verify-rules.js](rp-workspace/tests/verify-rules.js)** - Verificación de reglas y validaciones
- **[api-debug.js](rp-workspace/tests/api-debug.js)** - Scripts de debugging para la API

📖 **Documentación Completa**: Ver [tests/README.md](rp-workspace/tests/README.md)

---

## 📊 Monitoreo

### Dashboard de Monitoreo

Accede al dashboard en: **http://localhost:4200/portal/monitoring**

**Métricas Disponibles:**

- Total de requests
- Tasa de errores
- Tiempo promedio de respuesta
- Requests lentos (>500ms)
- Errores recientes
- Recursos del sistema (CPU, Memoria)

### Endpoints de Monitoreo

```bash
# Métricas generales
GET /api/v1/monitoring/metrics

# Métricas de requests
GET /api/v1/monitoring/metrics/requests

# Métricas de errores
GET /api/v1/monitoring/metrics/errors

# Health check detallado
GET /api/v1/monitoring/health/detailed

# Recursos del sistema
GET /api/v1/monitoring/system
```

📖 **Documentación Completa**: Ver [docs/MONITORING.md](rp-workspace/docs/MONITORING.md)

---

## ⚙️ Configuración

### Variables de Entorno

#### API (apps/api/.env o .env para Docker)

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:4200

# Monitoring
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
LOG_LEVEL=info
```

#### Portal

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

📖 **Configuración Completa**: Ver [`env.docker.example`](rp-workspace/env.docker.example)

---

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
# Iniciar API en modo desarrollo (desde rp-workspace)
cd rp-workspace && npm run start:api

# Iniciar Portal en modo desarrollo (desde rp-workspace)
cd rp-workspace && npm run start:portal

# Ejecutar tests (desde rp-workspace)
cd rp-workspace && npm run test:api

# Ejecutar tests con cobertura (desde rp-workspace)
cd rp-workspace/apps/api && npm run test:cov

# Linting (desde rp-workspace)
cd rp-workspace && npm run lint:api
cd rp-workspace/apps/portal && npm run lint
```

### Build

```bash
# Build API (desde rp-workspace)
cd rp-workspace && npm run build:api

# Build Portal (desde rp-workspace)
cd rp-workspace/apps/portal && npm run build
```

### Docker

```bash
# Ver todos los comandos disponibles (desde rp-workspace)
cd rp-workspace && make help

# Iniciar servicios (desde rp-workspace)
cd rp-workspace && make up

# Detener servicios (desde rp-workspace)
cd rp-workspace && make down

# Ver logs (desde rp-workspace)
cd rp-workspace && make logs
cd rp-workspace && make logs-api
cd rp-workspace && make logs-portal

# Health checks (desde rp-workspace)
cd rp-workspace && make health

# Ejecutar migraciones (desde rp-workspace)
cd rp-workspace && make migrate

# Seed de base de datos (desde rp-workspace)
cd rp-workspace && make seed
```

---

## 🗄️ Base de Datos

### Estructura

- **18 Entidades principales**
- **PostgreSQL 15+**
- **TypeORM** como ORM
- **Migraciones automáticas**

### Entidades Principales

- `Portfolio` - Portfolios estratégicos
- `Initiative` - Iniciativas
- `Epic` - Epics
- `Requirement` - Requisitos
- `Sponsor` - Sponsors
- `ProductOwner` - Product Owners
- Catálogos (Priority, Status, Complexity, etc.)

📖 **Documentación Completa**: Ver [docs/README-DATABASE.md](rp-workspace/docs/README-DATABASE.md)

---

## 🔍 Verificación de Integridad

Ejecuta el script de verificación para asegurar que todo esté correctamente configurado:

```bash
cd rp-workspace && ./scripts/verify-integrity.sh
```

Este script verifica:

- ✅ Estructura de archivos
- ✅ Configuración de base de datos
- ✅ Integración de monitoreo
- ✅ Configuración de Docker
- ✅ Workflows de CI/CD

📖 **Documentación Completa**: Ver [docs/INTEGRITY_CHECKS.md](rp-workspace/docs/INTEGRITY_CHECKS.md)

---

## 🛡️ Seguridad

### Mejores Prácticas Implementadas

- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Rate Limiting** para prevenir abuso
- ✅ **Validación de Entrada** con class-validator
- ✅ **Protección contra SQL Injection** con TypeORM
- ✅ **Protección XSS** con sanitización
- ✅ **CORS** correctamente configurado
- ✅ **Helmet** para headers de seguridad
- ✅ **Gestión de Secrets** con variables de entorno

### Configuración de Seguridad

```env
# JWT Secret (mínimo 32 caracteres)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS
CORS_ORIGIN=http://localhost:4200
```

---

## 🐛 Troubleshooting

### Problemas Comunes

#### API no inicia

```bash
# Verificar variables de entorno
cat rp-workspace/apps/api/.env

# Verificar conexión a base de datos
psql -h localhost -U postgres -d requirements_db

# Ver logs (desde rp-workspace)
cd rp-workspace && make logs-api
```

#### Portal no puede conectarse a API

```bash
# Verificar variable NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_API_URL

# Verificar si API está corriendo
curl http://localhost:3000/api/v1/health/liveness
```

#### Base de datos no conecta

```bash
# Verificar servicio PostgreSQL (desde rp-workspace)
cd rp-workspace && docker-compose ps postgres

# Ver logs de base de datos (desde rp-workspace)
cd rp-workspace && make logs-db

# Verificar variables de entorno (desde rp-workspace)
cd rp-workspace && docker-compose config
```

### Troubleshooting Deployment

- **[Troubleshooting GitHub Actions](rp-workspace/deploy-on-vps/TROUBLESHOOTING_GITHUB_ACTIONS.md)** - Problemas con workflows
- **[Troubleshooting SSH](rp-workspace/deploy-on-vps/TROUBLESHOOTING_SSH.md)** - Problemas de conexión SSH
- **[Checklist de Verificación](rp-workspace/deploy-on-vps/CHECKLIST_VERIFICACION.md)** - Verificación completa

---

## 📋 Estructura del Proyecto

```
rp-workspace/
├── apps/
│   ├── api/                 # NestJS API
│   │   ├── src/
│   │   │   ├── domain/      # Entidades de dominio
│   │   │   ├── application/ # Lógica de negocio
│   │   │   ├── infrastructure/ # Repositorios, DB
│   │   │   ├── presentation/ # Controladores, DTOs
│   │   │   └── shared/      # Utilidades compartidas
│   │   └── docs/            # Documentación de API
│   └── portal/              # Next.js Portal
│       └── src/
│           ├── app/         # Rutas de Next.js
│           ├── features/    # Features del Portal
│           └── components/ # Componentes UI
├── docs/                    # Documentación completa
├── deploy-on-vps/          # Scripts y docs de deployment VPS
├── scripts/                 # Scripts de automatización
├── tests/                   # Scripts de testing y debugging
├── .github/workflows/       # Workflows de CI/CD (si existe)
├── docker-compose.yml       # Orquestación Docker
└── Makefile                # Comandos útiles
```

---

## 📊 Estado del Proyecto

### ✅ Completado

- ✅ API completa con Clean Architecture
- ✅ Portal completo con Next.js
- ✅ Sistema de monitoreo integrado
- ✅ CI/CD completo con GitHub Actions
- ✅ Docker Compose para deployment
- ✅ Tests con 100% de cobertura
- ✅ Documentación completa
- ✅ **Deployment automático a VPS Hostinger** 🆕

### 🚧 En Desarrollo

- Mejoras continuas de rendimiento
- Nuevas features según requerimientos

---

## 🤝 Contribuir

### Proceso de Contribución

1. Crear una rama desde `develop`
2. Hacer cambios
3. Ejecutar tests y linting
4. Crear Pull Request
5. Esperar revisión y aprobación

### Estándares de Código

- ✅ **ESLint** para linting
- ✅ **Prettier** para formato
- ✅ **100% Coverage** requerido
- ✅ **Conventional Commits** recomendado

---

## 📞 Soporte

Para soporte o preguntas:

- Crear un Issue en GitHub
- Revisar documentación en [`docs/`](rp-workspace/docs/)
- Revisar documentación de deployment en [`deploy-on-vps/`](rp-workspace/deploy-on-vps/)
- Ver logs: `cd rp-workspace && make logs`
- Ejecutar test scenarios: [`tests/`](rp-workspace/tests/)
- Verificar integridad: `cd rp-workspace && ./scripts/verify-integrity.sh`

---

## 🔗 Enlaces Útiles

### Documentación

- [Índice de Documentación](rp-workspace/docs/README.md)
- [Guía de Inicio Rápido](rp-workspace/docs/QUICK_START_DOCKER.md)
- [Guía de Deployment](rp-workspace/docs/DEPLOYMENT.md)
- [Documentación CI/CD](rp-workspace/docs/CI_CD.md)
- [Documentación de Monitoreo](rp-workspace/docs/MONITORING.md)
- [Documentación de Base de Datos](rp-workspace/docs/README-DATABASE.md)

### Deployment

- [GitHub-Hostinger Integration](rp-workspace/deploy-on-vps/GITHUB_HOSTINGER_INTEGRATION.md) - ⭐ Deployment automático
- [Primer Deployment](rp-workspace/deploy-on-vps/PRIMER_DEPLOYMENT.md) - Guía paso a paso
- [Plan de Deployment](rp-workspace/deploy-on-vps/PLAN_DEPLOYMENT_REQUIREMENTS.md) - Plan completo
- [Quick Start VPS](rp-workspace/deploy-on-vps/QUICK_START_VPS.md) - 5 comandos rápidos

### Testing

- [Test Scenarios](rp-workspace/tests/README.md)
- [Scripts de Testing](rp-workspace/tests/)

### Aplicación

- [API Swagger](http://localhost:3000/api/docs)
- [Monitoring Dashboard](http://localhost:4200/portal/monitoring)
- [API Health Check](http://localhost:3000/api/v1/health/liveness)

### CI/CD

- [GitHub Actions](https://github.com/ReleasePlanner/RP-Requirements/actions)
- [Deploy to Hostinger VPS](.github/workflows/deploy-hostinger.yml) 🆕 - Deployment automático al VPS
- [Test SSH Connection](.github/workflows/test-ssh-connection.yml) 🆕 - Probar conexión SSH
- [Workflows README](.github/workflows/README.md) - Documentación de workflows

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

---

**Desarrollado con ❤️ usando NestJS, Next.js y PostgreSQL**
