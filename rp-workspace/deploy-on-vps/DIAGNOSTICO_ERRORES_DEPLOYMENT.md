# 🔍 Diagnóstico de Errores en Deployment

## 📊 Cómo Interpretar los Resultados del Workflow

### ✅ Deployment Exitoso

Si ves esto en los logs:
```
✅ Deployment to Hostinger VPS successful!
```

Significa que:
- ✅ Todos los tests pasaron
- ✅ La conexión SSH funcionó
- ✅ El script se copió al servidor
- ✅ El deployment se ejecutó correctamente
- ✅ Los servicios están funcionando

### ❌ Deployment Fallido

Si ves esto:
```
❌ Deployment to Hostinger VPS failed!
```

Significa que algún paso del workflow falló. Revisa los logs del job **"Deploy to Hostinger VPS"** para identificar qué falló.

## 🔍 Pasos del Workflow y Posibles Errores

### 1. Integrity Check (Pre-Deployment)

**Qué hace:** Ejecuta tests, linting y verifica builds

**Errores comunes:**
- ❌ Tests fallan → Revisa los tests que fallaron
- ❌ Linting falla → Corrige los errores de linting
- ❌ Build falla → Revisa errores de compilación

**Solución:** Corrige los errores antes de hacer deployment

### 2. Check SSH credentials

**Qué hace:** Verifica qué método de autenticación usar

**Errores comunes:**
- ❌ No detecta contraseña → Verifica `VPS_SSH_PASSWORD` en Secrets

**Solución:** Asegúrate de que `VPS_SSH_PASSWORD` esté configurado

### 3. Test SSH connection

**Qué hace:** Prueba la conexión SSH al servidor

**Errores comunes:**
- ❌ `Permission denied` → Contraseña incorrecta o usuario incorrecto
- ❌ `Connection refused` → Servidor no accesible o puerto incorrecto
- ❌ `Host key verification failed` → Problema con known_hosts

**Solución:**
- Verifica `VPS_SSH_PASSWORD` en GitHub Secrets
- Verifica `VPS_USER` (debe ser `root`)
- Verifica `VPS_HOST` (debe ser `72.60.63.240`)

### 4. Copy deployment script to VPS

**Qué hace:** Copia el script de deployment al servidor

**Errores comunes:**
- ❌ `Permission denied` → Contraseña incorrecta
- ❌ `scp: Connection closed` → Problema de autenticación
- ❌ `No route to host` → Servidor no accesible

**Solución:**
- Verifica la contraseña SSH manualmente: `ssh root@72.60.63.240`
- Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets si es incorrecta

### 5. Execute deployment on VPS

**Qué hace:** Ejecuta el script de deployment en el servidor

**Errores comunes:**
- ❌ `Permission denied` → Contraseña incorrecta
- ❌ `Docker is not installed` → Docker no está instalado en el VPS
- ❌ `docker-compose: command not found` → Docker Compose no está instalado
- ❌ `Port already in use` → Los puertos están ocupados
- ❌ `Database connection failed` → Credenciales de BD incorrectas

**Solución:**
- Instala Docker y Docker Compose en el VPS si falta
- Verifica que los puertos estén libres
- Verifica los secrets de base de datos en GitHub

### 6. Verify deployment

**Qué hace:** Verifica que los servicios estén funcionando

**Errores comunes:**
- ❌ `API health check failed` → API no está respondiendo
- ❌ `Portal health check failed` → Portal no está respondiendo

**Solución:**
- Revisa los logs de Docker: `docker-compose logs`
- Verifica que los servicios estén corriendo: `docker-compose ps`

## 🧪 Pasos de Diagnóstico

### Paso 1: Revisar los Logs del Job Fallido

1. Ve a **Actions** en GitHub
2. Click en el workflow que falló
3. Click en el job **"Deploy to Hostinger VPS"**
4. Revisa cada step para encontrar el error

### Paso 2: Identificar el Step que Falló

Busca el último step que muestra ✅ antes del que falla. Ese es el punto donde empezó el problema.

### Paso 3: Revisar el Error Específico

Cada error tiene un mensaje específico. Busca:
- `Permission denied` → Problema de autenticación SSH
- `Connection refused` → Problema de conectividad
- `command not found` → Falta una herramienta en el servidor
- `Port already in use` → Puerto ocupado
- `Database connection failed` → Problema con BD

### Paso 4: Aplicar la Solución

Sigue las instrucciones específicas para cada tipo de error.

## 📋 Checklist de Verificación

Antes de ejecutar el workflow, verifica:

### Secrets en GitHub:
- [ ] `VPS_HOST` = `72.60.63.240`
- [ ] `VPS_USER` = `root`
- [ ] `VPS_SSH_PASSWORD` = Tu contraseña SSH (correcta, sin espacios)
- [ ] `DB_USERNAME` = Usuario de PostgreSQL
- [ ] `DB_PASSWORD` = Contraseña de PostgreSQL
- [ ] `DB_DATABASE` = `requirements_db`
- [ ] `JWT_SECRET` = Secret JWT (mínimo 32 caracteres)

### Servidor VPS:
- [ ] Puedes conectarte manualmente: `ssh root@72.60.63.240`
- [ ] Docker está instalado: `docker --version`
- [ ] Docker Compose está instalado: `docker-compose --version`
- [ ] Los puertos 3000 y 4200 están libres
- [ ] PostgreSQL está accesible desde el contenedor

## 🔗 Referencias

- [Diagnóstico Final SSH](DIAGNOSTICO_FINAL_SSH.md)
- [Verificar Contraseña SSH](VERIFICAR_CONTRASENA_SSH.md)
- [Solución Inmediata Error SSH](SOLUCION_INMEDIATA_ERROR_SSH.md)

