# 🔧 Configuración MCP SSH para Hostinger VPS

## ❌ Problema con la Configuración Actual

La configuración actual usa una URL de GitHub tree que no funciona con `npx`:

```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/modelcontextprotocol/servers/tree/main/src/ssh",  // ❌ Esto no funciona
        "ssh://root@72.60.63.240",
        "--identityFile",
        "C:/Users/beyon/.ssh/id_ed25519"
      ]
    }
  }
}
```

## ✅ Solución 1: Usar el Paquete NPM Oficial

### Paso 1: Instalar el paquete globalmente

```bash
npm install -g @modelcontextprotocol/server-ssh
```

### Paso 2: Configuración Correcta para Cursor

```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-ssh",
        "ssh://root@72.60.63.240",
        "--identity-file",
        "C:/Users/beyon/.ssh/id_ed25519"
      ],
      "env": {
        "NPM_CONFIG_USERCONFIG": "C:/EMPTY_FILE"
      }
    }
  }
}
```

**Nota:** Cambié `--identityFile` a `--identity-file` (con guión) que es el formato estándar.

## ✅ Solución 2: Usar el Comando Directo (Recomendado)

Si el paquete está instalado globalmente:

```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "mcp-server-ssh",
      "args": [
        "ssh://root@72.60.63.240",
        "--identity-file",
        "C:/Users/beyon/.ssh/id_ed25519"
      ],
      "env": {
        "NPM_CONFIG_USERCONFIG": "C:/EMPTY_FILE"
      }
    }
  }
}
```

## ✅ Solución 3: Usar Contraseña en lugar de Clave SSH

Si prefieres usar contraseña SSH (como en GitHub Actions):

```json
{
  "mcpServers": {
    "hostinger-vps": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-ssh",
        "ssh://root@72.60.63.240"
      ],
      "env": {
        "NPM_CONFIG_USERCONFIG": "C:/EMPTY_FILE",
        "SSH_PASSWORD": "tu-contraseña-ssh"
      }
    }
  }
}
```

## 🔍 Verificación

### 1. Verificar que la clave SSH funciona manualmente

```bash
ssh -i C:/Users/beyon/.ssh/id_ed25519 root@72.60.63.240
```

### 2. Verificar permisos de la clave (en Git Bash)

```bash
chmod 600 C:/Users/beyon/.ssh/id_ed25519
```

### 3. Probar conexión con contraseña

```bash
ssh root@72.60.63.240
```

## 📝 Ubicación del Archivo de Configuración

El archivo de configuración de MCP en Cursor generalmente está en:

- **Windows:** `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- O en la configuración de Cursor: `Settings > Features > MCP`

## 🐛 Troubleshooting

### Error: "Could not find module"

```bash
npm install -g @modelcontextprotocol/server-ssh
```

### Error: "Permission denied"

1. Verifica que la clave SSH tenga permisos correctos: `chmod 600`
2. Verifica que la clave pública esté en `~/.ssh/authorized_keys` del VPS
3. Prueba la conexión manualmente primero

### Error: "Connection refused"

1. Verifica que el VPS esté accesible: `ping 72.60.63.240`
2. Verifica que SSH esté escuchando en el puerto 22
3. Verifica el firewall del VPS

## 🔐 Alternativa: Usar GitHub Actions (Ya Configurado)

Si MCP SSH sigue dando problemas, puedes usar GitHub Actions para deployment (ya está configurado):

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to Hostinger**
3. Click en **Run workflow**

El workflow ya está configurado para usar `VPS_SSH_PASSWORD` que ya configuraste.


