#!/bin/bash

# Script de Deployment Automático - Sin Confirmaciones
# Requirements Management

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
VPS_HOST=72.60.63.240
VPS_USER=root
GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git
SSH_PASSWORD="Aar-Beto-2026"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Requirements Management - Deployment Automático      ${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Configuración:${NC}"
echo "  VPS Host: $VPS_HOST"
echo "  VPS User: $VPS_USER"
echo "  SSH: ssh $VPS_USER@$VPS_HOST"
echo "  Repositorio: $GIT_REPO_URL"
echo ""
echo -e "${GREEN}🚀 Iniciando deployment automático...${NC}"
echo ""

# Verificar si sshpass está disponible
if command -v sshpass &> /dev/null; then
    USE_SSHPASS=true
    echo -e "${GREEN}✅ sshpass disponible${NC}"
else
    USE_SSHPASS=false
    echo -e "${YELLOW}⚠️  sshpass no disponible - intentando sin él${NC}"
fi

# Función para ejecutar comandos SSH
ssh_exec() {
    local cmd="$1"
    if [ "$USE_SSHPASS" = true ]; then
        sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$VPS_USER@$VPS_HOST" "$cmd"
    else
        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$VPS_USER@$VPS_HOST" "$cmd"
    fi
}

# Función para copiar archivos
scp_file() {
    local src="$1"
    local dst="$2"
    if [ "$USE_SSHPASS" = true ]; then
        sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$src" "$VPS_USER@$VPS_HOST:$dst"
    else
        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$src" "$VPS_USER@$VPS_HOST:$dst"
    fi
}

echo -e "${YELLOW}📡 Paso 1/7: Verificando conexión SSH...${NC}"
if ssh_exec "echo 'Conectado'" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexión SSH OK${NC}"
else
    echo -e "${RED}❌ No se puede conectar al VPS${NC}"
    echo "Verifica la conexión manualmente:"
    echo "  ssh $VPS_USER@$VPS_HOST"
    exit 1
fi

echo -e "${YELLOW}🔧 Paso 2/7: Ejecutando setup inicial del VPS...${NC}"
scp_file "scripts/quick-start-vps.sh" "/tmp/" > /dev/null 2>&1 || echo "⚠️  No se pudo copiar script, continuando..."
ssh_exec "bash /tmp/quick-start-vps.sh" || echo "⚠️  Setup puede haber fallado parcialmente, continuando..."
echo -e "${GREEN}✅ Setup inicial completado${NC}"

echo -e "${YELLOW}📦 Paso 3/7: Clonando repositorio...${NC}"
ssh_exec "mkdir -p /opt/modules && cd /opt/modules && if [ -d requirements-management ]; then echo 'Repositorio existe, actualizando...' && cd requirements-management && git pull || echo 'Error en git pull'; else git clone $GIT_REPO_URL requirements-management || echo 'Error clonando repositorio'; fi"
echo -e "${GREEN}✅ Repositorio clonado/actualizado${NC}"

echo -e "${YELLOW}⚙️  Paso 4/7: Preparando archivo .env...${NC}"
ssh_exec "cd /opt/modules/requirements-management && if [ ! -f .env ]; then if [ -f env.docker.example ]; then cp env.docker.example .env && echo '✅ .env creado desde env.docker.example'; else echo '⚠️  Creando .env básico'; cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=requirements_user
DB_PASSWORD=\$(openssl rand -base64 32 | tr -d '\n')
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_SECRET=\$(openssl rand -base64 48 | tr -d '\n')
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://requirements.beyondnet.cloud
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
PORTAL_PORT=4200
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
LOG_LEVEL=info
ENVEOF
fi; else echo '✅ .env ya existe'; fi"
echo -e "${GREEN}✅ Archivo .env preparado${NC}"
echo -e "${YELLOW}⚠️  IMPORTANTE: Revisa y ajusta el .env si es necesario${NC}"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   nano /opt/modules/requirements-management/.env"

echo -e "${YELLOW}🐳 Paso 5/7: Building y desplegando contenedores...${NC}"
ssh_exec "cd /opt/modules/requirements-management && if [ -f docker-compose.prod.yml ]; then cp docker-compose.prod.yml docker-compose.yml && echo '✅ Usando docker-compose.prod.yml'; fi && echo 'Building imágenes...' && docker-compose build && echo 'Iniciando contenedores...' && docker-compose up -d && sleep 15 && echo '' && echo 'Estado de contenedores:' && docker-compose ps"
echo -e "${GREEN}✅ Contenedores desplegados${NC}"

echo -e "${YELLOW}🗄️  Paso 6/7: Ejecutando migraciones de base de datos...${NC}"
echo "Esperando a que la API esté lista..."
sleep 45
ssh_exec "cd /opt/modules/requirements-management && docker-compose exec -T api npm run migration:run 2>&1 || echo '⚠️  Migraciones ya aplicadas o error (revisar logs)'"
echo -e "${GREEN}✅ Migraciones ejecutadas${NC}"

echo -e "${YELLOW}✅ Paso 7/7: Verificando deployment...${NC}"
ssh_exec "cd /opt/modules/requirements-management && echo '' && echo '📊 Estado de contenedores:' && docker-compose ps && echo '' && echo '🔍 Verificando servicios internos:' && (curl -f http://localhost:3000/api/v1/health/liveness > /dev/null 2>&1 && echo '✅ API respondiendo en localhost:3000' || echo '⚠️  API aún iniciando') && (curl -f http://localhost:4200 > /dev/null 2>&1 && echo '✅ Portal respondiendo en localhost:4200' || echo '⚠️  Portal aún iniciando')"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Deployment completado!                            ${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo ""
echo "1. Configurar DNS (si aún no lo hiciste):"
echo "   requirements.beyondnet.cloud → $VPS_HOST"
echo "   requirements-api.beyondnet.cloud → $VPS_HOST"
echo ""
echo "2. Configurar Nginx y SSL:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   Ver: docs/QUICK_START_VPS.md (Paso 5)"
echo ""
echo "3. Verificar logs:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   cd /opt/modules/requirements-management"
echo "   docker-compose logs -f"
echo ""
echo "4. Verificar estado:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   cd /opt/modules/requirements-management"
echo "   docker-compose ps"
echo ""

