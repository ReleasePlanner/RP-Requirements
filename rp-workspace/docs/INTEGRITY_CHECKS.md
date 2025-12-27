# 🔍 Integrity Checks & Coverage Verification

Este documento describe el sistema de verificación de integridad y cobertura del proyecto.

## 📋 Resumen

El sistema garantiza que **ninguna aplicación se despliegue sin cumplir con los estándares de calidad**:

- ✅ **100% de cobertura de código** (branches, functions, lines, statements)
- ✅ **Linting sin errores**
- ✅ **Type checking sin errores**
- ✅ **Builds exitosos**
- ✅ **Tests pasando**

## 🎯 Cobertura de Código

### Requisitos de Cobertura

El proyecto requiere **100% de cobertura** en todas las métricas:

| Métrica | Umbral | Descripción |
|---------|--------|-------------|
| **Lines** | 100% | Todas las líneas de código ejecutadas |
| **Branches** | 100% | Todas las ramas condicionales cubiertas |
| **Functions** | 100% | Todas las funciones tienen tests |
| **Statements** | 100% | Todas las sentencias ejecutadas |

### Configuración

La configuración está en `apps/api/jest.config.js`:

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

### Verificación Local

```bash
# Ejecutar tests con cobertura
cd apps/api
npm run test:cov

# Verificar que cumple el umbral
npm run test:cov:check
```

## 🔄 Workflows de Integridad

### 1. CI Workflow (`.github/workflows/ci.yml`)

Se ejecuta en cada push y pull request:

**Jobs:**
1. **lint-and-format**: Verifica código con ESLint
2. **test-api**: Ejecuta tests y verifica cobertura
3. **build-api**: Compila la API
4. **build-portal**: Compila el Portal
5. **integrity-check**: Verifica que todos los checks pasaron

**Verificaciones:**
- ✅ Linting (API y Portal)
- ✅ Tests con cobertura 100%
- ✅ Builds exitosos

### 2. Integrity Check Workflow (`.github/workflows/integrity-check.yml`)

Workflow dedicado para verificación completa:

**Verificaciones:**
- ✅ ESLint (API y Portal)
- ✅ Type checking (API y Portal)
- ✅ Tests con cobertura 100%
- ✅ Builds (API y Portal)
- ✅ Security audit (opcional)

**Uso:**
```bash
# Manual desde GitHub Actions
# O en PRs automáticamente
```

### 3. Pre-Deployment Checks

#### Development (`cd-dev.yml`)

Antes de desplegar a desarrollo:
1. ✅ Integrity verification job
2. ✅ Solo procede si todos los checks pasan

#### Production (`cd-production.yml`)

Antes de desplegar a producción:
1. ✅ Integrity verification job (más estricto)
2. ✅ Verificación adicional de seguridad
3. ✅ Solo procede si todos los checks pasan

## 🚫 Bloqueo de Deployment

El deployment **NO procederá** si:

1. **Cobertura < 100%** en cualquier métrica
2. **Linting falla** en API o Portal
3. **Type checking falla**
4. **Tests fallan**
5. **Builds fallan**

### Ejemplo de Bloqueo

```yaml
# En cd-production.yml
deploy-api-production:
  needs: [integrity-verification]  # ⚠️ Depende de integrity-verification
  # Si integrity-verification falla, este job NO se ejecuta
```

## 📊 Reportes de Cobertura

### En GitHub Actions

Los workflows generan reportes automáticos:

1. **Coverage Summary**: Métricas de cobertura
2. **Integrity Report**: Estado de todos los checks
3. **Step Summary**: Resumen visual en GitHub

### Visualización

```markdown
## 📊 Test Coverage Summary

| Metric | Coverage | Status |
|--------|----------|--------|
| Lines | 100% | ✅ |
| Branches | 100% | ✅ |
| Functions | 100% | ✅ |
| Statements | 100% | ✅ |
```

## 🔧 Configuración Avanzada

### Ajustar Umbral de Cobertura

Si necesitas cambiar el umbral (no recomendado):

1. Editar `apps/api/jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 90,  // Cambiar de 100 a 90
    functions: 90,
    lines: 90,
    statements: 90,
  },
}
```

2. Actualizar variable en workflows:
```yaml
env:
  COVERAGE_THRESHOLD: 90
```

### Excluir Archivos de Cobertura

En `jest.config.js`:

```javascript
collectCoverageFrom: [
  '**/*.(t|j)s',
  '!**/*.spec.ts',        // Excluir tests
  '!**/*.interface.ts',   // Excluir interfaces
  '!**/index.ts',         // Excluir index files
  '!**/*.module.ts',      // Excluir módulos
  '!**/main.ts',          // Excluir main
  '!**/*.dto.ts',         // Excluir DTOs
  '!**/*.entity.ts',      // Excluir entidades
],
```

## 🐛 Troubleshooting

### Coverage < 100%

**Problema**: Tests no cubren todo el código

**Solución**:
1. Ejecutar `npm run test:cov` localmente
2. Revisar reporte en `coverage/lcov-report/index.html`
3. Identificar líneas no cubiertas
4. Agregar tests para cubrirlas

### Integrity Check Falla

**Problema**: Un check falla y bloquea deployment

**Solución**:
1. Revisar logs del workflow
2. Identificar qué check falló
3. Corregir el problema
4. Hacer push nuevamente

### Build Falla en CI pero no Localmente

**Problema**: Diferencias entre entorno local y CI

**Solución**:
1. Verificar versiones de Node.js
2. Verificar dependencias (`npm ci` vs `npm install`)
3. Verificar variables de entorno
4. Revisar logs completos del workflow

## 📝 Mejores Prácticas

1. **Ejecutar checks localmente antes de push**
   ```bash
   npm run lint:api
   npm run test:cov:check
   npm run build:api
   ```

2. **Mantener cobertura al 100%**
   - Agregar tests para nuevo código
   - No excluir código sin justificación

3. **Revisar reportes de cobertura**
   - Identificar áreas sin cobertura
   - Priorizar tests para código crítico

4. **No deshabilitar checks**
   - Los checks existen por una razón
   - Si algo falla, corregirlo, no ignorarlo

## 🔗 Referencias

- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Testing Best Practices](docs/TESTING.md)

