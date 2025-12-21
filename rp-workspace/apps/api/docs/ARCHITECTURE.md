# Arquitectura de la API - Requirements Management

## 🏛️ Clean Architecture

La aplicación sigue los principios de Clean Architecture de Robert C. Martin, organizando el código en capas concéntricas:

```
┌─────────────────────────────────────┐
│      Presentation Layer             │  ← Controllers, DTOs, Guards
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases, Services, Interfaces
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Entities, Business Rules
├─────────────────────────────────────┤
│      Infrastructure Layer            │  ← Database, External Services
└─────────────────────────────────────┘
```

### Capas

#### 1. Domain Layer (`src/domain/`)
**Responsabilidad**: Contiene las reglas de negocio y entidades del dominio.

- **Entidades**: Representan los objetos del dominio (User, Requirement, Portfolio, etc.)
- **Interfaces de Repositorios**: Contratos que definen cómo acceder a los datos
- **Value Objects**: Objetos inmutables que representan conceptos del dominio

**Principio**: Esta capa NO depende de ninguna otra capa.

#### 2. Application Layer (`src/application/`)
**Responsabilidad**: Contiene la lógica de casos de uso y orquesta el flujo de la aplicación.

- **Services**: Implementan los casos de uso de la aplicación
- **DTOs**: Objetos de transferencia de datos para entrada/salida
- **Interfaces**: Contratos que la aplicación necesita (repositorios, servicios externos)

**Principio**: Depende solo del Domain Layer.

#### 3. Infrastructure Layer (`src/infrastructure/`)
**Responsabilidad**: Implementa los detalles técnicos y servicios externos.

- **Repositories**: Implementación concreta de los repositorios usando TypeORM
- **Database Config**: Configuración de conexión a base de datos
- **Auth Strategies**: Implementación de estrategias de autenticación
- **External Services**: Integraciones con servicios externos

**Principio**: Implementa las interfaces definidas en Application y Domain.

#### 4. Presentation Layer (`src/presentation/`)
**Responsabilidad**: Maneja la entrada y salida HTTP.

- **Controllers**: Endpoints REST, manejan requests/responses
- **Guards**: Protección de rutas, autenticación/autorización
- **Interceptors**: Transformación de datos, logging
- **Filters**: Manejo de excepciones

**Principio**: Depende de Application Layer.

## 🎯 Principios SOLID

### Single Responsibility Principle (SRP)
Cada clase tiene una única razón para cambiar:
- `AuthService`: Solo maneja autenticación
- `RequirementsService`: Solo maneja lógica de requisitos
- `UserRepository`: Solo maneja persistencia de usuarios

### Open/Closed Principle (OCP)
Abierto para extensión, cerrado para modificación:
- Interfaces de repositorios permiten diferentes implementaciones
- Guards pueden extenderse sin modificar código existente

### Liskov Substitution Principle (LSP)
Las implementaciones pueden sustituirse sin romper el código:
- `UserRepository` implementa `IUserRepository`
- Cualquier implementación de `IUserRepository` funciona igual

### Interface Segregation Principle (ISP)
Interfaces específicas y pequeñas:
- `IUserRepository`: Solo métodos relacionados con usuarios
- `IRequirementRepository`: Solo métodos relacionados con requisitos

### Dependency Inversion Principle (DIP)
Dependencias hacia abstracciones:
- Services dependen de interfaces (`IUserRepository`), no de implementaciones
- Inyección de dependencias mediante NestJS

## 🎨 Patrones de Diseño

### Repository Pattern
Abstrae el acceso a datos:
```typescript
// Interface (Domain/Application)
interface IUserRepository {
  findById(id: string): Promise<User>;
}

// Implementation (Infrastructure)
class UserRepository implements IUserRepository {
  // TypeORM implementation
}
```

### Strategy Pattern
Para autenticación:
```typescript
// JWT Strategy
class JwtStrategy extends PassportStrategy(Strategy) {
  // JWT validation logic
}
```

### Dependency Injection
NestJS maneja la inyección automáticamente:
```typescript
@Injectable()
class AuthService {
  constructor(
    private readonly userRepository: IUserRepository, // Injected
  ) {}
}
```

