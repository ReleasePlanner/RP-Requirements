# 🧪 Tests y Scripts de Verificación

Esta carpeta contiene scripts de testing, verificación y debugging para el proyecto.

## 📋 Archivos

### Tests de API
- **`test-api.js`** - Tests básicos de la API (login, autenticación)
- **`test-requirements.js`** - Tests específicos de requisitos

### Verificaciones
- **`verify-full-flow.js`** - Verificación del flujo completo de la aplicación
- **`verify-rules.js`** - Verificación de reglas y validaciones
- **`verify-update.js`** - Verificación de operaciones de actualización

### Debugging
- **`api-debug.js`** - Scripts de debugging para la API
- **`debug-epics.js`** - Debugging específico de epics
- **`portal-debug-api.js`** - Debugging del portal con la API
- **`check-rgl.js`** - Verificación de react-grid-layout

## 🚀 Uso

### Ejecutar Tests

```bash
# Test de API
node tests/test-api.js

# Test de Requirements
node tests/test-requirements.js

# Verificación completa
node tests/verify-full-flow.js
```

### Debugging

```bash
# Debug API
node tests/api-debug.js

# Debug Epics
node tests/debug-epics.js

# Debug Portal
node tests/portal-debug-api.js
```

## 📝 Notas

- Estos scripts requieren que la API esté ejecutándose en `http://localhost:3000`
- Algunos scripts requieren datos de prueba en la base de datos
- Verifica las variables de entorno antes de ejecutar los tests

