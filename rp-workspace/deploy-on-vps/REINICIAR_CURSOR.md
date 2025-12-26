# 🔄 Reiniciar Cursor para Aplicar Configuración MCP

## ✅ Configuración Agregada

La configuración MCP ha sido agregada exitosamente en:
- **Ubicación:** `C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

## 🔄 Pasos para Reiniciar Cursor

### Opción 1: Reinicio Manual (Recomendado)

1. **Cerrar completamente Cursor:**
   - Cierra todas las ventanas de Cursor
   - Verifica en el Administrador de Tareas que no queden procesos de Cursor ejecutándose
   - O usa: `Ctrl + Shift + Q` para cerrar completamente

2. **Abrir Cursor nuevamente:**
   - Abre Cursor desde el menú de inicio o escritorio
   - Espera 10-15 segundos para que MCP se inicialice

3. **Verificar que MCP está activo:**
   - Abre el chat de Cursor
   - Prueba: `List my SSH servers`
   - Deberías ver tu servidor `hostinger-vps` listado

### Opción 2: Reinicio desde Terminal

```bash
# Cerrar Cursor completamente
taskkill /F /IM Cursor.exe 2>/dev/null || echo "Cursor no está ejecutándose"

# Esperar 2 segundos
sleep 2

# Abrir Cursor nuevamente
start "" "C:\Users\beyon\AppData\Local\Programs\cursor\Cursor.exe"
```

### Opción 3: Usar Comando PowerShell

```powershell
# Cerrar Cursor
Get-Process -Name "Cursor" -ErrorAction SilentlyContinue | Stop-Process -Force

# Esperar
Start-Sleep -Seconds 2

# Abrir Cursor
Start-Process "C:\Users\beyon\AppData\Local\Programs\cursor\Cursor.exe"
```

## ✅ Verificación Post-Reinicio

Después de reiniciar Cursor, verifica que MCP funciona:

### Comandos de Prueba en Cursor:

1. **Listar servidores:**
   ```
   List my SSH servers
   ```

2. **Ejecutar comando simple:**
   ```
   Execute 'hostname' on hostinger-vps
   ```

3. **Ver estado del servidor:**
   ```
   Show server health for hostinger-vps
   ```

4. **Listar archivos:**
   ```
   Run 'ls -la' on hostinger-vps
   ```

## 🐛 Si No Funciona Después del Reinicio

### Verificar que el archivo existe:
```bash
cat "C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
```

### Verificar que el servidor MCP existe:
```bash
ls -la "C:/Users/beyon/AppData/Roaming/npm/node_modules/mcp-ssh-manager/src/index.js"
```

### Verificar que el archivo .env existe:
```bash
cat "C:/Users/beyon/.ssh/mcp-ssh-manager.env"
```

### Verificar conexión SSH manual:
```bash
ssh -i C:/Users/beyon/.ssh/id_ed25519 root@72.60.63.240 "hostname"
```

## 📝 Notas

- La primera vez que Cursor carga MCP puede tardar unos segundos
- Si ves errores, revisa la consola de desarrollador de Cursor: `Help > Toggle Developer Tools`
- Asegúrate de que Node.js esté en el PATH del sistema

## 🎉 ¡Listo!

Una vez reiniciado Cursor, deberías poder usar comandos MCP para gestionar tu VPS de Hostinger directamente desde Cursor.


