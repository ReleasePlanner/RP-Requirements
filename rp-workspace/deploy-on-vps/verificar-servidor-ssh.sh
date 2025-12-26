#!/bin/bash

echo "=========================================="
echo "  🔍 Verificar Configuración SSH del Servidor"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Valores por defecto
VPS_HOST="${VPS_HOST:-72.60.63.240}"
VPS_USER="${VPS_USER:-root}"
VPS_SSH_PASSWORD="${VPS_SSH_PASSWORD:-Aar-Beto-2026}"

echo "🔍 Configuración:"
echo "  VPS_HOST: $VPS_HOST"
echo "  VPS_USER: $VPS_USER"
echo ""

# Verificar si sshpass está disponible
HAS_SSHPASS=false
if command -v sshpass &> /dev/null; then
    HAS_SSHPASS=true
    echo -e "${GREEN}✅ sshpass está disponible${NC}"
else
    echo -e "${YELLOW}⚠️ sshpass no está disponible${NC}"
    echo "   El script puede funcionar sin sshpass, pero necesitarás ingresar la contraseña manualmente"
fi
echo ""

# Función para ejecutar comando en el servidor
run_on_server() {
    local command="$1"
    local description="$2"

    echo -e "${BLUE}📋 $description${NC}"

    if [ "$HAS_SSHPASS" == "true" ] && [ -n "$VPS_SSH_PASSWORD" ]; then
        sshpass -p "$VPS_SSH_PASSWORD" \
            ssh -o StrictHostKeyChecking=no \
                -o UserKnownHostsFile=/dev/null \
                -o PreferredAuthentications=password \
                -o PubkeyAuthentication=no \
                -o PasswordAuthentication=yes \
                -o BatchMode=yes \
                -o IdentitiesOnly=yes \
                -o IdentityFile=/dev/null \
                "$VPS_USER@$VPS_HOST" \
                "$command"
    else
        echo "   Ejecutando: ssh $VPS_USER@$VPS_HOST '$command'"
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "$command"
    fi
    echo ""
}

# Verificar conectividad
echo -e "${BLUE}[1/5] Verificando conectividad al servidor...${NC}"
if ping -c 1 -W 2 "$VPS_HOST" &> /dev/null; then
    echo -e "${GREEN}✅ Servidor accesible${NC}"
else
    echo -e "${YELLOW}⚠️ No se pudo hacer ping (puede estar bloqueado, pero SSH puede funcionar)${NC}"
fi
echo ""

# Verificar configuración SSH
echo -e "${BLUE}[2/5] Verificando configuración SSH del servidor...${NC}"
echo ""

# Verificar PasswordAuthentication
echo "🔍 Verificando PasswordAuthentication..."
PASSWORD_AUTH=$(run_on_server \
    "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i '^PasswordAuthentication' | grep -v '^#' | tail -1" \
    "Leyendo configuración PasswordAuthentication")

if [ -z "$PASSWORD_AUTH" ]; then
    # Intentar buscar comentado
    PASSWORD_AUTH=$(run_on_server \
        "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i 'PasswordAuthentication' | grep '^#' | tail -1" \
        "Buscando PasswordAuthentication comentado")
fi

if echo "$PASSWORD_AUTH" | grep -qi "PasswordAuthentication yes"; then
    echo -e "${GREEN}✅ PasswordAuthentication está habilitado${NC}"
    echo "   $PASSWORD_AUTH"
elif echo "$PASSWORD_AUTH" | grep -qi "PasswordAuthentication no"; then
    echo -e "${RED}❌ PasswordAuthentication está DESHABILITADO${NC}"
    echo "   $PASSWORD_AUTH"
    echo ""
    echo -e "${YELLOW}💡 Necesitas habilitarlo:${NC}"
    echo "   1. Conéctate al servidor: ssh $VPS_USER@$VPS_HOST"
    echo "   2. Ejecuta: sudo sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config"
    echo "   3. Ejecuta: sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config"
    echo "   4. Reinicia SSH: sudo systemctl restart sshd"
    echo "   5. Verifica: sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication"
else
    echo -e "${YELLOW}⚠️ No se encontró configuración explícita de PasswordAuthentication${NC}"
    echo "   Por defecto, SSH puede permitir autenticación por contraseña"
    echo "   Verifica manualmente: sudo cat /etc/ssh/sshd_config | grep -i password"
fi
echo ""

# Verificar PubkeyAuthentication
echo "🔍 Verificando PubkeyAuthentication..."
PUBKEY_AUTH=$(run_on_server \
    "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i '^PubkeyAuthentication' | grep -v '^#' | tail -1" \
    "Leyendo configuración PubkeyAuthentication")

