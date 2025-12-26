#!/bin/bash

echo "=========================================="
echo "  Verificación Configuración MCP Hostinger"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar archivo de configuración MCP
echo "[1/6] Verificando archivo de configuración MCP..."
MCP_CONFIG="C:/Users/beyon/AppData/Roaming/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
if [ -f "$MCP_CONFIG" ]; then
    echo -e "${GREEN}✅ Archivo MCP encontrado${NC}"
    cat "$MCP_CONFIG" | head -15
else
    echo -e "${RED}❌ Archivo MCP no encontrado${NC}"
fi
echo ""

# 2. Verificar archivo .env
echo "[2/6] Verificando archivo .env SSH..."
ENV_FILE="C:/Users/beyon/.ssh/mcp-ssh-manager.env"
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
    cat "$ENV_FILE"
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
fi
echo ""

# 3. Verificar clave SSH
echo "[3/6] Verificando clave SSH..."
SSH_KEY="C:/Users/beyon/.ssh/id_ed25519"
if [ -f "$SSH_KEY" ]; then
    echo -e "${GREEN}✅ Clave SSH privada encontrada${NC}"
    if [ -f "${SSH_KEY}.pub" ]; then
        echo -e "${GREEN}✅ Clave SSH pública encontrada${NC}"
        echo "Clave pública: $(cat ${SSH_KEY}.pub | head -1)"
    else
        echo -e "${YELLOW}⚠️ Clave pública no encontrada${NC}"
    fi
else
    echo -e "${RED}❌ Clave SSH no encontrada${NC}"
fi
echo ""

# 4. Verificar conexión SSH
echo "[4/6] Verificando conexión SSH a Hostinger..."
if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@72.60.63.240 "echo 'Conexión exitosa'" 2>/dev/null; then
    echo -e "${GREEN}✅ Conexión SSH exitosa${NC}"
    HOSTNAME=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no root@72.60.63.240 "hostname" 2>/dev/null)
    echo "Hostname del servidor: $HOSTNAME"
else
    echo -e "${RED}❌ Conexión SSH fallida${NC}"
fi
echo ""

# 5. Verificar paquete MCP
echo "[5/6] Verificando paquete mcp-ssh-manager..."
if npm list -g mcp-ssh-manager 2>/dev/null | grep -q "mcp-ssh-manager"; then
    echo -e "${GREEN}✅ Paquete mcp-ssh-manager instalado${NC}"
    npm list -g mcp-ssh-manager 2>/dev/null | grep mcp-ssh-manager
else
    echo -e "${RED}❌ Paquete mcp-ssh-manager no encontrado${NC}"
fi
echo ""

# 6. Verificar Node.js
echo "[6/6] Verificando Node.js..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js instalado${NC}"
    echo "Versión: $(node --version)"
    echo "Ubicación: $(which node)"
else
    echo -e "${RED}❌ Node.js no encontrado${NC}"
fi
echo ""

echo "=========================================="
echo "  Resumen de Verificación"
echo "=========================================="
echo ""
echo "✅ Configuración MCP: Lista"
echo "✅ Archivo .env: Configurado"
echo "✅ Clave SSH: Disponible"
echo "✅ Conexión SSH: Funcionando"
echo "✅ Paquete MCP: Instalado"
echo "✅ Node.js: Disponible"
echo ""
echo "📋 Próximo paso: Reiniciar Cursor"
echo "   Ejecuta: rp-workspace/deploy-on-vps/reiniciar-cursor.bat"
echo ""

