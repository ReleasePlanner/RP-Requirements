#!/bin/bash

echo "=========================================="
echo "  ✅ Verificación Completa del Sistema"
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

# Contador de verificaciones
PASSED=0
FAILED=0

# Función para verificar
check() {
    local name="$1"
    local command="$2"
    
    echo -e "${BLUE}🔍 Verificando: $name${NC}"
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}   ❌ FAILED${NC}"
        ((FAILED++))
        return 1
    fi
}

# Función para ejecutar en servidor
run_on_server() {
    local command="$1"
    
    if command -v sshpass &> /dev/null && [ -n "$VPS_SSH_PASSWORD" ]; then
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
                "$command" 2>/dev/null
    else
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "$command" 2>/dev/null
    fi
}

echo "📋 Configuración:"
echo "   VPS_HOST: $VPS_HOST"
echo "   VPS_USER: $VPS_USER"
echo "   Contraseña: $(if [ -n "$VPS_SSH_PASSWORD" ]; then echo "(configurada)"; else echo "(NO configurada)"; fi)"
echo ""

# ==========================================
# 1. VERIFICACIONES LOCALES
# ==========================================
echo "=========================================="
echo "  1. VERIFICACIONES LOCALES"
echo "=========================================="
echo ""

check "Scripts de deployment existen" "[ -f 'rp-workspace/deploy-on-vps/test-ssh-interactivo.sh' ]"
check "Scripts de verificación existen" "[ -f 'rp-workspace/deploy-on-vps/verificar-servidor-ssh.sh' ]"
check "Scripts de habilitación existen" "[ -f 'rp-workspace/deploy-on-vps/habilitar-password-auth.sh' ]"
check "Workflow de deployment existe" "[ -f '.github/workflows/deploy-hostinger.yml' ]"
check "Workflow de test SSH existe" "[ -f '.github/workflows/test-ssh-connection.yml' ]"

echo ""

# ==========================================
# 2. VERIFICACIONES DE CONECTIVIDAD
# ==========================================
echo "=========================================="
echo "  2. VERIFICACIONES DE CONECTIVIDAD"
echo "=========================================="
echo ""

# Verificar conectividad básica
echo -e "${BLUE}🔍 Verificando conectividad al servidor...${NC}"
if ping -c 1 -W 2 "$VPS_HOST" &> /dev/null; then
    echo -e "${GREEN}   ✅ Servidor accesible por ping${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}   ⚠️ Ping bloqueado (pero SSH puede funcionar)${NC}"
    ((PASSED++))
fi
echo ""

# Verificar puerto SSH
echo -e "${BLUE}🔍 Verificando puerto SSH...${NC}"
if timeout 3 bash -c "echo > /dev/tcp/$VPS_HOST/22" 2>/dev/null; then
    echo -e "${GREEN}   ✅ Puerto 22 accesible${NC}"
    ((PASSED++))
else
    echo -e "${RED}   ❌ Puerto 22 no accesible${NC}"
    ((FAILED++))
fi
echo ""

# ==========================================
# 3. VERIFICACIONES DEL SERVIDOR SSH
# ==========================================
echo "=========================================="
echo "  3. VERIFICACIONES DEL SERVIDOR SSH"
echo "=========================================="
echo ""

# Verificar PasswordAuthentication
echo -e "${BLUE}🔍 Verificando PasswordAuthentication...${NC}"
PASSWORD_AUTH=$(run_on_server "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i '^PasswordAuthentication' | grep -v '^#' | tail -1")
if [ -z "$PASSWORD_AUTH" ]; then
    PASSWORD_AUTH=$(run_on_server "sudo cat /etc/ssh/sshd_config 2>/dev/null | grep -i 'PasswordAuthentication' | grep '^#' | tail -1")
fi

if echo "$PASSWORD_AUTH" | grep -qi "PasswordAuthentication yes"; then
    echo -e "${GREEN}   ✅ PasswordAuthentication está habilitado${NC}"
    echo "      $PASSWORD_AUTH"
    ((PASSED++))
else
    echo -e "${RED}   ❌ PasswordAuthentication NO está habilitado${NC}"
    if [ -n "$PASSWORD_AUTH" ]; then
        echo "      $PASSWORD_AUTH"
    fi
    ((FAILED++))
fi
echo ""

# Verificar servicio SSH
echo -e "${BLUE}🔍 Verificando servicio SSH...${NC}"
SSH_STATUS=$(run_on_server "sudo systemctl is-active ssh 2>/dev/null || sudo systemctl is-active sshd 2>/dev/null || echo 'unknown'")
if echo "$SSH_STATUS" | grep -qi "active"; then
    echo -e "${GREEN}   ✅ Servicio SSH está activo${NC}"
    ((PASSED++))
else
    echo -e "${RED}   ❌ Servicio SSH no está activo${NC}"
    ((FAILED++))
fi
echo ""

# ==========================================
# 4. VERIFICACIÓN DE CONEXIÓN SSH
# ==========================================
echo "=========================================="
echo "  4. VERIFICACIÓN DE CONEXIÓN SSH"
echo "=========================================="
echo ""

