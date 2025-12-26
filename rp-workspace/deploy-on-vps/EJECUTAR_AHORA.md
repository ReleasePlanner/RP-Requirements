# 🚀 Ejecutar Test SSH Interactivo - Instrucciones

## ⚠️ Importante

Este script requiere **entrada interactiva** (tu contraseña SSH), por lo que **debe ejecutarse manualmente** en tu terminal.

## 📋 Pasos para Ejecutar

### 1. Abre tu Terminal

**En Windows:**

- Abre **Git Bash** (recomendado)
- O usa **PowerShell** o **CMD**

**En Linux/Mac:**

- Abre tu terminal preferida

### 2. Navega al Directorio del Proyecto

```bash
cd C:\MySources\RP-Requirements-Web
```

O si estás en Linux/Mac:

```bash
cd /ruta/a/RP-Requirements-Web
```

### 3. Ejecuta el Script

```bash
bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh
```

### 4. Ingresa tu Contraseña SSH

Cuando el script te pida:

```
🔐 Ingresa la contraseña SSH (no se mostrará):
```

- **Escribe tu contraseña** (no se mostrará en pantalla por seguridad)
- **Presiona Enter** después de escribirla

## ✅ Qué Esperar

### Si la Contraseña es Correcta:

```
✅ CONEXIÓN SSH EXITOSA
✅ SSH connection successful!
Hostname: ...
Uptime: ...
✅ Docker instalado: ...
✅ Docker Compose instalado: ...
✅ Directorio accesible: ...
✅ TODAS LAS PRUEBAS PASARON
```

### Si la Contraseña es Incorrecta:

```
❌ CONEXIÓN SSH FALLIDA
Permission denied (publickey,password)
```

## 🔍 Troubleshooting

### Error: "sshpass: command not found"

**En Git Bash (Windows):**

- Git Bash debería incluir sshpass
- Si no está, instala WSL y ejecuta desde allí

**En Linux:**

```bash
sudo apt-get update && sudo apt-get install -y sshpass
```

**En Mac:**

```bash
brew install sshpass
```

### Error: "Permission denied"

1. Verifica que la contraseña sea correcta
2. Prueba manualmente: `ssh root@72.60.63.240`
3. Asegúrate de no tener espacios extra al inicio o final
4. Verifica que el usuario sea `root`

### Error: "Connection refused"

1. Verifica que el servidor esté accesible
2. Verifica que `VPS_HOST` sea correcto (72.60.63.240)
3. Verifica que el puerto SSH (22) esté abierto

## 💡 Después del Test

### Si Funciona ✅

1. **Copia la contraseña exacta** que funcionó
2. **Ve a GitHub Secrets:**
   - https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions
   - Busca `VPS_SSH_PASSWORD`
   - Click "Update"
   - Pega la contraseña EXACTA (sin espacios)
   - Click "Update secret"
3. **Ejecuta "Test SSH Connection" en GitHub Actions**
4. **Si funciona, ejecuta el deployment completo**

### Si No Funciona ❌

1. Verifica la contraseña manualmente con `ssh root@72.60.63.240`
2. Asegúrate de usar la contraseña EXACTA que funciona
3. Verifica que no haya espacios extra
4. Verifica que el usuario sea correcto (`root`)

## 📝 Notas

- El script usa la misma configuración que GitHub Actions
- Si funciona aquí, debería funcionar en GitHub Actions
- La contraseña no se guarda ni se muestra en pantalla
- El script prueba SSH, Docker y permisos de directorio

## 🔗 Archivos Relacionados

- [Verificación Completa](VERIFICACION_COMPLETA.md)
- [Mejoras Workflow SSHPASS](MEJORAS_WORKFLOW_SSHPASS.md)
- [Ejecutar Test Interactivo](EJECUTAR_TEST_INTERACTIVO.md)
