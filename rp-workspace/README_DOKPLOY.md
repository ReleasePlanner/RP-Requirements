# 🚀 Dokploy Deployment Guide

## 📋 Inicio Rápido

Esta guía te ayudará a desplegar todos los servicios en Dokploy de forma sencilla.

## 🎯 Compose Paths

Todos los servicios están organizados en `services/` con sus propios `docker-compose.yml`:

| Servicio | Compose Path |
|----------|-------------|
| PostgreSQL | `services/postgres/docker-compose.yml` |
| RabbitMQ | `services/rabbitmq/docker-compose.yml` |
| API | `services/api/docker-compose.yml` |
| Portal | `services/portal/docker-compose.yml` |
| Prometheus | `services/prometheus/docker-compose.yml` |
| Grafana | `services/grafana/docker-compose.yml` |

## ⚙️ Configuración en Dokploy

### Para cada servicio:

1. **Tipo**: Docker Compose
2. **Compose Path**: Ver tabla arriba
3. **Build Context**: `.` (punto - raíz del workspace)
4. **Repository**: Tu repositorio Git
5. **Branch**: `main` o `master`

## 📝 Variables de Entorno

Cada servicio necesita variables específicas. Ver:
- [Dokploy Setup](docs/DOKPLOY_SETUP.md) - Guía completa con todas las variables
- [Dokploy Quick Start](docs/DOKPLOY_QUICK_START.md) - Configuración rápida

## 🔗 Orden de Deployment

1. **PostgreSQL** (infraestructura base)
2. **RabbitMQ** (infraestructura base)
3. **API** (requiere PostgreSQL y RabbitMQ)
4. **Portal** (requiere API)
5. **Prometheus** (opcional - monitoreo)
6. **Grafana** (opcional - visualización)

## 📚 Documentación Completa

- **[Dokploy Setup](docs/DOKPLOY_SETUP.md)** - Guía completa paso a paso
- **[Dokploy Quick Start](docs/DOKPLOY_QUICK_START.md)** - Configuración rápida
- **[Compose Paths Reference](dokploy-compose-paths.txt)** - Referencia rápida

## ✅ Verificación

Después del deployment, verifica que todos los servicios estén corriendo:

```bash
docker ps --filter "name=rp-requirements"
```

---

**Listo para Dokploy** ✅

