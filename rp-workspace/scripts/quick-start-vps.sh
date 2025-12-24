#!/bin/bash

# Quick Start Script para Deployment en VPS Hostinger
# Requirements Management Module

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Requirements Management - Quick Start VPS Deployment${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Por favor ejecuta como root o con sudo${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}📦 Paso 1/7: Actualizando sistema...${NC}"
apt update && apt upgrade -y

# Step 2: Install Docker
echo -e "${YELLOW}🐳 Paso 2/7: Instalando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker instalado${NC}"
else
    echo -e "${GREEN}✅ Docker ya está instalado${NC}"
fi

# Step 3: Install Docker Compose
echo -e "${YELLOW}🐳 Paso 3/7: Instalando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose instalado${NC}"
else
    echo -e "${GREEN}✅ Docker Compose ya está instalado${NC}"
fi

# Step 4: Install Nginx
echo -e "${YELLOW}🌐 Paso 4/7: Instalando Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✅ Nginx instalado${NC}"
else
    echo -e "${GREEN}✅ Nginx ya está instalado${NC}"
fi

# Step 5: Install Certbot
echo -e "${YELLOW}🔒 Paso 5/7: Instalando Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✅ Certbot instalado${NC}"
else
    echo -e "${GREEN}✅ Certbot ya está instalado${NC}"
fi

# Step 6: Configure Firewall
echo -e "${YELLOW}🔥 Paso 6/7: Configurando firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✅ Firewall configurado${NC}"
else
    echo -e "${YELLOW}⚠️  UFW no encontrado, saltando configuración de firewall${NC}"
fi

# Step 7: Create directory structure
echo -e "${YELLOW}📁 Paso 7/7: Creando estructura de directorios...${NC}"
mkdir -p /opt/modules/requirements-management
mkdir -p /opt/backups
chmod 755 /opt/modules
echo -e "${GREEN}✅ Directorios creados${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Setup inicial completado!                         ${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo ""
echo "1. Clonar el repositorio:"
echo "   cd /opt/modules"
echo "   git clone <tu-repo-github> requirements-management"
echo ""
echo "2. Configurar variables de entorno:"
echo "   cd requirements-management"
echo "   cp env.docker.example .env"
echo "   nano .env"
echo ""
echo "3. Build y deploy:"
echo "   cp docker-compose.prod.yml docker-compose.yml"
echo "   docker-compose build"
echo "   docker-compose up -d"
echo ""
echo "4. Ver el plan completo en:"
echo "   docs/PLAN_DEPLOYMENT_REQUIREMENTS.md"
echo ""

