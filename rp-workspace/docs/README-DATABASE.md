# Base de Datos PostgreSQL - Gestión de Requisitos

Este directorio contiene los scripts SQL para crear la base de datos PostgreSQL basada en el diseño ERD (`database.puml`).

## Archivos

- **`database.sql`**: Script principal de creación de la base de datos
- **`database-migration.sql`**: Script para eliminar y recrear la base de datos (usar con precaución)
- **`database.puml`**: Diagrama ERD original en PlantUML

## Estructura de la Base de Datos

### 1. Catálogos (Lookup Tables)
- `Priority`: Prioridades de requisitos
- `Status`: Estados de requisitos
- `Type`: Tipos de requisitos (User Story, Bug, Task, etc.)
- `Complexity`: Complejidad (S, M, L, XL)
- `Source`: Origen del requisito (Cliente, Legal, PO, etc.)
- `EffortEstimateType`: Tipo de estimación (Story Points, Hours, Days)
- `RiskLevel`: Niveles de riesgo (Alto, Medio, Bajo) con tipo (Técnico, Legal)
- `Metric`: Métricas/KPIs asociados a requisitos

### 2. Estrategia y Portafolio
- `Portfolio`: Portafolios estratégicos
- `Initiative`: Iniciativas dentro de portafolios
- `Epic`: Épicos dentro de iniciativas
- `Requirement`: Requisitos dentro de épicos

### 3. Ejecución y Agile
- `Product`: Productos
- `Sprint`: Sprints de desarrollo
- `Backlog`: Backlog de productos (clave primaria compuesta)
- `TechnicalTask`: Tareas técnicas asociadas a requisitos
- `Release`: Releases de productos

### 4. Calidad y Usuarios
- `User`: Usuarios del sistema
- `TestCase`: Casos de prueba
- `Defect`: Defectos/bugs
- `Req_TestCase`: Relación N:N entre Requisitos y Casos de Prueba
- `Req_Defect`: Relación N:N entre Requisitos y Defectos

## Características Importantes

### Clave Primaria Compuesta en Backlog
La tabla `Backlog` tiene una clave primaria compuesta `(BacklogID, ItemID)` según el diseño ERD. Esto permite que un mismo requisito (`ItemID`) pueda estar en múltiples backlogs diferentes (`BacklogID`).

### Relación Release-Requirement
El campo `ReleaseID` se agrega a la tabla `Requirement` mediante `ALTER TABLE` después de crear la tabla `Release`, debido a dependencias circulares en el orden de creación.

### Tipos de Datos
- **Catálogos**: Usan `SERIAL` (INTEGER autoincremental)
- **Entidades principales**: Usan `UUID` con generación automática mediante `uuid_generate_v4()`
- **Fechas**: `DATE` para fechas simples, `TIMESTAMP` para fechas con hora
- **Decimales**: `DECIMAL(18, 2)` para valores monetarios y beneficios

### Acciones ON DELETE
- **CASCADE**: Para relaciones jerárquicas donde la eliminación del padre debe eliminar los hijos
  - Portfolio → Initiative → Epic → Requirement
  - Product → Sprint, Release, Backlog
  - Requirement → TechnicalTask, Backlog items
  
- **SET NULL**: Para relaciones opcionales donde la eliminación no debe afectar los registros relacionados
  - Catálogos → Requirement
  - User → Requirement (Owner), TechnicalTask, Defect
  - Release → Requirement
  - Sprint → Backlog

## Instalación

### Opción 1: Crear desde cero

```bash
# Crear la base de datos
createdb -U postgres requirements_db

# Ejecutar el script de creación
psql -U postgres -d requirements_db -f database.sql
```

### Opción 2: Migración completa (elimina datos existentes)

```bash
# Ejecutar script de migración
psql -U postgres -d requirements_db -f database-migration.sql

# Luego ejecutar el script de creación
psql -U postgres -d requirements_db -f database.sql
```

### Opción 3: Desde psql interactivo

```sql
\c requirements_db
\i database.sql
```

## Verificación

Después de ejecutar el script, puedes verificar la creación con:

```sql
-- Listar todas las tablas
\dt

-- Ver estructura de una tabla específica
\d Requirement

-- Contar registros en catálogos
SELECT 'Priority' as tabla, COUNT(*) as registros FROM Priority
UNION ALL
SELECT 'Status', COUNT(*) FROM Status
UNION ALL
SELECT 'Type', COUNT(*) FROM Type;
```

## Datos Iniciales

El script incluye datos iniciales para los catálogos:

- **Priority**: Crítica, Alta, Media, Baja
- **Status**: Nuevo, En Análisis, Aprobado, En Desarrollo, En Pruebas, Completado, Cancelado
- **Type**: User Story, Bug, Task, Epic, Feature
- **Complexity**: S, M, L, XL
- **Source**: Cliente, Legal, PO, Técnico, Negocio
- **EffortEstimateType**: Story Points, Hours, Days
- **RiskLevel**: Combinaciones de (Alto/Medio/Bajo) × (Técnico/Legal)
- **Metric**: Tiempo de Entrega, Satisfacción del Cliente, ROI, Reducción de Costos, Aumento de Ingresos

## Índices

El script crea índices automáticos en:
- Todas las claves foráneas
- Campos de búsqueda frecuente (fechas, estados, prioridades)
- Clave primaria compuesta de Backlog

## Notas de Desarrollo

- La extensión `uuid-ossp` debe estar habilitada para generar UUIDs automáticamente
- PostgreSQL 12+ recomendado para mejor soporte de UUIDs
- Los índices mejoran significativamente el rendimiento en consultas complejas

## Próximos Pasos

1. Crear usuarios y permisos específicos para la aplicación
2. Configurar backups automáticos
3. Considerar particionamiento para tablas grandes (Requirement, Backlog)
4. Implementar triggers para auditoría si es necesario
5. Crear vistas materializadas para reportes frecuentes

