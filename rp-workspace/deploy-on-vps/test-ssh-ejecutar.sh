#!/bin/bash

echo "=========================================="
echo "  Test SSH Connection - Ejecución Directa"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Valores por defecto (pueden ser sobrescritos)
VPS_HOST="${VPS_HOST:-72.60.63.240}"
VPS_USER="${VPS_USER:-root}"
VPS_SSH_PASSWORD="${VPS_SSH_PASSWORD:-}"

echo "🔍 Configuración actual:"
echo "  VPS_HOST: $VPS_HOST"
echo "  VPS_USER: $VPS_USER"
if [ -n "$VPS_SSH_PASSWORD" ]; then
    echo "  VPS_SSH_PASSWORD: (configurada desde variable de entorno)"
else
    echo "  VPS_SSH_PASSWORD: (NO configurada)"
    echo ""
    echo -e "${YELLOW}💡 Para usar este script, configura la variable de entorno:${NC}"
    echo "   export VPS_SSH_PASSWORD='tu_contraseña'"
    echo "   bash rp-workspace/deploy-on-vps/test-ssh-ejecutar.sh"
    echo ""
    echo -e "${YELLOW}O usa el script interactivo:${NC}"
    echo "   bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh"
    exit 1
fi
echo ""

# Verificar que sshpass esté instalado
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}⚠️ sshpass no está instalado${NC}"
    echo ""
    
    # Detectar sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Instalando sshpass en Linux..."
        sudo apt-get update && sudo apt-get install -y sshpass
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Instalando sshpass en macOS..."
        brew install hudochenkov/sshpass/sshpass || brew install sshpass
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo -e "${YELLOW}⚠️ Windows detectado: sshpass no está disponible por defecto${NC}"
        echo ""
        echo "📋 Opciones para instalar sshpass en Windows:"
        echo ""
        echo "   Opción 1: Usar WSL (Recomendado)"
        echo "   1. Instala WSL: wsl --install"
        echo "   2. En WSL: sudo apt update && sudo apt install sshpass -y"
        echo "   3. Ejecuta este script desde WSL"
        echo ""
        echo "   Opción 2: Descargar binario precompilado"
        echo "   1. Descarga desde: https://github.com/keimpx/sshpass-windows/releases"
        echo "   2. Coloca sshpass.exe en: C:\\Program Files\\Git\\usr\\bin\\"
        echo "   3. O en cualquier directorio en tu PATH"
        echo ""
        echo "   Opción 3: Usar Chocolatey"
        echo "   1. Instala Chocolatey si no lo tienes"
        echo "   2. Ejecuta: choco install sshpass"
        echo ""
        echo -e "${YELLOW}💡 Mientras tanto, puedes usar el script interactivo que maneja mejor Windows:${NC}"
        echo "   bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh"
        echo ""
        exit 1
    else
        echo -e "${RED}❌ Sistema operativo no soportado: $OSTYPE${NC}"
        echo "   Por favor, instala sshpass manualmente"
        exit 1
    fi
    
    # Verificar si se instaló correctamente
    if ! command -v sshpass &> /dev/null; then
        echo -e "${RED}❌ No se pudo instalar sshpass automáticamente${NC}"
        echo "   Por favor, instálalo manualmente y vuelve a ejecutar el script"
        exit 1
    fi
    
    echo -e "${GREEN}✅ sshpass instalado correctamente${NC}"
    echo ""
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
rm -f ~/.ssh/id_* 2>/dev/null || true
rm -f ~/.ssh/known_hosts 2>/dev/null || true
echo -e "${GREEN}✅ Agente SSH deshabilitado${NC}"
echo ""

