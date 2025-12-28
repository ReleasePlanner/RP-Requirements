# PostgreSQL Service

## 📋 Descripción

Base de datos PostgreSQL 15 para el sistema de Requirements, incluyendo pgAdmin 4 para administración web.

## 🐳 Docker Compose Path

**Compose Path para DockerDeploy**: `services/postgres/docker-compose.yml`

## 🚀 Deployment

### Con DockerDeploy

```bash
# El Compose Path es: services/postgres/docker-compose.yml
docker-compose -f services/postgres/docker-compose.yml up -d
```

### Manual

```bash
cd services/postgres
docker-compose up -d
```

## 📝 Variables de Entorno

**Variables requeridas**:
- `DB_USERNAME`: Usuario de PostgreSQL
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `DB_DATABASE`: Nombre de la base de datos

**Variables opcionales para pgAdmin**:
- `PGADMIN_EMAIL`: Email para acceso a pgAdmin (default: admin@admin.com)
- `PGADMIN_PASSWORD`: Contraseña para acceso a pgAdmin (default: admin)
- `PGADMIN_PORT`: Puerto para acceder a pgAdmin (default: 5050)

## 🌐 Redes

- `rp-network`: Red interna para comunicación con otros servicios

## 💾 Volumes

- `postgres_data`: Datos persistentes de PostgreSQL
- `pgadmin_data`: Configuración y sesiones de pgAdmin

## 📊 Health Check

- **PostgreSQL**: Verifica que PostgreSQL esté listo para conexiones
- **pgAdmin**: Verifica que la interfaz web esté disponible

## 🔧 Acceso a pgAdmin

Una vez desplegado, accede a pgAdmin en:
- **URL**: `http://localhost:5050` (o el puerto configurado en `PGADMIN_PORT`)
- **Email**: El valor de `PGADMIN_EMAIL` (default: admin@admin.com)
- **Password**: El valor de `PGADMIN_PASSWORD` (default: admin)

### Configurar conexión a PostgreSQL en pgAdmin

1. Inicia sesión en pgAdmin
2. Click derecho en "Servers" → "Register" → "Server"
3. En la pestaña "General":
   - **Name**: Requirements DB (o el nombre que prefieras)
4. En la pestaña "Connection":
   - **Host name/address**: `rp-requirements-postgres` (nombre del contenedor)
   - **Port**: `5432`
   - **Maintenance database**: Valor de `DB_DATABASE`
   - **Username**: Valor de `DB_USERNAME`
   - **Password**: Valor de `DB_PASSWORD`
   - Marca "Save password" si deseas guardarla
5. Click en "Save"

