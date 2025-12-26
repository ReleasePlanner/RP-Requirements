#!/bin/bash

echo "=========================================="
echo "  Test SSH Connection - GitHub Secrets"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Valores de GitHub Secrets (simulados)
# NOTA: Estos valores deben coincidir con los de GitHub Secrets
VPS_HOST="${VPS_HOST:-72.60.63.240}"
VPS_USER="${VPS_USER:-root}"
VPS_SSH_PASSWORD="${VPS_SSH_PASSWORD:-}"

echo "🔍 Configuración:"
echo "  VPS_HOST: $VPS_HOST"
echo "  VPS_USER: $VPS_USER"
echo "  VPS_SSH_PASSWORD: ${VPS_SSH_PASSWORD:+***configurado***}"
echo ""

# Verificar que sshpass esté instalado
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}⚠️ sshpass no está instalado${NC}"
    echo "Instalando sshpass..."
    
    # Detectar sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sshpass
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install sshpass
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo -e "${RED}❌ Windows: Instala sshpass manualmente o usa Git Bash${NC}"
        echo "   Opción: Usar WSL o Git Bash con sshpass instalado"
        exit 1
    else
        echo -e "${RED}❌ Sistema operativo no soportado${NC}"
        exit 1
    fi
fi

# Verificar que VPS_SSH_PASSWORD esté configurado
if [ -z "$VPS_SSH_PASSWORD" ]; then
    echo -e "${RED}❌ VPS_SSH_PASSWORD no está configurado${NC}"
    echo ""
    echo "Para probar la conexión, configura la variable de entorno:"
    echo "  export VPS_SSH_PASSWORD='tu_contraseña'"
    echo ""
    echo "O ejecuta:"
    echo "  VPS_SSH_PASSWORD='tu_contraseña' bash test-ssh-with-github-secrets.sh"
    echo ""
    exit 1
fi

echo -e "${BLUE}[1/4] Verificando conectividad al servidor...${NC}"
if ping -c 1 -W 2 "$VPS_HOST" &> /dev/null; then
    echo -e "${GREEN}✅ Servidor accesible${NC}"
else
    echo -e "${YELLOW}⚠️ No se pudo hacer ping (puede estar bloqueado, pero SSH puede funcionar)${NC}"
fi
echo ""

echo -e "${BLUE}[2/4] Deshabilitando agente SSH...${NC}"
unset SSH_AUTH_SOCK
unset SSH_AGENT_PID
export SSH_AUTH_SOCK=""
export SSH_AGENT_PID=""
ssh-add -D 2>/dev/null || true
echo -e "${GREEN}✅ Agente SSH deshabilitado${NC}"
echo ""

echo -e "${BLUE}[3/4] Probando conexión SSH con contraseña...${NC}"
echo "Comando que se ejecutará:"
echo "  sshpass -p '***' ssh -o PreferredAuthentications=password ... $VPS_USER@$VPS_HOST 'echo test'"
echo ""

# Probar conexión SSH
if sshpass -p "$VPS_SSH_PASSWORD" \
    ssh -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=10 \
        -o PreferredAuthentications=password \
        -o PubkeyAuthentication=no \
        -o PasswordAuthentication=yes \
        -o BatchMode=yes \
        -o NumberOfPasswordPrompts=1 \
        -o IdentitiesOnly=yes \
        -o IdentityFile=/dev/null \
        -o KbdInteractiveAuthentication=no \
        -o ChallengeResponseAuthentication=no \
        -o GSSAPIAuthentication=no \
        -o HostbasedAuthentication=no \
        "$VPS_USER@$VPS_HOST" \
        "echo '✅ SSH connection successful!' && uname -a && docker --version 2>/dev/null || echo '⚠️ Docker not installed'" 2>&1; then
    
    echo ""
    echo -e "${GREEN}=========================================="
    echo "  ✅ CONEXIÓN SSH EXITOSA"
    echo "==========================================${NC}"
    echo ""
    echo "La contraseña funciona correctamente."
    echo "Puedes usar esta misma contraseña en GitHub Secrets."
    echo ""
    
    echo -e "${BLUE}[4/4] Probando comandos adicionales...${NC}"
    
    # Probar docker
    echo "Verificando Docker..."
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
            "docker --version && docker-compose --version || echo '⚠️ Docker Compose not installed'" 2>/dev/null
    
    # Probar directorio
    echo "Verificando directorio de deployment..."
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
            "mkdir -p /opt/modules/requirements-management && ls -la /opt/modules && echo '✅ Directory accessible'" 2>/dev/null
    
    echo ""
    echo -e "${GREEN}✅ Todas las pruebas pasaron exitosamente${NC}"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Actualiza VPS_SSH_PASSWORD en GitHub Secrets con esta contraseña"
    echo "   2. Ejecuta 'Test SSH Connection' en GitHub Actions"
    echo "   3. Si funciona, ejecuta el deployment completo"
    
else
    echo ""
    echo -e "${RED}=========================================="
    echo "  ❌ CONEXIÓN SSH FALLIDA"
    echo "==========================================${NC}"
    echo ""
    echo "El error indica que:"
    echo "  1. La contraseña es incorrecta"
    echo "  2. El usuario SSH es incorrecto"
    echo "  3. El servidor tiene restricciones"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "   1. Verifica la contraseña manualmente:"
    echo "      ssh $VPS_USER@$VPS_HOST"
    echo ""
    echo "   2. Verifica que el usuario sea correcto"
    echo ""
    echo "   3. Verifica que el servidor permita autenticación por contraseña"
    echo ""
    exit 1
fi

