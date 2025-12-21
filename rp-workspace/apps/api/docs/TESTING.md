# Guía de Testing - 100% Coverage

## 📊 Cobertura de Tests

Este proyecto tiene como objetivo mantener **100% de cobertura** en todos los componentes.

## 🧪 Estructura de Tests

Los tests están organizados siguiendo la misma estructura del código fuente:

```
src/
├── application/
│   └── auth/
│       └── services/
│           ├── auth.service.ts
│           └── auth.service.spec.ts  ← Test unitario
├── presentation/
│   └── auth/
│       ├── auth.controller.ts
│       └── auth.controller.spec.ts  ← Test unitario
└── infrastructure/
    └── repositories/
        ├── user.repository.ts
        └── user.repository.spec.ts  ← Test unitario
```

## 🎯 Componentes con Tests

### ✅ Services (Application Layer)
- `AuthService` - Autenticación y registro
- `RequirementsService` - CRUD de requisitos
- `UsersService` - Gestión de usuarios
- `PortfoliosService` - Gestión de portafolios
- `ProductsService` - Gestión de productos

### ✅ Controllers (Presentation Layer)
- `AuthController` - Endpoints de autenticación
- `RequirementsController` - Endpoints de requisitos
- `UsersController` - Endpoints de usuarios
- `PortfoliosController` - Endpoints de portafolios
- `ProductsController` - Endpoints de productos
- `HealthController` - Health checks

### ✅ Repositories (Infrastructure Layer)
- `UserRepository` - Acceso a datos de usuarios
- `RequirementRepository` - Acceso a datos de requisitos
- `PortfolioRepository` - Acceso a datos de portafolios
- `ProductRepository` - Acceso a datos de productos

### ✅ Guards & Strategies
- `JwtAuthGuard` - Protección de rutas
- `JwtStrategy` - Validación de tokens JWT

### ✅ Pipes
- `UUIDValidationPipe` - Validación de UUIDs

### ✅ Filters
- `HttpExceptionFilter` - Manejo de excepciones

### ✅ Interceptors
- `LoggingInterceptor` - Logging de requests
- `TransformInterceptor` - Transformación de respuestas
- `TimeoutInterceptor` - Timeout de requests

### ✅ Exceptions
- `EntityNotFoundException` - Excepciones personalizadas

### ✅ DTOs
- `PaginationDto` - Validación de paginación

### ✅ Decorators
- `Public` - Decorador para rutas públicas

## 🚀 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch

# Ejecutar con cobertura
npm run test:cov

# Verificar cobertura del 100%
npm run test:cov:check
```

## 📋 Criterios de Cobertura

El proyecto requiere **100% de cobertura** en:
- ✅ Branches (ramas condicionales)
- ✅ Functions (todas las funciones)
- ✅ Lines (todas las líneas)
- ✅ Statements (todas las sentencias)

## 🎨 Patrones de Testing

### Mocking
- Repositorios: Mockeados con `jest.Mocked`
- Servicios externos: Mockeados (JWT, ConfigService)
- TypeORM: Mockeado con `getRepositoryToken`

### Test Structure
```typescript
describe('ComponentName', () => {
  let component: Component;
  let dependency: jest.Mocked<Dependency>;

  beforeEach(async () => {
    // Setup
  });

  describe('methodName', () => {
    it('should do something', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Best Practices
1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive Names**: Tests describen comportamiento
3. **Isolation**: Cada test es independiente
4. **Mocking**: Dependencias externas mockeadas
5. **Edge Cases**: Tests para casos límite
6. **Error Cases**: Tests para manejo de errores

## 📝 Ejemplo de Test Completo

```typescript
describe('RequirementsService', () => {
  let service: RequirementsService;
  let repository: jest.Mocked<IRequirementRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequirementsService,
        {
          provide: IRequirementRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(RequirementsService);
    repository = module.get(IRequirementRepository);
  });

  describe('findOne', () => {
    it('should return requirement when found', async () => {
      repository.findById.mockResolvedValue(mockRequirement);
      const result = await service.findOne('req-123');
      expect(result).toEqual(mockRequirement);
    });

    it('should throw exception when not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne('req-123'))
        .rejects.toThrow(RequirementNotFoundException);
    });
  });
});
```

## ✅ Checklist de Cobertura

- [x] Todos los servicios tienen tests
- [x] Todos los controllers tienen tests
- [x] Todos los repositorios tienen tests
- [x] Todos los guards tienen tests
- [x] Todos los pipes tienen tests
- [x] Todos los filters tienen tests
- [x] Todos los interceptors tienen tests
- [x] Todas las excepciones tienen tests
- [x] Todos los DTOs tienen tests de validación
- [x] Todos los decorators tienen tests

## 🔍 Verificación de Cobertura

El archivo `jest.config.js` está configurado para requerir 100% de cobertura:

```javascript
coverageThreshold: {
  global: {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
}
```

Si algún test falla o la cobertura es menor al 100%, el build fallará.

## 📚 Recursos

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