### Factory Pattern
Para creación de entidades:
```typescript
const user = this.repository.create(userData);
```

### Guard Pattern
Para protección de rutas:
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
protectedRoute() {}
```

## 🔒 Seguridad OWASP Top 10

### A01:2021 – Broken Access Control
- ✅ Guards para proteger rutas
- ✅ Validación de permisos basada en roles
- ✅ JWT tokens con expiración

### A02:2021 – Cryptographic Failures
- ✅ Passwords hasheados con bcrypt (salt rounds: 10)
- ✅ JWT secrets seguros (mínimo 32 caracteres)
- ✅ HTTPS en producción (configurable)

### A03:2021 – Injection
- ✅ TypeORM con parámetros preparados (previene SQL injection)
- ✅ Validación de entrada con class-validator
- ✅ Sanitización automática

### A04:2021 – Insecure Design
- ✅ Clean Architecture para separación de responsabilidades
- ✅ Validación en múltiples capas
- ✅ Manejo seguro de errores

### A05:2021 – Security Misconfiguration
- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado correctamente
- ✅ Variables de entorno para configuración sensible

### A06:2021 – Vulnerable Components
- ✅ Dependencias actualizadas regularmente
- ✅ package-lock.json para versiones fijas

### A07:2021 – Authentication Failures
- ✅ JWT con expiración
- ✅ Password hashing robusto
- ✅ Rate limiting para prevenir fuerza bruta

### A08:2021 – Software and Data Integrity Failures
- ✅ Validación de entrada estricta
- ✅ Logging de operaciones críticas

### A09:2021 – Logging and Monitoring Failures
- ✅ Winston para logging estructurado
- ✅ Logs de errores y operaciones
- ✅ Health checks para monitoreo

### A10:2021 – Server-Side Request Forgery (SSRF)
- ✅ Validación de URLs y endpoints externos
- ✅ Whitelist de dominios permitidos

## 🔄 Resiliencia

### Health Checks
- **Liveness**: Verifica que la aplicación esté corriendo
- **Readiness**: Verifica que la aplicación esté lista para recibir tráfico
- **Health**: Verifica estado completo (DB, memoria, disco)

### Timeouts
- Timeout interceptor configurable
- Connection pool con timeouts para base de datos

### Error Handling
- Exception filters globales
- Respuestas de error consistentes
- No exposición de información sensible en producción

### Logging
- Logging estructurado con Winston
- Niveles configurables (error, warn, info, debug)
- Logs en archivo y consola

## 📊 Métricas y Monitoreo

### Health Endpoints
- `GET /api/v1/health` - Health check completo
- `GET /api/v1/health/liveness` - Liveness probe
- `GET /api/v1/health/readiness` - Readiness probe

### Logging
- Request/Response logging
- Error logging con stack traces
- Performance logging (tiempo de respuesta)

## 🚀 Escalabilidad

### Connection Pooling
- Pool de conexiones configurado en TypeORM
- Máximo de conexiones: 20
- Timeouts configurables

### Rate Limiting
- Throttling global configurable
- Protección contra abuso de API

### Caching (Futuro)
- Preparado para implementar cache con Redis
- Cache-manager ya incluido

## 📝 Clean Code Principles

1. **Nombres Descriptivos**: Variables y funciones con nombres claros
2. **Funciones Pequeñas**: Cada función hace una cosa
3. **Comentarios Útiles**: Solo cuando el código no es auto-explicativo
4. **Formato Consistente**: Prettier y ESLint configurados
5. **Manejo de Errores**: Consistente y claro
6. **DRY**: No repetir código, usar abstracciones

## 🔧 Configuración

### Variables de Entorno
Todas las configuraciones sensibles están en variables de entorno:
- Base de datos
- JWT secrets
- CORS origins
- Rate limiting
- Timeouts

### Validación de Configuración
Joi valida todas las variables de entorno al iniciar la aplicación.

## 📚 Documentación

### OpenAPI/Swagger
- Documentación automática de endpoints
- Ejemplos de requests/responses
- Autenticación integrada en Swagger UI

### Código Auto-documentado
- TypeScript con tipos explícitos
- Decoradores de Swagger en DTOs
- Comentarios JSDoc donde es necesario

