# 🔧 Configuración MCP SSH Manager para Hostinger VPS

## ✅ Paquete Instalado

El paquete `mcp-ssh-manager@3.1.0` ha sido instalado globalmente.

## 📋 Configuración para Cursor

### Opción 1: Configuración Directa (Recomendada)

Agrega esta configuración en tu archivo de configuración de MCP de Cursor:

**Ubicación del archivo:** 
- Windows: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- O en Cursor: `Settings > Features > MCP`

**Configuración:**

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

### Opción 2: Usando npx (Alternativa)

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

## 🔐 Crear Archivo de Configuración SSH

Crea el archivo `.env` con la configuración de tu servidor:

**Ubicación:** `C:/Users/beyon/.ssh/mcp-ssh-manager.env`

**Contenido:**

```env
# Hostinger VPS Configuration
SSH_HOST_1=72.60.63.240
SSH_USER_1=root
SSH_PORT_1=22
SSH_KEY_1=C:/Users/beyon/.ssh/id_ed25519
SSH_NAME_1=hostinger-vps
SSH_DEFAULT_DIR_1=/opt/modules/requirements-management
```

## 📝 Pasos de Configuración

### Paso 1: Crear el archivo de configuración

```bash
# Crear directorio si no existe
mkdir -p C:/Users/beyon/.ssh

# Crear archivo de configuración
cat > C:/Users/beyon/.ssh/mcp-ssh-manager.env << 'EOF'
SSH_HOST_1=72.60.63.240
SSH_USER_1=root
SSH_PORT_1=22
SSH_KEY_1=C:/Users/beyon/.ssh/id_ed25519
SSH_NAME_1=hostinger-vps
SSH_DEFAULT_DIR_1=/opt/modules/requirements-management
EOF
```

### Paso 2: Agregar configuración a Cursor

1. Abre Cursor
2. Ve a `Settings > Features > MCP`
3. Agrega la configuración JSON mostrada arriba
4. Guarda y reinicia Cursor

### Paso 3: Verificar conexión

En Cursor, puedes probar comandos como:
- "List my SSH servers"
- "Execute 'hostname' on hostinger-vps"
- "Run 'ls -la' on hostinger-vps"

## 🔍 Verificación Manual

Puedes verificar que el servidor MCP funciona ejecutando:

```bash
node C:/Users/beyon/AppData/Roaming/npm/node_modules/mcp-ssh-manager/src/index.js
```

## 🐛 Troubleshooting

### Error: "Cannot find module"

Asegúrate de que el paquete esté instalado:
```bash
npm list -g mcp-ssh-manager
```

### Error: "SSH connection failed"

1. Verifica que la clave SSH funciona:
   ```bash
   ssh -i C:/Users/beyon/.ssh/id_ed25519 root@72.60.63.240
   ```

2. Verifica que el archivo `.env` tenga la ruta correcta de la clave

### Error: "Environment file not found"

Asegúrate de que el archivo `.env` existe en la ruta especificada:
```bash
ls -la C:/Users/beyon/.ssh/mcp-ssh-manager.env
```

## 📚 Documentación Adicional

- [Repositorio GitHub](https://github.com/bvisible/mcp-ssh-manager)
- [Documentación Completa](https://github.com/bvisible/mcp-ssh-manager#readme)

## ✅ Estado Actual

- ✅ Paquete instalado: `mcp-ssh-manager@3.1.0`
- ✅ Conexión SSH verificada: Funciona correctamente
- ⏳ Configuración MCP: Pendiente de agregar en Cursor
- ⏳ Archivo .env: Pendiente de crear


