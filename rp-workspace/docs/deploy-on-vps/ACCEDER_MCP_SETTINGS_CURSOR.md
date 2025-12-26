# 🔧 Cómo Acceder a la Configuración MCP en Cursor

## 📍 Ubicación de la Configuración MCP

La configuración MCP en Cursor puede estar en diferentes lugares dependiendo de la versión:

### Opción 1: Archivo de Configuración Directo (Actual)

**Ubicación actual:**
```
C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Estado:** ✅ Configurado correctamente

### Opción 2: Desde la UI de Cursor

#### Método A: Command Palette
1. Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
2. Escribe: `MCP` o `Model Context Protocol`
3. Busca opciones como:
   - `MCP: Open Settings`
   - `MCP: Configure Servers`
   - `Preferences: Open MCP Settings`

#### Método B: Settings UI
1. Abre **Settings** (`Ctrl+,` o `Cmd+,`)
2. En la barra de búsqueda, escribe: `MCP` o `mcp`
3. Busca la sección **Features** > **MCP** o **Model Context Protocol**

#### Método C: Menú de Cursor
1. Ve a **File** > **Preferences** > **Settings**
2. Busca en la barra de búsqueda: `mcp`
3. O navega manualmente: **Features** > **MCP**

### Opción 3: Abrir el Archivo Directamente

1. Presiona `Ctrl+Shift+P`
2. Escribe: `Preferences: Open User Settings (JSON)`
3. O abre directamente el archivo:
   ```
   C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
   ```

## 🔍 Verificar si MCP está Activo

### Método 1: Verificar en la Consola de Desarrollador
1. Abre la consola: `Help` > `Toggle Developer Tools`
2. Ve a la pestaña **Console**
3. Busca mensajes relacionados con `MCP` o `mcp-ssh-manager`
4. Si ves errores, cópialos para diagnosticar

### Método 2: Verificar en el Panel de Cursor
1. Abre el panel lateral izquierdo
2. Busca un ícono o sección relacionada con **MCP** o **Servers**
3. Algunas versiones de Cursor muestran servidores MCP activos aquí

### Método 3: Probar Comando en el Chat
En el chat de Cursor, prueba:
```
List my SSH servers
```

Si MCP está activo, deberías ver `hostinger-vps` listado.

## 🛠️ Solución si No Aparece en Settings

### Paso 1: Verificar que el Archivo Existe
```bash
# Verificar archivo
cat "C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
```

### Paso 2: Verificar Formato JSON
El archivo debe tener este formato:
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

### Paso 3: Reiniciar Cursor Completamente
1. Cierra **TODAS** las ventanas de Cursor
2. Abre **Administrador de Tareas** (`Ctrl+Shift+Esc`)
3. Termina todos los procesos `Cursor.exe`
4. Espera 5 segundos
5. Abre Cursor nuevamente
6. Espera 15-20 segundos para que MCP se inicialice

### Paso 4: Verificar Logs
1. Abre `Help` > `Toggle Developer Tools`
2. Ve a la pestaña **Console**
3. Busca mensajes que contengan:
   - `MCP`
   - `mcp-ssh-manager`
   - `hostinger-vps`
   - Errores relacionados

## 📋 Configuración Actual

Tu configuración actual está en:
```
C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Contenido:**
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

## ⚠️ Nota Importante

En algunas versiones de Cursor, la configuración MCP **no aparece en la UI de Settings**. Esto es normal. La configuración funciona a través del archivo JSON, y Cursor la carga automáticamente al iniciar.

**Lo importante es que:**
1. ✅ El archivo existe y tiene el formato correcto
2. ✅ Cursor se reinició después de crear el archivo
3. ✅ Puedes usar comandos MCP en el chat

## 🧪 Prueba de Funcionamiento

Después de reiniciar Cursor, prueba estos comandos en el chat:

1. **Listar servidores:**
   ```
   List my SSH servers
   ```

2. **Ejecutar comando:**
   ```
   Execute 'hostname' on hostinger-vps
   ```

3. **Ver directorio:**
   ```
   Show current directory on hostinger-vps
   ```

Si estos comandos funcionan, **MCP está activo**, aunque no aparezca en la UI de Settings.

## 🔄 Alternativa: Verificar desde Terminal

Puedes verificar si MCP está funcionando ejecutando:

```bash
# Verificar que el proceso MCP está corriendo
# (después de reiniciar Cursor)
```

O revisar los logs de Cursor en:
```
C:/Users/beyon/AppData/Roaming/Cursor/logs/
```

