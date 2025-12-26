# 🚀 Multi-Module Deployment Guide

This guide explains how to deploy multiple independent modules (each with Portal + API) on a single VPS server.

## 🏗️ Architecture Overview

```
VPS Hostinger (Single Physical Server)
│
├── Nginx (Reverse Proxy)
│   ├── requirements.beyondnet.cloud → Requirements Portal
│   ├── requirements-api.beyondnet.cloud → Requirements API
│   ├── release-planner.beyondnet.cloud → Release Planner Portal
│   ├── release-planner-api.beyondnet.cloud → Release Planner API
│   └── ... (more modules)
│
├── Service Bus (RabbitMQ/Redis)
│   └── Message Queue for inter-module communication
│
└── Docker Containers
    ├── Module: Requirements Management
    │   ├── requirements-portal (Next.js)
    │   ├── requirements-api (NestJS)
    │   └── requirements-db (PostgreSQL)
    │
    ├── Module: Release Planner
    │   ├── release-planner-portal (Next.js)
    │   ├── release-planner-api (NestJS)
    │   └── release-planner-db (PostgreSQL)
    │
    └── ... (more modules)
```

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ or Debian 11+
- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- Domain name configured with DNS pointing to VPS IP
- SSH access to VPS
- Root or sudo access

## 🔧 VPS Setup

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

### 2. Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. Install Certbot (for SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 📁 Directory Structure on VPS

```
/opt/
├── modules/
│   ├── requirements-management/
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   └── nginx.conf (module-specific)
│   │
│   ├── release-planner/
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   └── nginx.conf
│   │
│   └── ... (more modules)
│
├── service-bus/
│   ├── docker-compose.yml (RabbitMQ/Redis)
│   └── .env
│
└── nginx/
    ├── nginx.conf (main reverse proxy)
    └── sites-available/
        ├── requirements-management.conf
        ├── release-planner.conf
        └── ... (more modules)
```

## 🔄 Deployment Process

### Step 1: Clone Repository

```bash
# Create modules directory
sudo mkdir -p /opt/modules
cd /opt/modules

# Clone Requirements Management repository
git clone <your-github-repo-url> requirements-management
cd requirements-management
```

### Step 2: Configure Environment Variables

```bash
# Copy example env file
cp env.docker.example .env

# Edit with your values
nano .env
```

**Important Environment Variables:**

```env
# API Configuration
NODE_ENV=production
PORT=3000

# Database
DB_HOST=requirements-db
DB_PORT=5432
DB_USERNAME=requirements_user
DB_PASSWORD=<strong-password>
DB_DATABASE=requirements_db

# JWT
JWT_SECRET=<strong-secret-min-32-chars>

# CORS (allow your domain)
CORS_ORIGIN=https://requirements.beyondnet.cloud

# Portal
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1

# Service Bus (for inter-module communication)
SERVICE_BUS_URL=amqp://guest:guest@service-bus:5672
# or for Redis:
# SERVICE_BUS_URL=redis://service-bus:6379
```

### Step 3: Update docker-compose.yml for Production

Each module's `docker-compose.yml` should be configured for production:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: requirements-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - requirements_postgres_data:/var/lib/postgresql/data
    networks:
      - requirements-network
    # Remove port mapping for internal only
    # ports:
    #   - "5432:5432"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: requirements-api
    restart: unless-stopped
    depends_on:
      - postgres
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_DATABASE}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      SERVICE_BUS_URL: ${SERVICE_BUS_URL}
    networks:
      - requirements-network
      - service-bus-network  # For inter-module communication
    # Remove port mapping, use Nginx instead
    # ports:
    #   - "3000:3000"

  portal:
    build:
      context: .
      dockerfile: apps/portal/Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    container_name: requirements-portal
    restart: unless-stopped
    depends_on:
      - api
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    networks:
      - requirements-network
    # Remove port mapping, use Nginx instead
    # ports:
    #   - "4200:4200"

networks:
  requirements-network:
    driver: bridge
  service-bus-network:
    external: true  # Shared network for all modules

