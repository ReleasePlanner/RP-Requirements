#!/bin/bash

# Script para ejecutar DIRECTAMENTE en el VPS
# Copia este script al VPS y ejecútalo allí

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Requirements Management - Deployment en VPS         ${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

MODULE_NAME="requirements-management"
MODULE_PATH="/opt/modules/$MODULE_NAME"
GIT_REPO_URL="https://github.com/ReleasePlanner/RP-Requirements.git"

# Verificar que estamos como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Por favor ejecuta como root${NC}"
    exit 1
fi

# Paso 1: Setup inicial
echo -e "${YELLOW}🔧 Paso 1/6: Verificando setup inicial...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

if ! command -v nginx &> /dev/null; then
    echo "Instalando Nginx..."
    apt update && apt install nginx certbot python3-certbot-nginx -y
fi

echo -e "${GREEN}✅ Setup verificado${NC}"

# Paso 2: Crear directorios
echo -e "${YELLOW}📁 Paso 2/6: Creando estructura de directorios...${NC}"
mkdir -p /opt/modules
mkdir -p /opt/backups
chmod 755 /opt/modules
echo -e "${GREEN}✅ Directorios creados${NC}"

# Paso 3: Clonar repositorio
echo -e "${YELLOW}📦 Paso 3/6: Clonando repositorio...${NC}"
cd /opt/modules
if [ -d "$MODULE_NAME" ]; then
    echo "Repositorio ya existe, actualizando..."
    cd $MODULE_NAME
    git pull || echo "⚠️  Error en git pull, continuando..."
else
    git clone $GIT_REPO_URL $MODULE_NAME
    cd $MODULE_NAME
fi
echo -e "${GREEN}✅ Repositorio listo${NC}"

# Paso 4: Configurar .env
echo -e "${YELLOW}⚙️  Paso 4/6: Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
    if [ -f env.docker.example ]; then
        cp env.docker.example .env
        echo "✅ .env creado desde env.docker.example"
    else
        echo "Creando .env básico..."
        cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=requirements_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_SECRET=CHANGE_ME_MIN_32_CHARACTERS_SECRET
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://requirements.beyondnet.cloud
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
PORTAL_PORT=4200
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
LOG_LEVEL=info
EOF
    fi
fi

# Generar passwords automáticamente si están en placeholder
if grep -q "CHANGE_ME_STRONG_PASSWORD" .env; then
    echo "Generando password para base de datos..."
    DB_PASS=$(openssl rand -base64 32 | tr -d '\n')
    sed -i "s/DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD/DB_PASSWORD=$DB_PASS/" .env
    echo "✅ DB_PASSWORD generado automáticamente"
fi

if grep -q "CHANGE_ME_MIN_32_CHARACTERS_SECRET" .env; then
    echo "Generando JWT secret..."
    JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
    sed -i "s/JWT_SECRET=CHANGE_ME_MIN_32_CHARACTERS_SECRET/JWT_SECRET=$JWT_SECRET/" .env
    echo "✅ JWT_SECRET generado automáticamente"
fi

echo ""
echo -e "${YELLOW}⚠️  Revisa el archivo .env si necesitas ajustar valores:${NC}"
echo "   nano .env"
echo ""
read -p "¿Continuar con build y deploy? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelado. Edita .env y ejecuta este script nuevamente."
    exit 1
fi

# Paso 5: Build y Deploy
echo -e "${YELLOW}🐳 Paso 5/6: Building y desplegando contenedores...${NC}"
if [ -f docker-compose.prod.yml ]; then
    cp docker-compose.prod.yml docker-compose.yml
    echo "✅ Usando docker-compose.prod.yml"
fi

echo "Building imágenes (esto puede tardar varios minutos)..."
docker-compose build

echo "Iniciando contenedores..."
docker-compose up -d

echo "Esperando a que contenedores inicien..."
sleep 20

echo ""
echo "Estado de contenedores:"
docker-compose ps

echo -e "${GREEN}✅ Contenedores desplegados${NC}"

# Paso 6: Migraciones
echo -e "${YELLOW}🗄️  Paso 6/6: Ejecutando migraciones de base de datos...${NC}"
echo "Esperando a que la API esté lista..."
sleep 30

docker-compose exec -T api npm run migration:run 2>&1 || echo "⚠️  Migraciones ya aplicadas o error (revisar logs)"

echo -e "${GREEN}✅ Migraciones ejecutadas${NC}"

# Verificación final
echo ""
echo -e "${YELLOW}✅ Verificando deployment...${NC}"
echo ""
echo "📊 Estado de contenedores:"
docker-compose ps

echo ""
echo "🔍 Verificando servicios:"
if curl -f http://localhost:3000/api/v1/health/liveness > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API respondiendo en localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  API aún iniciando (revisar logs)${NC}"
fi

if curl -f http://localhost:4200 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Portal respondiendo en localhost:4200${NC}"
else
    echo -e "${YELLOW}⚠️  Portal aún iniciando (revisar logs)${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Deployment completado!                            ${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo ""
echo "1. Ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "2. Configurar DNS:"
echo "   requirements.beyondnet.cloud → $(hostname -I | awk '{print $1}')"
echo "   requirements-api.beyondnet.cloud → $(hostname -I | awk '{print $1}')"
echo ""
echo "3. Configurar Nginx y SSL:"
echo "   Ver: docs/QUICK_START_VPS.md (Paso 5)"
echo ""
echo "4. Verificar acceso:"
echo "   https://requirements.beyondnet.cloud"
echo "   https://requirements-api.beyondnet.cloud/api/v1/health/liveness"
echo ""

