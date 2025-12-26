# 🔧 Configuración Completa MCP para Hostinger VPS

## ✅ Estado Actual

- ✅ Paquete `mcp-ssh-manager@3.1.0` instalado globalmente
- ✅ Archivo de configuración SSH creado: `C:/Users/beyon/.ssh/mcp-ssh-manager.env`
- ✅ Clave SSH disponible: `C:/Users/beyon/.ssh/id_ed25519`
- ✅ Configuración MCP agregada en Cursor

## 📋 Configuración Aplicada

### Archivo de Configuración MCP

**Ubicación:** `C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Contenido:**
```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-ssh-manager"
      ],
      "env": {
        "SSH_MANAGER_ENV": "C:/Users/beyon/.ssh/mcp-ssh-manager.env"
      }
    }
  }
}
```

### Archivo de Configuración SSH

**Ubicación:** `C:/Users/beyon/.ssh/mcp-ssh-manager.env`

**Contenido:**
```
# Hostinger VPS Configuration
# MCP SSH Manager Environment File

# Server 1: Hostinger VPS
SSH_HOST_1=72.60.63.240
SSH_USER_1=root
SSH_PORT_1=22
SSH_KEY_1=C:/Users/beyon/.ssh/id_ed25519
SSH_NAME_1=hostinger-vps
SSH_DEFAULT_DIR_1=/opt/modules/requirements-management
```

## 🔄 Pasos para Activar

### Paso 1: Reiniciar Cursor

**IMPORTANTE:** Debes reiniciar Cursor completamente para que la configuración MCP se cargue.

#### Opción A: Script Automático
```bash
rp-workspace/deploy-on-vps/reiniciar-cursor.bat
```

#### Opción B: Manual
1. Cierra todas las ventanas de Cursor
2. Verifica en el Administrador de Tareas que no queden procesos `Cursor.exe`
3. Abre Cursor nuevamente
4. Espera 10-15 segundos para que MCP se inicialice

### Paso 2: Verificar Conexión

Después de reiniciar Cursor, prueba estos comandos en el chat:

#### Listar servidores SSH:
```
List my SSH servers
```

#### Ejecutar comando simple:
```
Execute 'hostname' on hostinger-vps
```

#### Ver estado del servidor:
```
Show server health for hostinger-vps
```

#### Listar archivos:
```
Run 'ls -la' on hostinger-vps
```

#### Verificar directorio de trabajo:
```
Show current directory on hostinger-vps
```

## 🐛 Solución de Problemas

### Si no ves la conexión después del reinicio:

#### 1. Verificar que el archivo de configuración existe:
```bash
cat "C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
```

#### 2. Verificar que el archivo .env existe:
```bash
cat "C:/Users/beyon/.ssh/mcp-ssh-manager.env"
```

#### 3. Verificar que Node.js está en el PATH:
```bash
node --version
which node
```

#### 4. Verificar que el paquete está instalado:
```bash
npm list -g mcp-ssh-manager
```

#### 5. Probar el servidor MCP manualmente:
```bash
npx -y mcp-ssh-manager
```

#### 6. Verificar conexión SSH manual:
```bash
ssh -i C:/Users/beyon/.ssh/id_ed25519 root@72.60.63.240 "hostname"
```

### Si hay errores en la consola de Cursor:

1. Abre la consola de desarrollador: `Help > Toggle Developer Tools`
2. Ve a la pestaña "Console"
3. Busca errores relacionados con "MCP" o "mcp-ssh-manager"
4. Comparte los errores para diagnóstico

### Configuración Alternativa (si npx no funciona)

Si `npx` no funciona, puedes usar la ruta directa:

```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "node",
      "args": [
        "C:/Users/beyon/AppData/Roaming/npm/node_modules/mcp-ssh-manager/src/index.js"
      ],
      "env": {
        "SSH_MANAGER_ENV": "C:/Users/beyon/.ssh/mcp-ssh-manager.env"
      }
    }
  }
}
```

## 📝 Notas Importantes

1. **Primera vez:** La primera vez que Cursor carga MCP puede tardar unos segundos mientras descarga/verifica el paquete con `npx`.

2. **Permisos SSH:** Asegúrate de que tu clave SSH (`id_ed25519`) tenga los permisos correctos:
   ```bash
   chmod 600 C:/Users/beyon/.ssh/id_ed25519
   ```

3. **Autorización en el servidor:** Tu clave pública SSH debe estar en `~/.ssh/authorized_keys` del servidor Hostinger.

4. **Firewall:** Asegúrate de que el puerto 22 (SSH) esté abierto en Hostinger.

## ✅ Verificación Final

Una vez configurado correctamente, deberías poder:

- ✅ Ver el servidor `hostinger-vps` listado cuando preguntas por servidores SSH
- ✅ Ejecutar comandos remotos desde Cursor
- ✅ Transferir archivos al servidor
- ✅ Monitorear el estado del servidor
- ✅ Gestionar bases de datos remotas
- ✅ Realizar backups automáticos

## 🎉 ¡Listo!

Tu servidor MCP para Hostinger está configurado y listo para usar. Solo necesitas reiniciar Cursor para activarlo.

