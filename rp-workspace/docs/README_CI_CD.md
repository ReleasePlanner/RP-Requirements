# 🚀 CI/CD Setup Guide

Guía rápida para configurar y usar el sistema de CI/CD con GitHub Actions.

## ⚡ Inicio Rápido

### 1. Configurar Secrets en GitHub

Ve a **Settings > Secrets and variables > Actions** y agrega:

#### Secrets Mínimos Requeridos

```bash
# Database - Development
DB_DEV_HOST=your-dev-db-host
DB_DEV_USERNAME=your-dev-db-user
DB_DEV_PASSWORD=your-dev-db-password
DB_DEV_DATABASE=your-dev-db-name

# Database - Production  
DB_PRODUCTION_HOST=your-prod-db-host
DB_PRODUCTION_USERNAME=your-prod-db-user
DB_PRODUCTION_PASSWORD=your-prod-db-password
DB_PRODUCTION_DATABASE=your-prod-db-name

# Application
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_API_URL_DEV=https://api-dev.example.com/api/v1
NEXT_PUBLIC_API_URL_PRODUCTION=https://api.example.com/api/v1

# URLs (opcional)
API_DEV_URL=https://api-dev.example.com
PORTAL_DEV_URL=https://portal-dev.example.com
API_PRODUCTION_URL=https://api.example.com
PORTAL_PRODUCTION_URL=https://portal.example.com
```

### 2. Activar Workflows

Los workflows se activan automáticamente. Verifica en **Actions** que estén funcionando.

### 3. Primer Deployment

#### Desarrollo
```bash
# Push a develop activa el deployment automático
git checkout develop
git push origin develop
```

#### Producción
```bash
# Crear tag de versión
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 📋 Workflows Disponibles

| Workflow | Trigger | Descripción |
|----------|---------|-------------|
| **CI** | Push/PR a main/develop | Build, test, lint |
| **CD - Development** | Push a develop | Deploy a desarrollo |
| **CD - Production** | Tag v*.*.* | Deploy a producción |
| **Release** | Manual | Crear nueva versión |
| **Docker Build** | Push a main/develop | Build imágenes Docker |

## 🎯 Uso Común

### Crear Nueva Versión

**Opción 1: Workflow Manual**
1. Ve a **Actions > Release**
2. Click **Run workflow**
3. Selecciona tipo: `major`, `minor`, o `patch`
4. Elige crear PR o push directo

**Opción 2: Script Local**
```bash
node scripts/version-bump.js patch
git add .
git commit -m "chore: bump version"
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin main && git push origin v1.0.1
```

### Ver Estado de Builds

```bash
# Ver últimos workflows
gh run list

# Ver detalles de un workflow
gh run view <run-id>
```

### Rollback

```bash
# 1. Identificar versión anterior
git tag -l

# 2. Re-crear tag
git tag -a v0.9.0 -m "Rollback to v0.9.0"
git push origin v0.9.0
```

## 🔍 Troubleshooting

### Build Falla

1. Revisar logs en **Actions**
2. Verificar que todos los secrets estén configurados
3. Verificar sintaxis YAML en workflows

### Tests Fallan

1. Verificar que PostgreSQL esté disponible en CI
2. Revisar variables de entorno de test
3. Verificar cobertura mínima

### Deployment Falla

1. Verificar secrets de base de datos
2. Verificar conectividad con servidor
3. Revisar health checks

## 📚 Documentación Completa

Ver [docs/CI_CD.md](docs/CI_CD.md) para documentación detallada.

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar logs en GitHub Actions
2. Consultar documentación en `docs/CI_CD.md`
3. Crear issue en el repositorio