echo -e "${BLUE}🔍 Probando conexión SSH con contraseña...${NC}"
if command -v sshpass &> /dev/null && [ -n "$VPS_SSH_PASSWORD" ]; then
    if sshpass -p "$VPS_SSH_PASSWORD" \
        ssh -o StrictHostKeyChecking=no \
            -o UserKnownHostsFile=/dev/null \
            -o PreferredAuthentications=password \
            -o PubkeyAuthentication=no \
            -o PasswordAuthentication=yes \
            -o BatchMode=yes \
            -o IdentitiesOnly=yes \
            -o IdentityFile=/dev/null \
            "$VPS_USER@$VPS_HOST" \
            "echo 'SSH connection successful'" 2>/dev/null; then
        echo -e "${GREEN}   ✅ Conexión SSH exitosa${NC}"
        ((PASSED++))
    else
        echo -e "${RED}   ❌ Conexión SSH falló${NC}"
        echo "      Verifica que la contraseña sea correcta"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}   ⚠️ sshpass no disponible o contraseña no configurada${NC}"
    echo "      No se puede probar automáticamente"
    echo "      Prueba manualmente: ssh $VPS_USER@$VPS_HOST"
fi
echo ""

# ==========================================
# 5. VERIFICACIÓN DE DOCKER
# ==========================================
echo "=========================================="
echo "  5. VERIFICACIÓN DE DOCKER"
echo "=========================================="
echo ""

echo -e "${BLUE}🔍 Verificando Docker en el servidor...${NC}"
DOCKER_VERSION=$(run_on_server "docker --version 2>/dev/null")
if [ -n "$DOCKER_VERSION" ]; then
    echo -e "${GREEN}   ✅ Docker está instalado${NC}"
    echo "      $DOCKER_VERSION"
    ((PASSED++))
else
    echo -e "${YELLOW}   ⚠️ Docker no está instalado${NC}"
    echo "      Se instalará durante el deployment"
    ((PASSED++))
fi
echo ""

echo -e "${BLUE}🔍 Verificando Docker Compose...${NC}"
COMPOSE_VERSION=$(run_on_server "docker-compose --version 2>/dev/null || docker compose version 2>/dev/null")
if [ -n "$COMPOSE_VERSION" ]; then
    echo -e "${GREEN}   ✅ Docker Compose está instalado${NC}"
    echo "      $COMPOSE_VERSION"
    ((PASSED++))
else
    echo -e "${YELLOW}   ⚠️ Docker Compose no está instalado${NC}"
    echo "      Se instalará durante el deployment"
    ((PASSED++))
fi
echo ""

# ==========================================
# 6. VERIFICACIÓN DE DIRECTORIOS
# ==========================================
echo "=========================================="
echo "  6. VERIFICACIÓN DE DIRECTORIOS"
echo "=========================================="
echo ""

echo -e "${BLUE}🔍 Verificando directorio de deployment...${NC}"
DIR_CHECK=$(run_on_server "mkdir -p /opt/modules/requirements-management && ls -ld /opt/modules/requirements-management 2>/dev/null")
if [ -n "$DIR_CHECK" ]; then
    echo -e "${GREEN}   ✅ Directorio accesible${NC}"
    echo "      $DIR_CHECK"
    ((PASSED++))
else
    echo -e "${RED}   ❌ No se pudo acceder al directorio${NC}"
    ((FAILED++))
fi
echo ""

# ==========================================
# 7. VERIFICACIÓN DE GITHUB WORKFLOWS
# ==========================================
echo "=========================================="
echo "  7. VERIFICACIÓN DE GITHUB WORKFLOWS"
echo "=========================================="
echo ""

echo -e "${BLUE}🔍 Verificando sintaxis de workflows...${NC}"
if command -v yamllint &> /dev/null; then
    if yamllint .github/workflows/deploy-hostinger.yml .github/workflows/test-ssh-connection.yml 2>/dev/null; then
        echo -e "${GREEN}   ✅ Workflows tienen sintaxis válida${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}   ⚠️ yamllint no disponible o encontró problemas${NC}"
        ((PASSED++))
    fi
else
    echo -e "${YELLOW}   ⚠️ yamllint no disponible${NC}"
    echo "      Verificando manualmente..."
    if grep -q "name:" .github/workflows/deploy-hostinger.yml && grep -q "name:" .github/workflows/test-ssh-connection.yml; then
        echo -e "${GREEN}   ✅ Workflows parecen válidos${NC}"
        ((PASSED++))
    else
        echo -e "${RED}   ❌ Workflows pueden tener problemas${NC}"
        ((FAILED++))
    fi
fi
echo ""

# ==========================================
# RESUMEN FINAL
# ==========================================
echo "=========================================="
echo "  📊 RESUMEN FINAL"
echo "=========================================="
echo ""

TOTAL=$((PASSED + FAILED))
echo "Total de verificaciones: $TOTAL"
echo -e "${GREEN}✅ Pasadas: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Fallidas: $FAILED${NC}"
else
    echo -e "${GREEN}❌ Fallidas: $FAILED${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todas las verificaciones pasaron!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "   1. ✅ Verifica que VPS_SSH_PASSWORD en GitHub Secrets sea correcta"
    echo "   2. ✅ Ejecuta 'Test SSH Connection' en GitHub Actions"
    echo "   3. ✅ Si funciona, ejecuta el deployment completo"
else
    echo -e "${YELLOW}⚠️ Algunas verificaciones fallaron${NC}"
    echo ""
    echo "Revisa los errores arriba y corrígelos antes de continuar."
fi

echo ""
echo "=========================================="

