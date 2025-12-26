# 🔍 Cómo Abrir la Configuración MCP en Cursor

## ⚠️ Importante: La Configuración MCP Puede No Aparecer en Settings UI

En algunas versiones de Cursor, la configuración MCP **no aparece visualmente en Settings**, pero **funciona correctamente** a través del archivo JSON.

## 📍 Ubicación del Archivo de Configuración

Tu configuración MCP está en:
```
C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## 🔧 Métodos para Abrir/Ver la Configuración

### Método 1: Abrir el Archivo Directamente (Más Rápido)

1. Presiona `Ctrl+Shift+P` (Command Palette)
2. Escribe: `File: Open File`
3. Pega esta ruta:
   ```
   C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
   ```
4. Presiona Enter

### Método 2: Desde el Explorador de Archivos

1. Abre el Explorador de Windows
2. Navega a:
   ```
   %APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\
   ```
3. Abre el archivo `cline_mcp_settings.json`

### Método 3: Usar el Comando de Cursor

1. Presiona `Ctrl+Shift+P`
2. Escribe: `Preferences: Open User Settings (JSON)`
3. Esto abre `settings.json`, pero puedes navegar al directorio MCP desde ahí

### Método 4: Buscar en Settings (Puede No Aparecer)

1. Abre Settings: `Ctrl+,`
2. En la barra de búsqueda, escribe: `mcp`
3. Si aparece, verás la configuración MCP
4. **Si no aparece**, es normal - usa el archivo JSON directamente

## ✅ Verificar que la Configuración Está Activa

### Verificación 1: Ver el Archivo

El archivo debe contener:
```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "npx",
      "args": ["-y", "mcp-ssh-manager"],
      "env": {
        "SSH_MANAGER_ENV": "C:/Users/beyon/.ssh/mcp-ssh-manager.env"
      }
    }
  }
}
```

### Verificación 2: Probar en el Chat de Cursor

Después de reiniciar Cursor, prueba estos comandos:

1. **Listar servidores SSH:**
   ```
   List my SSH servers
   ```
   **Resultado esperado:** Deberías ver `hostinger-vps`

2. **Ejecutar comando:**
   ```
   Execute 'hostname' on hostinger-vps
   ```
   **Resultado esperado:** `srv1191543`

3. **Ver directorio:**
   ```
   Show current directory on hostinger-vps
   ```
   **Resultado esperado:** `/opt/modules/requirements-management`

### Verificación 3: Revisar Logs de Cursor

1. Abre: `Help` > `Toggle Developer Tools`
2. Ve a la pestaña **Console**
3. Busca mensajes que contengan:
   - `MCP`
   - `mcp-ssh-manager`
   - `hostinger-vps`

Si ves estos mensajes, MCP está funcionando.

## 🔄 Si No Funciona: Reiniciar Cursor

**IMPORTANTE:** Después de modificar el archivo de configuración, **debes reiniciar Cursor completamente**.

### Pasos para Reiniciar:

1. Cierra **TODAS** las ventanas de Cursor
2. Abre **Administrador de Tareas** (`Ctrl+Shift+Esc`)
3. Busca procesos `Cursor.exe` y termínalos todos
4. Espera 5 segundos
5. Abre Cursor nuevamente
6. Espera **15-20 segundos** para que MCP se inicialice

### Script de Reinicio Automático:

Ejecuta:
```bash
rp-workspace/deploy-on-vps/reiniciar-cursor.bat
```

## 📋 Configuración Actual Verificada

✅ **Archivo existe:** `cline_mcp_settings.json`
✅ **Formato correcto:** JSON válido
✅ **Configuración completa:** Servidor `hostinger-vps` configurado
✅ **Archivo .env:** `mcp-ssh-manager.env` existe y está configurado
✅ **Clave SSH:** Autorizada en el servidor
✅ **Conexión SSH:** Funcionando

## 🎯 Próximos Pasos

1. **Abre el archivo de configuración** usando uno de los métodos arriba
2. **Verifica** que el contenido es correcto
3. **Reinicia Cursor** completamente
4. **Prueba** los comandos MCP en el chat

## 💡 Nota Importante

**No te preocupes si no ves MCP en Settings UI.** Lo importante es:
- ✅ El archivo existe y tiene el formato correcto
- ✅ Cursor se reinició después de crear/modificar el archivo
- ✅ Los comandos MCP funcionan en el chat

Si los comandos funcionan, **MCP está activo y funcionando**, aunque no aparezca en la UI de Settings.

