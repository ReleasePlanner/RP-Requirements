# 🧪 Ejecutar Test SSH Connection

Guía paso a paso para ejecutar el workflow de prueba de conexión SSH.

## 🎯 Objetivo

Este workflow prueba **solo la conexión SSH** sin ejecutar el deployment completo. Es útil para diagnosticar problemas antes de intentar el deployment.

## 📋 Pasos para Ejecutar

### Paso 1: Ir a GitHub Actions

1. Abre tu navegador y ve a:
   ```
   https://github.com/ReleasePlanner/RP-Requirements
   ```

2. Click en la pestaña **"Actions"** (arriba del repositorio)

### Paso 2: Seleccionar el Workflow

1. En el menú lateral izquierdo, busca **"Test SSH Connection"**
2. Click en **"Test SSH Connection"**

### Paso 3: Ejecutar el Workflow

1. Click en el botón azul **"Run workflow"** (arriba a la derecha)
2. Selecciona:
   - **Use workflow from**: `main` (o la rama donde está el workflow)
   - No hay inputs adicionales necesarios
3. Click en **"Run workflow"** (botón verde)

### Paso 4: Monitorear la Ejecución

El workflow ejecutará estos pasos:

1. **Install SSH tools** ✅
   - Instala `openssh-client` y `sshpass`

2. **Debug Secrets** ✅
   - Verifica que los secrets estén configurados
   - Muestra qué secrets están disponibles (sin mostrar valores)

3. **Test SSH with Key** (si aplica) ✅
   - Configura la clave SSH si está disponible

4. **Test SSH Connection** ✅
   - Intenta conectarse al VPS
   - Muestra información del sistema (`uname -a`)
   - Verifica si Docker está instalado

5. **Test Docker Installation** ✅
   - Verifica versión de Docker
   - Verifica versión de Docker Compose

6. **Test Directory Permissions** ✅
   - Verifica que `/opt/modules` existe
   - Verifica permisos de escritura

## ✅ Resultados Esperados

### Si Todo Está Correcto

Verás mensajes como:
```
✅ SSH connection successful!
Linux ... (información del sistema)
Docker version ...
docker-compose version ...
✅ Directory accessible
```

### Si Hay Problemas

#### Error: "VPS_HOST secret is not configured"
- **Solución**: Configura el secret `VPS_HOST` en GitHub Settings > Secrets

#### Error: "No SSH credentials provided"
- **Solución**: Configura `VPS_SSH_PASSWORD` o `VPS_SSH_KEY` en GitHub Secrets

#### Error: "ssh: connect to host ... port 22: Connection refused"
- **Solución**: 
  - Verifica que la IP del VPS sea correcta
  - Verifica que el VPS esté encendido
  - Verifica que el puerto SSH sea 22 (o configúralo)

#### Error: "Permission denied"
- **Solución**: 
  - Verifica que la contraseña SSH sea correcta
  - Verifica que el usuario SSH sea correcto (`root` o el que uses)

#### Error: "Docker not installed"
- **Solución**: Instala Docker en el VPS:
  ```bash
  ssh root@72.60.63.240
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  ```

## 🔍 Interpretar los Resultados

### ✅ Todo Verde
- **Significado**: La conexión SSH funciona correctamente
- **Próximo paso**: Puedes ejecutar el deployment completo

### ⚠️ Algunos Warnings
- **Significado**: Algo no está configurado pero no es crítico
- **Próximo paso**: Revisa los warnings y corrige si es necesario

### ❌ Errores Rojos
- **Significado**: Hay un problema que debe resolverse
- **Próximo paso**: Revisa la sección de troubleshooting arriba

## 📊 Checklist de Verificación

Antes de ejecutar, verifica:

- [ ] Secrets configurados en GitHub:
  - [ ] `VPS_HOST`
  - [ ] `VPS_USER` (o se usará 'root' por defecto)
  - [ ] `VPS_SSH_PASSWORD` o `VPS_SSH_KEY`
- [ ] Puedes conectarte manualmente: `ssh root@72.60.63.240`
- [ ] El workflow está en la rama correcta

## 🚀 Después del Test Exitoso

Si el test SSH es exitoso:

1. ✅ La conexión SSH funciona
2. ✅ Docker está instalado (o sabes que necesitas instalarlo)
3. ✅ Los permisos son correctos

**Próximo paso**: Ejecuta el deployment completo con "Deploy to Hostinger VPS"

## 🔗 Enlaces Útiles

- [Troubleshooting SSH](TROUBLESHOOTING_SSH.md)
- [Troubleshooting GitHub Actions](TROUBLESHOOTING_GITHUB_ACTIONS.md)
- [Checklist de Verificación](CHECKLIST_VERIFICACION.md)

---

**¡Ejecuta el test y comparte los resultados si hay algún problema!** 🚀