if [ -z "$PUBKEY_AUTH" ]; then
    PUBKEY_AUTH=$(run_on_server \
        "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i 'PubkeyAuthentication' | grep '^#' | tail -1" \
        "Buscando PubkeyAuthentication comentado")
fi

if [ -n "$PUBKEY_AUTH" ]; then
    echo "   $PUBKEY_AUTH"
fi
echo ""

# Verificar PermitRootLogin
echo "🔍 Verificando PermitRootLogin..."
ROOT_LOGIN=$(run_on_server \
    "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i '^PermitRootLogin' | grep -v '^#' | tail -1" \
    "Leyendo configuración PermitRootLogin")

if [ -z "$ROOT_LOGIN" ]; then
    ROOT_LOGIN=$(run_on_server \
        "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i 'PermitRootLogin' | grep '^#' | tail -1" \
        "Buscando PermitRootLogin comentado")
fi

if [ -n "$ROOT_LOGIN" ]; then
    echo "   $ROOT_LOGIN"
fi
echo ""

# Verificar estado del servicio SSH
echo -e "${BLUE}[3/5] Verificando estado del servicio SSH...${NC}"
SSH_STATUS=$(run_on_server \
    "sudo systemctl status sshd 2>/dev/null | head -3 || service sshd status 2>/dev/null | head -3" \
    "Verificando estado del servicio SSH")

if echo "$SSH_STATUS" | grep -qi "active\|running"; then
    echo -e "${GREEN}✅ Servicio SSH está corriendo${NC}"
else
    echo -e "${YELLOW}⚠️ No se pudo verificar el estado del servicio${NC}"
fi
echo ""

# Verificar puerto SSH
echo -e "${BLUE}[4/5] Verificando puerto SSH...${NC}"
SSH_PORT=$(run_on_server \
    "sudo netstat -tlnp 2>/dev/null | grep :22 || sudo ss -tlnp 2>/dev/null | grep :22 || echo 'Puerto 22 no encontrado'" \
    "Verificando puerto SSH (22)")

if echo "$SSH_PORT" | grep -qi ":22"; then
    echo -e "${GREEN}✅ SSH está escuchando en el puerto 22${NC}"
    echo "$SSH_PORT" | head -1
else
    echo -e "${YELLOW}⚠️ No se encontró SSH escuchando en el puerto 22${NC}"
fi
echo ""

# Verificar versión SSH
echo -e "${BLUE}[5/5] Verificando versión SSH del servidor...${NC}"
SSH_VERSION=$(run_on_server \
    "sshd -V 2>&1 | head -1 || echo 'No se pudo obtener versión'" \
    "Obteniendo versión SSH")

if [ -n "$SSH_VERSION" ]; then
    echo "   $SSH_VERSION"
fi
echo ""

# Resumen y recomendaciones
echo "=========================================="
echo "  📋 RESUMEN Y RECOMENDACIONES"
echo "=========================================="
echo ""

if echo "$PASSWORD_AUTH" | grep -qi "PasswordAuthentication yes"; then
    echo -e "${GREEN}✅ La configuración SSH parece correcta${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "   1. Verifica que la contraseña en GitHub Secrets sea correcta"
    echo "   2. Ejecuta 'Test SSH Connection' en GitHub Actions"
    echo "   3. Si funciona, ejecuta el deployment completo"
else
    echo -e "${RED}❌ PasswordAuthentication NO está habilitado${NC}"
    echo ""
    echo "🔧 Pasos para habilitar PasswordAuthentication:"
    echo ""
    echo "   1. Conéctate al servidor:"
    echo "      ssh $VPS_USER@$VPS_HOST"
    echo ""
    echo "   2. Edita la configuración SSH:"
    echo "      sudo nano /etc/ssh/sshd_config"
    echo ""
    echo "   3. Busca y cambia:"
    echo "      #PasswordAuthentication no"
    echo "      O"
    echo "      PasswordAuthentication no"
    echo ""
    echo "    A:"
    echo "      PasswordAuthentication yes"
    echo ""
    echo "   4. Guarda y cierra (Ctrl+X, luego Y, luego Enter)"
    echo ""
    echo "   5. Reinicia el servicio SSH:"
    echo "      sudo systemctl restart sshd"
    echo ""
    echo "   6. Verifica:"
    echo "      sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication"
    echo ""
    echo "   O usa el comando rápido:"
    echo "      sudo sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config"
    echo "      sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config"
    echo "      sudo systemctl restart sshd"
fi

echo ""
echo "=========================================="

