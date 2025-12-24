# CI/CD Documentation

Este documento describe el sistema de CI/CD implementado con GitHub Actions para automatizar builds, tests, releases y deployments.

## 📋 Tabla de Contenidos

- [Workflows](#workflows)
- [Environments](#environments)
- [Secrets Configuration](#secrets-configuration)
- [Versionado](#versionado)
- [Releases](#releases)
- [Deployment](#deployment)

## 🔄 Workflows

### CI (Continuous Integration)

**Archivo**: `.github/workflows/ci.yml`

Se ejecuta en cada push y pull request a las ramas `main` y `develop`.

**Jobs**:
1. **lint-and-format**: Verifica código con ESLint
2. **test-api**: Ejecuta tests unitarios de la API con PostgreSQL
3. **build-api**: Compila la API y genera artefactos
4. **build-portal**: Compila el Portal y genera artefactos
5. **quality-gate**: Verifica que todos los jobs pasen

### CD - Development

**Archivo**: `.github/workflows/cd-dev.yml`

Se ejecuta automáticamente en push a `develop` o manualmente.

**Jobs**:
1. **deploy-api-dev**: Despliega la API al entorno de desarrollo
2. **deploy-portal-dev**: Despliega el Portal al entorno de desarrollo
3. **notify**: Envía notificaciones del resultado

### CD - Production

**Archivo**: `.github/workflows/cd-production.yml`

Se ejecuta cuando se crea un tag de versión (`v*.*.*`) o manualmente.

**Jobs**:
1. **prepare-release**: Prepara la release y genera notas
2. **deploy-api-production**: Despliega la API a producción
3. **deploy-portal-production**: Despliega el Portal a producción
4. **create-release**: Crea un release en GitHub
5. **notify-production**: Envía notificaciones

### Release

**Archivo**: `.github/workflows/release.yml`

Workflow manual para crear nuevas versiones.

**Funcionalidades**:
- Bump automático de versión (major/minor/patch)
- Generación de changelog
- Creación de PR o tag directo

### Deploy - Full Stack

**Archivo**: `.github/workflows/deploy.yml`

Workflow completo para desplegar todo el stack (API + Portal + Base de Datos) usando Docker Compose.

**Triggers:**
- Push a `main` o `develop`
- Manual dispatch con opciones de ambiente

**Características:**
- ✅ Verificación de integridad pre-deployment
- ✅ Build de imágenes Docker para API y Portal
- ✅ Deployment completo con Docker Compose
- ✅ Health checks para todos los servicios (API, Portal, Database)
- ✅ Ejecución de migraciones de base de datos
- ✅ Soporte para desarrollo y producción
- ✅ Notificaciones de deployment

**Jobs:**
1. **integrity-check**: Verifica linting, tests y builds
2. **deploy-stack**: Despliega todo el stack con Docker Compose
3. **notify**: Envía notificaciones del resultado

**Uso Manual:**
1. Ir a Actions > Deploy - Full Stack
2. Click en "Run workflow"
3. Seleccionar ambiente (development/production)
4. Opcional: Desactivar deployment de base de datos si ya existe

### Docker Build

**Archivo**: `.github/workflows/docker-build.yml`

Construye y publica imágenes Docker en el registro.

**Características**:
- Multi-platform builds (amd64, arm64)
- Cache de builds
- Tags automáticos basados en branches y versiones

## 🌍 Environments

### Development
- **Branch**: `develop`
- **Trigger**: Push automático
- **URLs**: Configuradas en secrets

### Production
- **Branch**: `main` (tags)
- **Trigger**: Tags de versión o manual
- **URLs**: Configuradas en secrets

## 🔐 Secrets Configuration

Configura los siguientes secrets en GitHub Settings > Secrets and variables > Actions:

### Database Secrets (Development)
- `DB_DEV_HOST`
- `DB_DEV_PORT`
- `DB_DEV_USERNAME`
- `DB_DEV_PASSWORD`
- `DB_DEV_DATABASE`

### Database Secrets (Production)
- `DB_PRODUCTION_HOST`
- `DB_PRODUCTION_PORT`
- `DB_PRODUCTION_USERNAME`
- `DB_PRODUCTION_PASSWORD`
- `DB_PRODUCTION_DATABASE`

### Application Secrets
- `JWT_SECRET`: Secret para JWT tokens (mínimo 32 caracteres)
- `NEXT_PUBLIC_API_URL`: URL pública de la API
- `NEXT_PUBLIC_API_URL_DEV`: URL de desarrollo de la API
- `NEXT_PUBLIC_API_URL_PRODUCTION`: URL de producción de la API

### Deployment URLs
- `API_DEV_URL`: URL del API en desarrollo
- `PORTAL_DEV_URL`: URL del Portal en desarrollo
- `API_PRODUCTION_URL`: URL del API en producción
- `PORTAL_PRODUCTION_URL`: URL del Portal en producción

### Docker Registry (Opcional)
- `DOCKER_REGISTRY`: Registro Docker (default: ghcr.io)
- `DOCKER_USERNAME`: Usuario del registro
- `DOCKER_PASSWORD`: Contraseña del registro

## 📦 Versionado

El proyecto usa [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs compatibles

### Bump Manual de Versión

```bash
# Usando el script
node scripts/version-bump.js [major|minor|patch]

# O usando el workflow manual
# Ir a Actions > Release > Run workflow
```

### Generar Changelog

```bash
node scripts/generate-changelog.js [version]

**Nota**: El changelog se genera en `docs/CHANGELOG.md`
```

## 🚀 Releases

### Crear Release Automático

1. **Opción 1: Usando el workflow**
   - Ir a Actions > Release
   - Click en "Run workflow"
   - Seleccionar tipo de versión
   - Crear PR o push directo

2. **Opción 2: Crear tag manualmente**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

### Release Notes

Las release notes se generan automáticamente desde:
- Commits desde el último tag
- Categorización automática (Added, Fixed, Changed, etc.)
- Archivo `RELEASE_NOTES.md` generado

## 🚢 Deployment

### Deployment Completo con Docker Compose

El workflow `deploy.yml` despliega todo el stack completo:

**Componentes desplegados:**
- ✅ **API** (NestJS) - Puerto 3000
- ✅ **Portal** (Next.js) - Puerto 4200
- ✅ **Base de Datos** (PostgreSQL) - Puerto 5432

**Proceso de deployment:**
1. Verificación de integridad (lint, tests, builds)
2. Build de imágenes Docker
3. Push a registro (si está configurado)
4. Deployment con Docker Compose
5. Health checks de todos los servicios
6. Ejecución de migraciones
7. Verificación final

**Ejecución automática:**
- Push a `main` → Deployment a producción
- Push a `develop` → Deployment a desarrollo

**Ejecución manual:**
```bash
# Desde GitHub Actions UI
Actions > Deploy - Full Stack > Run workflow
```

### Desarrollo

El deployment a desarrollo es automático en cada push a `develop`:

```yaml
# Se ejecuta automáticamente
on:
  push:
    branches: [develop]
```

También puedes usar el workflow `cd-dev.yml` para deployment individual de servicios.

### Producción

El deployment a producción requiere:

1. **Crear versión**:
   ```bash
   # Usar workflow Release o crear tag manualmente
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **El workflow se ejecuta automáticamente**:
   - Build de la aplicación
   - Ejecución de migraciones
   - Build de imágenes Docker
   - Push a registro
   - Deployment
   - Health checks
   - Creación de release en GitHub

### Rollback

Para hacer rollback:

```bash
# 1. Identificar versión anterior
git tag -l

# 2. Re-crear tag de versión anterior
git tag -a v0.9.0 -m "Rollback to v0.9.0"
git push origin v0.9.0

# 3. El workflow de producción se ejecutará automáticamente
```

## 📊 Monitoreo

### Status Badges

Agrega badges a tu README:

```markdown
![CI](https://github.com/USER/REPO/workflows/CI/badge.svg)
![CD Production](https://github.com/USER/REPO/workflows/CD%20-%20Production/badge.svg)
```

### Notificaciones

Configura notificaciones en los workflows:
- Slack
- Microsoft Teams
- Email
- Discord

Ejemplo para Slack:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to production completed'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🔧 Troubleshooting

### Build Fails

1. Verificar logs en Actions
2. Revisar dependencias
3. Verificar variables de entorno

### Deployment Fails

1. Verificar secrets configurados
2. Verificar conectividad con servidor
3. Revisar health checks

### Tests Fails

1. Verificar configuración de base de datos
2. Revisar migraciones
3. Verificar cobertura mínima

## 📝 Mejores Prácticas

1. **Siempre revisar PRs antes de merge**
2. **Usar conventional commits** para mejor changelog
3. **Probar en desarrollo antes de producción**
4. **Mantener secrets seguros**
5. **Documentar cambios importantes**
6. **Revisar release notes antes de publicar**

## 🔗 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