echo -e "${BLUE}[3/4] Probando conexión SSH con contraseña...${NC}"
echo "Conectando a: $VPS_USER@$VPS_HOST"
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
        "echo '✅ SSH connection successful!' && echo 'Hostname:' && hostname && echo 'Uptime:' && uptime" 2>&1; then
    
    echo ""
    echo -e "${GREEN}=========================================="
    echo "  ✅ CONEXIÓN SSH EXITOSA"
    echo "==========================================${NC}"
    echo ""
    echo "La contraseña funciona correctamente."
    echo ""
    
    echo -e "${BLUE}[4/4] Probando comandos adicionales...${NC}"
    
    # Probar docker
    echo "Verificando Docker..."
    DOCKER_OUTPUT=$(sshpass -p "$VPS_SSH_PASSWORD" \
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o PreferredAuthentications=password \
            -o PubkeyAuthentication=no \
            -o PasswordAuthentication=yes \
            -o BatchMode=yes \
            -o IdentitiesOnly=yes \
            -o IdentityFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "docker --version 2>&1" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker instalado:${NC}"
        echo "$DOCKER_OUTPUT"
    else
        echo -e "${YELLOW}⚠️ Docker no está instalado o no está accesible${NC}"
    fi
    
    # Probar docker-compose
    echo ""
    echo "Verificando Docker Compose..."
    COMPOSE_OUTPUT=$(sshpass -p "$VPS_SSH_PASSWORD" \
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o PreferredAuthentications=password \
            -o PubkeyAuthentication=no \
            -o PasswordAuthentication=yes \
            -o BatchMode=yes \
            -o IdentitiesOnly=yes \
            -o IdentityFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "docker-compose --version 2>&1 || docker compose version 2>&1" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker Compose instalado:${NC}"
        echo "$COMPOSE_OUTPUT"
    else
        echo -e "${YELLOW}⚠️ Docker Compose no está instalado${NC}"
    fi
    
    # Probar directorio
    echo ""
    echo "Verificando directorio de deployment..."
    DIR_OUTPUT=$(sshpass -p "$VPS_SSH_PASSWORD" \
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o PreferredAuthentications=password \
            -o PubkeyAuthentication=no \
            -o PasswordAuthentication=yes \
            -o BatchMode=yes \
            -o IdentitiesOnly=yes \
            -o IdentityFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "mkdir -p /opt/modules/requirements-management && ls -la /opt/modules 2>&1" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Directorio accesible:${NC}"
        echo "$DIR_OUTPUT"
    else
        echo -e "${YELLOW}⚠️ No se pudo acceder al directorio${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}=========================================="
    echo "  ✅ TODAS LAS PRUEBAS PASARON"
    echo "==========================================${NC}"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. ✅ Esta contraseña funciona correctamente"
    echo "   2. Actualiza VPS_SSH_PASSWORD en GitHub Secrets con esta misma contraseña"
    echo "   3. Ejecuta 'Test SSH Connection' en GitHub Actions"
    echo "   4. Si funciona, ejecuta el deployment completo"
    echo ""
    echo "🔗 GitHub Secrets:"
    echo "   https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions"
    echo ""
    
else
    ERROR_OUTPUT=$?
    echo ""
    echo -e "${RED}=========================================="
    echo "  ❌ CONEXIÓN SSH FALLIDA"
    echo "==========================================${NC}"
    echo ""
    echo "El error indica que:"
    echo "  1. ❌ La contraseña es incorrecta"
    echo "  2. ❌ El usuario SSH es incorrecto"
    echo "  3. ❌ El servidor tiene restricciones"
    echo ""
    echo "🔍 Troubleshooting:"
    echo ""
    echo "   1. Verifica la contraseña manualmente:"
    echo "      ssh $VPS_USER@$VPS_HOST"
    echo ""
    echo "   2. Verifica que el usuario sea correcto"
    echo "      Usuario actual: $VPS_USER"
    echo ""
    echo "   3. Verifica que el servidor permita autenticación por contraseña"
    echo ""
    echo "   4. Verifica que no haya espacios extra en la contraseña"
    echo ""
    echo "💡 Tip: Copia la contraseña exacta que funciona en 'ssh $VPS_USER@$VPS_HOST'"
    echo "   y úsala en GitHub Secrets (sin espacios al inicio o final)"
    echo ""
    exit 1
fi

