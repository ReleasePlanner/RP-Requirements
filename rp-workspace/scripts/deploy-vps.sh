#!/bin/bash

# VPS Deployment Script for Multi-Module Setup
# This script deploys a single module to the VPS

set -e

MODULE_NAME="${MODULE_NAME:-requirements-management}"
VPS_HOST="${VPS_HOST}"
VPS_USER="${VPS_USER:-root}"
VPS_SSH_KEY="${VPS_SSH_KEY:-~/.ssh/id_rsa}"
MODULE_PORTAL_PORT="${MODULE_PORTAL_PORT:-4200}"
MODULE_API_PORT="${MODULE_API_PORT:-3000}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 VPS Deployment Script${NC}"
echo "================================"
echo "Module: $MODULE_NAME"
echo "VPS Host: $VPS_HOST"
echo ""

# Check if required variables are set
if [ -z "$VPS_HOST" ]; then
    echo -e "${RED}❌ Error: VPS_HOST environment variable is required${NC}"
    echo "Usage: VPS_HOST=your-vps-ip ./scripts/deploy-vps.sh"
    exit 1
fi

# Check SSH connection
echo -e "${YELLOW}📡 Checking SSH connection...${NC}"
if ! ssh -i "$VPS_SSH_KEY" -o ConnectTimeout=5 "$VPS_USER@$VPS_HOST" "echo 'Connected'" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Cannot connect to VPS${NC}"
    exit 1
fi
echo -e "${GREEN}✅ SSH connection OK${NC}"

# Create module directory on VPS
echo -e "${YELLOW}📁 Setting up module directory...${NC}"
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    mkdir -p /opt/modules/$MODULE_NAME
    mkdir -p /opt/scripts
EOF

# Copy files to VPS
echo -e "${YELLOW}📦 Copying files to VPS...${NC}"
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude '.next' \
    -e "ssh -i $VPS_SSH_KEY" \
    ./ "$VPS_USER@$VPS_HOST:/opt/modules/$MODULE_NAME/"

# Update docker-compose.yml for production
echo -e "${YELLOW}⚙️  Configuring docker-compose.yml for production...${NC}"
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    cd /opt/modules/$MODULE_NAME
    
    # Update ports in docker-compose.yml if needed
    # Portal should use MODULE_PORTAL_PORT
    # API should use MODULE_API_PORT
    
    # Ensure .env file exists
    if [ ! -f .env ]; then
        if [ -f env.docker.example ]; then
            cp env.docker.example .env
            echo "⚠️  Please edit .env file with your production values"
        fi
    fi
EOF

# Build and start containers
echo -e "${YELLOW}🐳 Building and starting containers...${NC}"
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" << EOF
    cd /opt/modules/$MODULE_NAME
    
    # Pull latest images
    docker-compose pull || true
    
    # Build images
    docker-compose build
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    sleep 10
    
    # Check status
    docker-compose ps
    
    # Run migrations
    docker-compose exec -T api npm run migration:run || echo "Migrations skipped or already applied"
EOF

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure Nginx reverse proxy"
echo "2. Set up SSL certificates"
echo "3. Verify services are running"
echo ""
echo "To check logs:"
echo "  ssh $VPS_USER@$VPS_HOST 'cd /opt/modules/$MODULE_NAME && docker-compose logs -f'"

