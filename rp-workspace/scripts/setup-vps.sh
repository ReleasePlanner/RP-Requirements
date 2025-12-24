#!/bin/bash

# VPS Initial Setup Script
# Run this script once on a fresh VPS to set up the environment

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 VPS Initial Setup${NC}"
echo "======================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or with sudo${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Install Nginx
echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi

# Install Certbot
echo -e "${YELLOW}🔒 Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✅ Certbot installed${NC}"
else
    echo -e "${GREEN}✅ Certbot already installed${NC}"
fi

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
mkdir -p /opt/modules
mkdir -p /opt/service-bus
mkdir -p /opt/scripts
mkdir -p /opt/backups
echo -e "${GREEN}✅ Directories created${NC}"

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠️  UFW not found, skipping firewall setup${NC}"
fi

# Create management scripts
echo -e "${YELLOW}📝 Creating management scripts...${NC}"

# Module management script
cat > /opt/scripts/manage-modules.sh << 'SCRIPT'
#!/bin/bash

MODULES_DIR="/opt/modules"
MODULE_NAME=$1
ACTION=$2

if [ -z "$MODULE_NAME" ] || [ -z "$ACTION" ]; then
    echo "Usage: $0 <module-name> <action>"
    echo "Actions: start, stop, restart, logs, status, update"
    exit 1
fi

MODULE_PATH="$MODULES_DIR/$MODULE_NAME"

if [ ! -d "$MODULE_PATH" ]; then
    echo "Module $MODULE_NAME not found in $MODULES_DIR"
    exit 1
fi

cd "$MODULE_PATH"

case $ACTION in
    start)
        docker-compose up -d
        ;;
    stop)
        docker-compose down
        ;;
    restart)
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f
        ;;
    status)
        docker-compose ps
        ;;
    update)
        git pull
        docker-compose build
        docker-compose up -d
        ;;
    *)
        echo "Unknown action: $ACTION"
        exit 1
        ;;
esac
SCRIPT

chmod +x /opt/scripts/manage-modules.sh

# Status script
cat > /opt/scripts/status-all.sh << 'SCRIPT'
#!/bin/bash

for module in /opt/modules/*/; do
    if [ -d "$module" ]; then
        module_name=$(basename $module)
        echo "=== $module_name ==="
        cd $module
        docker-compose ps 2>/dev/null || echo "Not running"
        echo ""
    fi
done
SCRIPT

chmod +x /opt/scripts/status-all.sh

# Backup script
cat > /opt/scripts/backup-databases.sh << 'SCRIPT'
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

for module in /opt/modules/*/; do
    if [ -d "$module" ]; then
        module_name=$(basename $module)
        cd $module
        
        # Check if postgres service exists
        if docker-compose ps postgres 2>/dev/null | grep -q "Up"; then
            echo "Backing up $module_name database..."
            docker-compose exec -T postgres pg_dump -U postgres requirements_db > "$BACKUP_DIR/${module_name}_${DATE}.sql" 2>/dev/null || true
        fi
    fi
done

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete 2>/dev/null || true

echo "Backup completed: $BACKUP_DIR"
SCRIPT

chmod +x /opt/scripts/backup-databases.sh

echo -e "${GREEN}✅ Management scripts created${NC}"

# Setup Service Bus (RabbitMQ)
echo -e "${YELLOW}🚌 Setting up Service Bus...${NC}"
cd /opt/service-bus

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: service-bus-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-change-me-in-production}
    ports:
      - "15672:15672"  # Management UI
      - "5672:5672"    # AMQP port
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - service-bus-network

networks:
  service-bus-network:
    driver: bridge
    name: service-bus-network

volumes:
  rabbitmq_data:
    driver: local
EOF

docker-compose up -d
echo -e "${GREEN}✅ Service Bus (RabbitMQ) started${NC}"

echo ""
echo -e "${GREEN}✅ VPS setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy your first module using: ./scripts/deploy-vps.sh"
echo "2. Configure Nginx for your domains"
echo "3. Set up SSL certificates with: certbot --nginx"
echo ""
echo "Useful commands:"
echo "  /opt/scripts/manage-modules.sh <module-name> <action>"
echo "  /opt/scripts/status-all.sh"
echo "  /opt/scripts/backup-databases.sh"

