# 📊 Sistema de Monitoreo

Sistema completo de monitoreo para la API y el Portal que incluye métricas, logs, errores y rendimiento.

## 🎯 Características

### API Monitoring

1. **Métricas de Requests**
   - Contador de requests totales
   - Tiempo de respuesta promedio
   - Distribución por código de estado HTTP
   - Métricas por endpoint
   - Detección de requests lentos (>1s)

2. **Métricas de Errores**
   - Contador de errores totales
   - Errores por tipo
   - Errores por endpoint
   - Historial de errores recientes
   - Stack traces de errores

3. **Métricas de Rendimiento**
   - Uso de CPU
   - Uso de memoria (RSS, Heap)
   - Uso de memoria promedio y máximo
   - Recopilación automática cada 30 segundos

4. **Health Checks Mejorados**
   - Health check detallado con métricas
   - Información del sistema
   - Estado de recursos

### Portal Dashboard

1. **Dashboard en Tiempo Real**
   - Auto-refresh cada 10 segundos
   - Selección de ventana de tiempo
   - Métricas visuales con gráficos

2. **Visualizaciones**
   - Cards de métricas principales
   - Gráficos de distribución de status codes
   - Tabla de endpoints más usados
   - Tabla de errores recientes
   - Métricas de rendimiento del sistema

## 📡 Endpoints de Monitoreo

### `/api/v1/monitoring/metrics`
Obtiene todas las métricas en un resumen.

**Query Parameters:**
- `window` (opcional): Ventana de tiempo en segundos (ej: 300 para 5 minutos)

**Response:**
```json
{
  "requests": {
    "total": 1234,
    "avgResponseTime": 45.2,
    "byStatusCode": { "200": 1200, "404": 20, "500": 14 },
    "byEndpoint": {
      "GET:/api/v1/requirements": {
        "count": 500,
        "avgResponseTime": 30.5,
        "errors": 2
      }
    }
  },
  "errors": {
    "total": 34,
    "byType": { "HttpException": 20, "TypeError": 14 },
    "recent": [...]
  },
  "performance": {
    "current": { "memoryUsage": 52428800, ... },
    "average": { "memoryUsage": 50000000, ... },
    "max": { "memoryUsage": 60000000, ... }
  },
  "uptime": 3600
}
```

### `/api/v1/monitoring/metrics/requests`
Métricas específicas de requests.

### `/api/v1/monitoring/metrics/errors`
Métricas específicas de errores.

### `/api/v1/monitoring/metrics/performance`
Métricas de rendimiento del sistema.

### `/api/v1/monitoring/health/detailed`
Health check detallado con todas las métricas.

### `/api/v1/monitoring/system`
Información de recursos del sistema.

## 🔧 Configuración

### Variables de Entorno

```bash
# Habilitar/deshabilitar monitoreo
ENABLE_MONITORING=true

# Retención de métricas en milisegundos (default: 1 hora)
METRICS_RETENTION_MS=3600000
```

### Límites de Almacenamiento

- **Request Metrics**: Últimas 1000 requests
- **Error Metrics**: Últimos 500 errores
- **Performance Metrics**: Últimas 100 muestras

## 📊 Dashboard del Portal

Accede al dashboard de monitoreo en:
```
/portal/monitoring
```

### Características del Dashboard

1. **Métricas Principales**
   - Total de requests
   - Tasa de errores
   - Tiempo de respuesta promedio
   - Uptime del sistema
   - Uso de memoria
   - Tasa de éxito

2. **Gráficos**
   - Distribución de códigos de estado HTTP
   - Top 10 endpoints más usados
   - Métricas de rendimiento

3. **Tablas**
   - Errores recientes con detalles
   - Tipos de errores más comunes

4. **Controles**
   - Selección de ventana de tiempo
   - Auto-refresh on/off
   - Refresh manual

## 🚀 Uso

### Ver Métricas desde la API

```bash
# Todas las métricas
curl http://localhost:3000/api/v1/monitoring/metrics

# Métricas de los últimos 5 minutos
curl http://localhost:3000/api/v1/monitoring/metrics?window=300

# Health check detallado
curl http://localhost:3000/api/v1/monitoring/health/detailed
```

### Acceder al Dashboard

1. Inicia sesión en el portal
2. Navega a "Monitoring" en el sidebar
3. Visualiza las métricas en tiempo real

## 🔍 Alertas Automáticas

El sistema detecta automáticamente:

1. **Requests Lentos**: > 1000ms
   - Se registran en los logs con nivel WARN

2. **Alta Tasa de Errores**: > 5%
   - Se muestra alerta en el dashboard

3. **Alto Uso de Memoria**: > 90%
   - Se muestra alerta en el dashboard

## 📈 Métricas Disponibles

### Request Metrics
- Total de requests
- Requests por endpoint
- Requests por método HTTP
- Requests por código de estado
- Tiempo de respuesta promedio
- Tiempo de respuesta por endpoint
- Requests lentos detectados

### Error Metrics
- Total de errores
- Errores por tipo
- Errores por endpoint
- Errores recientes con stack traces
- Tasa de error

### Performance Metrics
- Uso de CPU (user + system)
- Uso de memoria RSS
- Uso de heap
- Heap total
- Memoria externa
- Array buffers
- Promedios y máximos

### System Metrics
- Uptime del proceso
- PID del proceso
- Versión de Node.js
- Plataforma del sistema

## 🛠️ Integración con Otros Sistemas

### Prometheus (Futuro)

El sistema está preparado para integrarse con Prometheus:

```yaml
# Ejemplo de configuración futura
scrape_configs:
  - job_name: 'requirements-api'
    metrics_path: '/api/v1/monitoring/metrics'
    static_configs:
      - targets: ['localhost:3000']
```

### Grafana (Futuro)

Las métricas pueden visualizarse en Grafana usando el endpoint de métricas.

## 📝 Logs

El sistema de monitoreo también mejora el logging:

- Requests lentos se registran automáticamente
- Errores se registran con contexto completo
- Métricas de rendimiento se registran periódicamente

## 🔐 Seguridad

- Los endpoints de monitoreo son públicos por defecto (pueden protegerse con autenticación)
- Los datos sensibles se sanitizan automáticamente
- Los stack traces solo se muestran en desarrollo

## 🐛 Troubleshooting

### No se muestran métricas

1. Verificar que el módulo de monitoreo esté importado en `app.module.ts`
2. Verificar que el interceptor de métricas esté registrado
3. Verificar logs para errores

### Dashboard no carga

1. Verificar que la API esté corriendo
2. Verificar CORS configuration
3. Verificar que el endpoint `/api/v1/monitoring/metrics` responda

### Métricas no se actualizan

1. Verificar que el servicio de performance monitor esté corriendo
2. Verificar logs del servicio
3. Verificar que el cron job esté activo

## 📚 Referencias

- [NestJS Monitoring Best Practices](https://docs.nestjs.com/techniques/logger)
- [Performance Monitoring](https://nodejs.org/api/process.html#process_process_memoryusage)
- [Health Checks](https://docs.nestjs.com/recipes/terminus)