volumes:
  requirements_postgres_data:
    driver: local
```

### Step 4: Build and Start Module

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Step 5: Configure Nginx Reverse Proxy

Create Nginx configuration for each module:

**`/etc/nginx/sites-available/requirements-management.conf`:**

```nginx
# Requirements Management Portal
server {
    listen 80;
    server_name requirements.beyondnet.cloud;

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Requirements Management API
server {
    listen 80;
    server_name requirements-api.beyondnet.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/requirements-management.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
# Get SSL certificate
sudo certbot --nginx -d requirements.beyondnet.cloud -d requirements-api.beyondnet.cloud

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

## 🔌 Service Bus Setup

For inter-module communication, set up RabbitMQ or Redis:

**`/opt/service-bus/docker-compose.yml`:**

```yaml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: service-bus-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-change-me}
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

volumes:
  rabbitmq_data:
    driver: local
```

Start Service Bus:

```bash
cd /opt/service-bus
docker-compose up -d
```

## 📝 Module Management Scripts

Create a master script to manage all modules:

**`/opt/scripts/manage-modules.sh`:**

```bash
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
```

Make it executable:

```bash
sudo mkdir -p /opt/scripts
sudo chmod +x /opt/scripts/manage-modules.sh
```

Usage:

```bash
# Start a module
/opt/scripts/manage-modules.sh requirements-management start

# Update a module
/opt/scripts/manage-modules.sh requirements-management update

# View logs
/opt/scripts/manage-modules.sh requirements-management logs
```

## 🔄 CI/CD Integration

Update GitHub Actions workflows to deploy to VPS:

**`.github/workflows/deploy-vps.yml`:**

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/modules/requirements-management
            git pull origin main
            docker-compose build
            docker-compose up -d
            docker-compose exec api npm run migration:run || true
```

## 🔍 Monitoring

### Check All Modules Status

```bash
#!/bin/bash
# /opt/scripts/status-all.sh

for module in /opt/modules/*/; do
    module_name=$(basename $module)
    echo "=== $module_name ==="
    cd $module
    docker-compose ps
    echo ""
done
```

### View All Logs

```bash
#!/bin/bash
# /opt/scripts/logs-all.sh

for module in /opt/modules/*/; do
    module_name=$(basename $module)
    echo "=== Logs for $module_name ==="
    cd $module
    docker-compose logs --tail=50
    echo ""
done
```

## 🛡️ Security Best Practices

1. **Firewall Configuration:**

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Database Security:**
   - Use strong passwords
   - Don't expose database ports externally
   - Use Docker networks for internal communication

3. **API Security:**
   - Use HTTPS only
   - Configure CORS properly
   - Use strong JWT secrets
   - Enable rate limiting

4. **Regular Updates:**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
for module in /opt/modules/*/; do
    cd $module
    docker-compose pull
    docker-compose up -d
done
```

## 📊 Backup Strategy

### Database Backups

```bash
#!/bin/bash
# /opt/scripts/backup-databases.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

for module in /opt/modules/*/; do
    module_name=$(basename $module)
    cd $module
    
    # Backup PostgreSQL
    docker-compose exec -T postgres pg_dump -U postgres requirements_db > "$BACKUP_DIR/${module_name}_${DATE}.sql"
done

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

Schedule with cron:

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup-databases.sh
```

## 🚨 Troubleshooting

### Module won't start
```bash
cd /opt/modules/<module-name>
docker-compose logs
docker-compose ps
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Port conflicts
```bash
# Check what's using a port
sudo netstat -tulpn | grep :3000
```

### Service Bus connection issues
```bash
cd /opt/service-bus
docker-compose logs rabbitmq
docker-compose ps
```

## 📚 Next Steps

1. Set up monitoring (Prometheus, Grafana)
2. Configure log aggregation (ELK Stack)
3. Set up automated backups
4. Configure health checks
5. Set up alerting

---

**For module-specific deployment, see each module's README.md**

