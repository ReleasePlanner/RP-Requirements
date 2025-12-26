# 🧪 Ejecutar Test SSH Interactivo

## 🚀 Ejecución Rápida

Abre tu terminal (Git Bash en Windows) y ejecuta:

```bash
bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh
```

El script te pedirá:

1. La contraseña SSH (no se mostrará mientras la escribes)
2. Presiona Enter después de escribir la contraseña

## 📋 Qué Hace el Script

1. ✅ Verifica conectividad al servidor
2. ✅ Deshabilita agente SSH (igual que GitHub Actions)
3. ✅ Prueba conexión SSH con tu contraseña
4. ✅ Verifica Docker y Docker Compose
5. ✅ Verifica acceso al directorio de deployment

## ✅ Resultado Esperado

### Si la contraseña es correcta:

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

### Si la contraseña es incorrecta:

```
❌ CONEXIÓN SSH FALLIDA
Permission denied (publickey,password)
```

## 🔍 Troubleshooting

### Error: "sshpass: command not found"

**En Git Bash (Windows):**

- Git Bash debería incluir sshpass
- Si no está, instala WSL y ejecuta el script desde allí

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

## 🔗 Archivos Relacionados

- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)
- [Próximos Pasos a Ejecutar](PROXIMOS_PASOS_EJECUTAR.md)
- [Ejecutar Test SSH](EJECUTAR_TEST_SSH.md)
