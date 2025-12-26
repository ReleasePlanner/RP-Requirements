# 🧪 Ejecutar Test SSH con Valores de GitHub Secrets

## 📋 Propósito

Este script prueba la conexión SSH usando los mismos valores y opciones que GitHub Actions, para verificar que la contraseña funciona antes de ejecutar el workflow.

## 🚀 Cómo Usar

### Opción 1: Script Bash (Linux/Mac/Git Bash)

```bash
# Configurar variables de entorno
export VPS_HOST="72.60.63.240"
export VPS_USER="root"
export VPS_SSH_PASSWORD="tu_contraseña_aquí"

# Ejecutar script
bash rp-workspace/deploy-on-vps/test-ssh-with-github-secrets.sh
```

### Opción 2: Script Batch (Windows)

```cmd
REM Configurar variables de entorno
set VPS_HOST=72.60.63.240
set VPS_USER=root
set VPS_SSH_PASSWORD=tu_contraseña_aquí

REM Ejecutar script
rp-workspace\deploy-on-vps\test-ssh-with-github-secrets.bat
```

### Opción 3: Una Línea (Bash)

```bash
VPS_HOST="72.60.63.240" VPS_USER="root" VPS_SSH_PASSWORD="tu_contraseña" bash rp-workspace/deploy-on-vps/test-ssh-with-github-secrets.sh
```

## ✅ Qué Hace el Script

1. **Verifica sshpass** - Instala si no está disponible
2. **Deshabilita agente SSH** - Igual que GitHub Actions
3. **Prueba conexión SSH** - Con las mismas opciones que GitHub Actions
4. **Verifica Docker** - Comprueba que Docker esté instalado
5. **Verifica directorio** - Comprueba acceso a `/opt/modules/requirements-management`

## 📊 Resultado Esperado

### Si Funciona:
```
✅ CONEXIÓN SSH EXITOSA
✅ SSH connection successful!
✅ Docker version ...
✅ Directory accessible
```

### Si Falla:
```
❌ CONEXIÓN SSH FALLIDA
Permission denied (publickey,password)
```

## 🔍 Troubleshooting

### Error: "sshpass: command not found"

**Linux:**
```bash
sudo apt-get update && sudo apt-get install -y sshpass
```

**Mac:**
```bash
brew install sshpass
```

**Windows:**
- Usa Git Bash (viene con sshpass)
- O instala WSL y usa el script .sh

### Error: "Permission denied"

1. Verifica que la contraseña sea correcta
2. Verifica que el usuario sea correcto (`root`)
3. Prueba manualmente: `ssh root@72.60.63.240`

### Error: "Connection refused"

1. Verifica que el servidor esté accesible
2. Verifica que el puerto SSH (22) esté abierto
3. Verifica que `VPS_HOST` sea correcto

## 💡 Uso Recomendado

1. **Primero:** Ejecuta este script localmente para verificar la contraseña
2. **Si funciona:** Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets con la misma contraseña
3. **Luego:** Ejecuta "Test SSH Connection" en GitHub Actions
4. **Finalmente:** Ejecuta el deployment completo

## 🔗 Referencias

- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)
- [Próximos Pasos a Ejecutar](PROXIMOS_PASOS_EJECUTAR.md)

