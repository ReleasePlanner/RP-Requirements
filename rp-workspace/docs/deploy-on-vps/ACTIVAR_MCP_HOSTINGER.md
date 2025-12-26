# 🚀 Activar MCP para Hostinger - Guía Rápida

## ✅ Configuración Completada

He actualizado la configuración MCP en Cursor para usar `npx`, que es más confiable.

## 🔄 Pasos para Activar

### 1️⃣ Reiniciar Cursor (OBLIGATORIO)

**Debes reiniciar Cursor completamente para que la configuración se cargue.**

#### Opción Rápida - Ejecutar Script:
```bash
rp-workspace/deploy-on-vps/reiniciar-cursor.bat
```

#### Opción Manual:
1. Cierra **TODAS** las ventanas de Cursor
2. Abre el **Administrador de Tareas** (Ctrl+Shift+Esc)
3. Busca procesos `Cursor.exe` y termínalos todos
4. Abre Cursor nuevamente
5. Espera **15-20 segundos** para que MCP se inicialice

### 2️⃣ Verificar que Funciona

Después de reiniciar, prueba en el chat de Cursor:

```
List my SSH servers
```

Deberías ver algo como:
```
✅ Found 1 SSH server:
- hostinger-vps (72.60.63.240)
```

### 3️⃣ Probar Conexión

Ejecuta este comando en Cursor:

```
Execute 'hostname' on hostinger-vps
```

Deberías ver el hostname de tu servidor Hostinger.

## 📋 Comandos Útiles para Probar

```
# Ver servidores disponibles
List my SSH servers

# Ejecutar comando remoto
Execute 'hostname' on hostinger-vps
Execute 'pwd' on hostinger-vps
Execute 'ls -la' on hostinger-vps

# Ver estado del servidor
Show server health for hostinger-vps

# Ver directorio actual
Show current directory on hostinger-vps
```

## 🐛 Si No Funciona

### Verificar Configuración:

1. **Verificar archivo de configuración:**
   ```bash
   cat "C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
   ```

2. **Verificar archivo .env:**
   ```bash
   cat "C:/Users/beyon/.ssh/mcp-ssh-manager.env"
   ```

3. **Verificar Node.js:**
   ```bash
   node --version
   ```

4. **Probar servidor MCP manualmente:**
   ```bash
   npx -y mcp-ssh-manager
   ```

5. **Verificar conexión SSH:**
   ```bash
   ssh -i C:/Users/beyon/.ssh/id_ed25519 root@72.60.63.240 "hostname"
   ```

### Ver Logs de Cursor:

1. Abre Cursor
2. Ve a `Help > Toggle Developer Tools`
3. Ve a la pestaña "Console"
4. Busca mensajes relacionados con "MCP" o "mcp-ssh-manager"

## 📝 Configuración Actual

**Archivo MCP:** `C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

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

**Archivo SSH:** `C:/Users/beyon/.ssh/mcp-ssh-manager.env`

```
SSH_HOST_1=72.60.63.240
SSH_USER_1=root
SSH_PORT_1=22
SSH_KEY_1=C:/Users/beyon/.ssh/id_ed25519
SSH_NAME_1=hostinger-vps
SSH_DEFAULT_DIR_1=/opt/modules/requirements-management
```

## ✅ Checklist Final

- [ ] Configuración MCP actualizada en Cursor
- [ ] Archivo .env verificado
- [ ] Cursor reiniciado completamente
- [ ] Esperado 15-20 segundos después del reinicio
- [ ] Probado comando "List my SSH servers"
- [ ] Conexión SSH funcionando

## 🎉 ¡Listo!

Una vez reiniciado Cursor, deberías poder gestionar tu servidor Hostinger directamente desde Cursor usando comandos MCP.

