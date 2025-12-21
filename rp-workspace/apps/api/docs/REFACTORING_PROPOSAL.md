# Propuesta de Refactorización y Mejoras - NestJS Best Practices

## 📋 Análisis Actual

### ✅ Aspectos Positivos
- Clean Architecture bien implementada
- Separación de responsabilidades clara
- Uso correcto de Dependency Injection
- Validación con class-validator
- Documentación Swagger
- Seguridad OWASP implementada

### ⚠️ Áreas de Mejora Identificadas

## 🔧 Propuestas de Refactorización

### 1. **Configuración Centralizada**

**Problema**: La configuración de Winston está mezclada en `app.module.ts`

**Solución**: Crear módulos de configuración dedicados

```typescript
// src/shared/config/config.module.ts
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({...}),
    WinstonModule.forRootAsync({...}),
  ],
  exports: [ConfigModule, WinstonModule],
})
export class CoreConfigModule {}
```

### 2. **Repositorios Base (DRY)**

**Problema**: Repetición de relaciones en múltiples métodos del repositorio

**Solución**: Crear repositorio base con relaciones comunes

```typescript
// src/infrastructure/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  protected abstract readonly relations: string[];
  
  protected applyRelations(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    return this.relations.reduce((qb, relation) => 
      qb.leftJoinAndSelect(`${qb.alias}.${relation}`, relation), query
    );
  }
}
```

### 3. **Paginación y Filtrado**

**Problema**: Los endpoints `findAll` no tienen paginación ni filtrado avanzado

**Solución**: Implementar DTOs de paginación y query

```typescript
// src/shared/dto/pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
```

### 4. **DTOs de Respuesta**

**Problema**: Se devuelven entidades directamente, exponiendo estructura interna

**Solución**: Crear DTOs de respuesta

```typescript
// src/application/requirements/dto/requirement-response.dto.ts
export class RequirementResponseDto {
  @ApiProperty()
  requirementId: string;

  @ApiProperty()
  title: string;

  // Solo campos necesarios para el cliente
}
```

### 5. **Validación de UUIDs**

**Problema**: No hay validación de formato UUID en parámetros de ruta

**Solución**: Crear pipe personalizado

```typescript
// src/shared/pipes/uuid-validation.pipe.ts
@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return value;
  }
}
```

### 6. **Excepciones Personalizadas**

**Problema**: Mensajes de error genéricos

**Solución**: Crear excepciones de dominio

```typescript
// src/shared/exceptions/requirement-not-found.exception.ts
export class RequirementNotFoundException extends NotFoundException {
  constructor(requirementId: string) {
    super(`Requirement with ID ${requirementId} not found`);
  }
}
```

### 7. **Módulo de Base de Datos**

**Problema**: Configuración de TypeORM mezclada

**Solución**: Crear módulo dedicado

```typescript
// src/infrastructure/database/database.module.ts
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
```

### 8. **Decoradores Personalizados**

**Problema**: Código repetitivo en controllers

**Solución**: Crear decoradores reutilizables

```typescript
// src/shared/decorators/api-paginated-response.decorator.ts
export const ApiPaginatedResponse = <T>(model: Type<T>) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
```

### 9. **Transformación de Respuestas**

**Problema**: El TransformInterceptor envuelve todas las respuestas

**Solución**: Usar decorador para controlar transformación

```typescript
// src/shared/decorators/api-response.decorator.ts
export const ApiResponse = (options?: { transform?: boolean }) => {
  return SetMetadata('transform', options?.transform ?? true);
};
```

### 10. **Query Builder Pattern**

**Problema**: Consultas complejas mezcladas en repositorios

**Solución**: Usar Query Builders especializados

```typescript
// src/infrastructure/repositories/requirement.query-builder.ts
export class RequirementQueryBuilder {
  constructor(private qb: SelectQueryBuilder<Requirement>) {}

  withEpic(epicId: string): this {
    this.qb.andWhere('requirement.epicId = :epicId', { epicId });
    return this;
  }

  withStatus(statusId: number): this {
    this.qb.andWhere('requirement.statusId = :statusId', { statusId });
    return this;
  }
}
```

### 11. **Configuración de Swagger Mejorada**

**Problema**: Configuración básica de Swagger

**Solución**: Mejorar con configuraciones avanzadas

```typescript
// src/shared/config/swagger.config.ts
export const swaggerConfig = (): Omit<DocumentBuilder, 'build'> => {
  return new DocumentBuilder()
    .setTitle('RP Requirements API')
    .setDescription('...')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://api.example.com', 'Production')
    .addBearerAuth({...}, 'JWT-auth')
    .addApiKey({...}, 'ApiKey')
    .addTag('requirements', '...')
    .addTag('portfolios', '...');
};
```

### 12. **Módulo de Utilidades Compartidas**

**Problema**: Funciones comunes dispersas

**Solución**: Crear módulo de utilidades

```typescript
// src/shared/utils/utils.module.ts
@Global()
@Module({
  providers: [DateUtils, StringUtils, ValidationUtils],
  exports: [DateUtils, StringUtils, ValidationUtils],
})
export class UtilsModule {}
```

### 13. **Cache Strategy**

**Problema**: No hay caché implementado

**Solución**: Implementar caché con CacheManager

```typescript
// src/infrastructure/cache/cache.module.ts
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL', 300),
        max: configService.get('CACHE_MAX', 100),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheConfigModule {}
```

### 14. **Eventos de Dominio**

**Problema**: No hay eventos para acciones importantes

**Solución**: Implementar EventEmitter

```typescript
// src/application/requirements/events/requirement-created.event.ts
export class RequirementCreatedEvent {
  constructor(public readonly requirement: Requirement) {}
}

// En el servicio
this.eventEmitter.emit('requirement.created', new RequirementCreatedEvent(requirement));
```

### 15. **Tests Structure**

**Problema**: No hay estructura de tests

**Solución**: Crear estructura de tests

```
src/
  ├── application/
  │   └── requirements/
  │       └── services/
  │           ├── requirements.service.ts
  │           └── requirements.service.spec.ts
  └── presentation/
      └── requirements/
          └── requirements.controller.spec.ts
```

## 📊 Priorización de Mejoras

### 🔴 Alta Prioridad (Implementar primero)
1. Validación de UUIDs (Pipe personalizado)
2. DTOs de respuesta
3. Paginación y filtrado
4. Excepciones personalizadas
5. Módulo de base de datos

### 🟡 Media Prioridad
6. Repositorios base (DRY)
7. Configuración centralizada
8. Decoradores personalizados
9. Query Builder Pattern
10. Cache Strategy

### 🟢 Baja Prioridad (Mejoras futuras)
11. Eventos de dominio
12. Tests structure
13. Módulo de utilidades
14. Swagger mejorado

## 🎯 Beneficios Esperados

- **Mantenibilidad**: Código más limpio y organizado
- **Escalabilidad**: Estructura preparada para crecimiento
- **Performance**: Paginación y caché mejoran rendimiento
- **Seguridad**: Validaciones más robustas
- **Developer Experience**: APIs más claras y documentadas
- **Testabilidad**: Estructura preparada para testing

## 📝 Próximos Pasos

1. Crear estructura de módulos compartidos
2. Implementar pipes y decoradores personalizados
3. Refactorizar repositorios con base class
4. Agregar paginación a endpoints
5. Crear DTOs de respuesta
6. Implementar caché para catálogos
7. Agregar tests unitarios y e2e

