#!/bin/bash

echo "=========================================="
echo "  🔧 Habilitar PasswordAuthentication en el Servidor"
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
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "$command"
    fi
}

# Verificar configuración actual
echo -e "${BLUE}[1/3] Verificando configuración actual...${NC}"
CURRENT_CONFIG=$(run_on_server \
    "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i 'PasswordAuthentication' | grep -v '^#' | tail -1" \
    "")

if [ -z "$CURRENT_CONFIG" ]; then
    CURRENT_CONFIG=$(run_on_server \
        "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i 'PasswordAuthentication' | grep '^#' | tail -1" \
        "")
fi

echo "Configuración actual:"
if [ -n "$CURRENT_CONFIG" ]; then
    echo "   $CURRENT_CONFIG"
else
    echo "   (No encontrada - se agregará nueva configuración)"
fi
echo ""

# Habilitar PasswordAuthentication
echo -e "${BLUE}[2/3] Habilitando PasswordAuthentication...${NC}"
echo ""

# Ejecutar comandos para habilitar PasswordAuthentication
RESULT=$(run_on_server \
    "sudo sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
     sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
     sudo grep -q '^PasswordAuthentication yes' /etc/ssh/sshd_config || echo 'PasswordAuthentication yes' | sudo tee -a /etc/ssh/sshd_config > /dev/null && \
     sudo cat /etc/ssh/sshd_config | grep -i 'PasswordAuthentication' | grep -v '^#' | tail -1" \
    "")

if echo "$RESULT" | grep -qi "PasswordAuthentication yes"; then
    echo -e "${GREEN}✅ PasswordAuthentication habilitado${NC}"
    echo "   $RESULT"
else
    echo -e "${YELLOW}⚠️ Intentando método alternativo...${NC}"
    # Método alternativo: agregar al final del archivo
    run_on_server \
        "echo 'PasswordAuthentication yes' | sudo tee -a /etc/ssh/sshd_config > /dev/null" \
        ""

    VERIFY=$(run_on_server \
        "sudo cat /etc/ssh/sshd_config | grep -i 'PasswordAuthentication' | grep -v '^#' | tail -1" \
        "")

    if echo "$VERIFY" | grep -qi "PasswordAuthentication yes"; then
        echo -e "${GREEN}✅ PasswordAuthentication habilitado (método alternativo)${NC}"
        echo "   $VERIFY"
    else
        echo -e "${RED}❌ No se pudo habilitar PasswordAuthentication${NC}"
        echo "   Por favor, hazlo manualmente"
        exit 1
    fi
fi
echo ""

# Reiniciar servicio SSH
echo -e "${BLUE}[3/3] Reiniciando servicio SSH...${NC}"
RESTART_RESULT=$(run_on_server \
    "sudo systemctl restart sshd && sudo systemctl status sshd --no-pager | head -3" \
    "")

if echo "$RESTART_RESULT" | grep -qi "active\|running"; then
    echo -e "${GREEN}✅ Servicio SSH reiniciado correctamente${NC}"
else
    echo -e "${YELLOW}⚠️ Reinicio completado (verificando estado...)${NC}"
fi
echo ""

# Verificación final
echo "=========================================="
echo "  ✅ VERIFICACIÓN FINAL"
echo "=========================================="
echo ""

FINAL_CONFIG=$(run_on_server \
    "sudo cat /etc/ssh/sshd_config | grep -i 'PasswordAuthentication' | grep -v '^#' | tail -1" \
    "")

if echo "$FINAL_CONFIG" | grep -qi "PasswordAuthentication yes"; then
    echo -e "${GREEN}✅ PasswordAuthentication está habilitado${NC}"
    echo "   $FINAL_CONFIG"
    echo ""
    echo "🎉 ¡Configuración completada exitosamente!"
    echo ""
    echo "Próximos pasos:"
    echo "   1. Verifica que la contraseña en GitHub Secrets sea correcta"
    echo "   2. Ejecuta 'Test SSH Connection' en GitHub Actions"
    echo "   3. Si funciona, ejecuta el deployment completo"
else
    echo -e "${RED}❌ PasswordAuthentication NO está habilitado${NC}"
    echo ""
    echo "Por favor, habilítalo manualmente:"
    echo "   ssh $VPS_USER@$VPS_HOST"
    echo "   sudo nano /etc/ssh/sshd_config"
    echo "   (Busca y cambia PasswordAuthentication a yes)"
    echo "   sudo systemctl restart sshd"
fi

echo ""
echo "=========================================="

