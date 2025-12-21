# Requirements Management API - NestJS

API REST para gestión de requisitos construida con NestJS siguiendo Clean Architecture, principios SOLID, patrones de diseño, Clean Code y seguridad OWASP.

## 🏗️ Arquitectura

Esta API sigue los principios de **Clean Architecture** con las siguientes capas:

- **Domain**: Entidades del dominio, interfaces de repositorios, value objects
- **Application**: Casos de uso, DTOs, servicios de aplicación, interfaces
- **Infrastructure**: Implementación de repositorios, servicios externos, configuración de base de datos
- **Presentation**: Controllers, middleware, interceptors, guards

## 🛡️ Seguridad OWASP

### Implementado:

1. **Autenticación y Autorización**
   - JWT tokens con expiración
   - Password hashing con bcrypt (salt rounds: 10)
   - Guards para proteger rutas

2. **Validación de Entrada**
   - Validación con `class-validator`
   - Sanitización automática de datos
   - Whitelist de propiedades permitidas

3. **Rate Limiting**
   - Throttling global configurable
   - Protección contra ataques de fuerza bruta

4. **Headers de Seguridad**
   - Helmet para headers HTTP seguros
   - CORS configurado

5. **Manejo de Errores**
   - No exposición de información sensible en producción
   - Logging estructurado

## 🔄 Resiliencia y Alta Disponibilidad

1. **Health Checks**
   - Liveness probe
   - Readiness probe
   - Health checks de base de datos, memoria y disco

2. **Timeouts**
   - Timeout interceptor configurable
   - Connection pool para base de datos

3. **Logging**
   - Winston para logging estructurado
   - Logs en archivo y consola
   - Niveles de log configurables

## 📚 Documentación OpenAPI

La documentación Swagger está disponible en `/api/docs` cuando `NODE_ENV !== 'production'`.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones (si es necesario)
npm run migration:run

# Iniciar en desarrollo
npm run start:dev

# Iniciar en producción
npm run build
npm run start:prod
```

## 📋 Variables de Entorno

Ver `.env.example` para todas las variables de entorno requeridas.

### Requeridas:
- `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET` (mínimo 32 caracteres)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Estructura del Proyecto

```
src/
├── domain/              # Capa de dominio
│   └── entities/        # Entidades TypeORM
├── application/         # Capa de aplicación
│   ├── auth/           # Módulo de autenticación
│   ├── requirements/   # Módulo de requisitos
│   ├── users/          # Módulo de usuarios
│   └── interfaces/     # Interfaces de repositorios
├── infrastructure/     # Capa de infraestructura
│   ├── database/       # Configuración de BD
│   ├── repositories/   # Implementación de repositorios
│   └── auth/           # Estrategias de autenticación
├── presentation/        # Capa de presentación
│   ├── auth/           # Controllers de autenticación
│   ├── requirements/   # Controllers de requisitos
│   └── health/         # Health checks
└── shared/             # Utilidades compartidas
    ├── config/         # Configuración
    ├── decorators/     # Decoradores personalizados
    ├── filters/        # Exception filters
    └── interceptors/   # Interceptors
```

## 🔑 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrar usuario

### Requisitos
- `GET /api/v1/requirements` - Listar requisitos
- `GET /api/v1/requirements/:id` - Obtener requisito
- `POST /api/v1/requirements` - Crear requisito
- `PATCH /api/v1/requirements/:id` - Actualizar requisito
- `DELETE /api/v1/requirements/:id` - Eliminar requisito

### Health
- `GET /api/v1/health` - Health check completo
- `GET /api/v1/health/liveness` - Liveness probe
- `GET /api/v1/health/readiness` - Readiness probe

## 🎯 Principios SOLID Aplicados

- **S**ingle Responsibility: Cada clase tiene una responsabilidad única
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Interfaces bien definidas
- **I**nterface Segregation: Interfaces específicas por dominio
- **D**ependency Inversion: Dependencias hacia abstracciones

## 🎨 Patrones de Diseño

- **Repository Pattern**: Abstracción de acceso a datos
- **Strategy Pattern**: Estrategias de autenticación (JWT)
- **Dependency Injection**: Inyección de dependencias de NestJS
- **Factory Pattern**: Creación de entidades
- **Guard Pattern**: Protección de rutas

## 📝 Clean Code

- Nombres descriptivos y significativos
- Funciones pequeñas y con un solo propósito
- Comentarios solo cuando es necesario
- Código auto-documentado
- Manejo de errores consistente

## 🔒 Mejores Prácticas de Seguridad

1. **Nunca** exponer información sensible en logs
2. **Siempre** validar y sanitizar entrada de usuario
3. **Usar** HTTPS en producción
4. **Rotar** secretos regularmente
5. **Implementar** rate limiting
6. **Mantener** dependencias actualizadas

## 📖 Licencia

MIT

