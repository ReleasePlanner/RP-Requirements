#!/bin/bash

# Script Maestro de Deployment - Requirements Management
# Ejecutar desde tu máquina local

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Requirements Management - Deployment Automático      ${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar variables requeridas
if [ -z "$VPS_HOST" ] || [ -z "$VPS_USER" ] || [ -z "$GIT_REPO_URL" ]; then
    echo -e "${RED}❌ Variables requeridas no configuradas${NC}"
    echo ""
    echo "Configura las siguientes variables de entorno:"
    echo "  export VPS_HOST=tu-vps-ip"
    echo "  export VPS_USER=root"
    echo "  export GIT_REPO_URL=https://github.com/tu-usuario/tu-repo.git"
    echo ""
    echo "O ejecuta:"
    echo "  VPS_HOST=tu-ip VPS_USER=root GIT_REPO_URL=tu-repo ./scripts/deploy-requirements-vps.sh"
    exit 1
fi

VPS_SSH_KEY="${VPS_SSH_KEY:-~/.ssh/id_rsa}"
MODULE_NAME="requirements-management"
MODULE_PATH="/opt/modules/$MODULE_NAME"

echo -e "${YELLOW}📋 Configuración:${NC}"
echo "  VPS Host: $VPS_HOST"
echo "  VPS User: $VPS_USER"
echo "  Git Repo: $GIT_REPO_URL"
echo "  SSH Key: $VPS_SSH_KEY"
echo ""

read -p "¿Continuar con el deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelado."
    exit 1
fi

# Paso 1: Verificar conexión SSH
echo -e "${YELLOW}📡 Paso 1/7: Verificando conexión SSH...${NC}"
if ! ssh -i "$VPS_SSH_KEY" -o ConnectTimeout=5 "$VPS_USER@$VPS_HOST" "echo 'Conectado'" > /dev/null 2>&1; then
    echo -e "${RED}❌ No se puede conectar al VPS${NC}"
    echo "Verifica:"
    echo "  - IP del VPS: $VPS_HOST"
    echo "  - Usuario SSH: $VPS_USER"
    echo "  - Clave SSH: $VPS_SSH_KEY"
    exit 1
fi
echo -e "${GREEN}✅ Conexión SSH OK${NC}"

# Paso 2: Setup inicial del VPS
echo -e "${YELLOW}🔧 Paso 2/7: Ejecutando setup inicial del VPS...${NC}"
scp -i "$VPS_SSH_KEY" scripts/quick-start-vps.sh "$VPS_USER@$VPS_HOST:/tmp/" > /dev/null
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" "bash /tmp/quick-start-vps.sh"
echo -e "${GREEN}✅ Setup inicial completado${NC}"

# Paso 3: Clonar repositorio
echo -e "${YELLOW}📦 Paso 3/7: Clonando repositorio...${NC}"
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    mkdir -p /opt/modules
    cd /opt/modules
    if [ -d "$MODULE_NAME" ]; then
        echo "Repositorio ya existe, actualizando..."
        cd $MODULE_NAME
        git pull
    else
        git clone $GIT_REPO_URL $MODULE_NAME
    fi
EOF
echo -e "${GREEN}✅ Repositorio clonado${NC}"

# Paso 4: Configurar variables de entorno
echo -e "${YELLOW}⚙️  Paso 4/7: Configurando variables de entorno...${NC}"
echo -e "${YELLOW}⚠️  Necesitas configurar manualmente el archivo .env${NC}"
echo ""
echo "Conectando al VPS para configurar .env..."
echo ""

ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << 'ENVEOF'
    cd /opt/modules/requirements-management
    
    if [ ! -f .env ]; then
        if [ -f env.docker.example ]; then
            cp env.docker.example .env
            echo "✅ Archivo .env creado desde env.docker.example"
        else
            echo "⚠️  env.docker.example no encontrado, creando .env básico"
            cat > .env << 'EOF'
# Server
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=requirements_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT
JWT_SECRET=CHANGE_ME_MIN_32_CHARACTERS_SECRET
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=https://requirements.beyondnet.cloud

# Portal
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
PORTAL_PORT=4200

# Monitoring
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
LOG_LEVEL=info
EOF
        fi
    fi
    
    echo ""
    echo "📝 Archivo .env preparado. Debes editarlo con:"
    echo "   nano /opt/modules/requirements-management/.env"
    echo ""
    echo "Valores importantes a cambiar:"
    echo "  - DB_PASSWORD: Genera con 'openssl rand -base64 32'"
    echo "  - JWT_SECRET: Genera con 'openssl rand -base64 48'"
    echo ""
ENVEOF

read -p "¿Has configurado el archivo .env? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Por favor configura el .env antes de continuar:"
    echo "  ssh $VPS_USER@$VPS_HOST"
    echo "  nano /opt/modules/requirements-management/.env"
    exit 1
fi

# Paso 5: Build y Deploy
echo -e "${YELLOW}🐳 Paso 5/7: Building y desplegando contenedores...${NC}"
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    cd $MODULE_PATH
    
    # Usar docker-compose.prod.yml si existe, sino usar docker-compose.yml
    if [ -f docker-compose.prod.yml ]; then
        cp docker-compose.prod.yml docker-compose.yml
        echo "✅ Usando docker-compose.prod.yml"
    fi
    
    # Build
    echo "Building imágenes..."
    docker-compose build
    
    # Deploy
    echo "Iniciando contenedores..."
    docker-compose up -d
    
    # Esperar un momento
    sleep 10
    
    # Verificar estado
    echo ""
    echo "Estado de contenedores:"
    docker-compose ps
EOF
echo -e "${GREEN}✅ Contenedores desplegados${NC}"

# Paso 6: Ejecutar migraciones
echo -e "${YELLOW}🗄️  Paso 6/7: Ejecutando migraciones de base de datos...${NC}"
echo "Esperando a que la API esté lista..."
sleep 30

ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    cd $MODULE_PATH
    docker-compose exec -T api npm run migration:run || echo "⚠️  Migraciones ya aplicadas o error (revisar logs)"
EOF
echo -e "${GREEN}✅ Migraciones ejecutadas${NC}"

# Paso 7: Verificación
echo -e "${YELLOW}✅ Paso 7/7: Verificando deployment...${NC}"
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    cd $MODULE_PATH
    
    echo ""
    echo "📊 Estado de contenedores:"
    docker-compose ps
    
    echo ""
    echo "🔍 Verificando servicios internos:"
    
    # Verificar API
    if curl -f http://localhost:3000/api/v1/health/liveness > /dev/null 2>&1; then
        echo "✅ API respondiendo en localhost:3000"
    else
        echo "⚠️  API no responde aún (puede estar iniciando)"
    fi
    
    # Verificar Portal
    if curl -f http://localhost:4200 > /dev/null 2>&1; then
        echo "✅ Portal respondiendo en localhost:4200"
    else
        echo "⚠️  Portal no responde aún (puede estar iniciando)"
    fi
    
    echo ""
    echo "📝 Para ver logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "📝 Para verificar estado:"
    echo "   docker-compose ps"
EOF

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Deployment completado!                            ${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo ""
echo "1. Configurar DNS (si aún no lo has hecho):"
echo "   requirements.beyondnet.cloud → $VPS_HOST"
echo "   requirements-api.beyondnet.cloud → $VPS_HOST"
echo ""
echo "2. Configurar Nginx y SSL:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   Ver: docs/QUICK_START_VPS.md (Paso 5)"
echo ""
echo "3. Verificar deployment:"
echo "   ssh $VPS_USER@$VPS_HOST"
echo "   cd /opt/modules/requirements-management"
echo "   docker-compose logs -f"
echo ""
echo "4. Una vez configurado Nginx y DNS:"
echo "   https://requirements.beyondnet.cloud"
echo "   https://requirements-api.beyondnet.cloud/api/v1/health/liveness"
echo ""

