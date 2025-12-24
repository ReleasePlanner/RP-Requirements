#!/bin/bash

# Docker Setup Script
# Helps set up the Docker environment for the Requirements Management System

set -e

echo "🚀 Requirements Management System - Docker Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before continuing${NC}"
    echo ""
    read -p "Press Enter to continue after editing .env, or Ctrl+C to cancel..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ docker-compose is available${NC}"
echo ""

# Function to check if services are running
check_services() {
    if docker-compose ps | grep -q "Up"; then
        return 0
    else
        return 1
    fi
}

# Menu
echo "What would you like to do?"
echo "1) Start all services (production mode)"
echo "2) Start all services (development mode)"
echo "3) Stop all services"
echo "4) Restart all services"
echo "5) View logs"
echo "6) Run database migrations"
echo "7) Seed database"
echo "8) Clean up (remove containers, volumes)"
echo "9) Exit"
echo ""
read -p "Enter your choice [1-9]: " choice

case $choice in
    1)
        echo ""
        echo "Starting services in production mode..."
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started${NC}"
        echo ""
        echo "Services are starting up. You can check the status with:"
        echo "  docker-compose ps"
        echo ""
        echo "View logs with:"
        echo "  docker-compose logs -f"
        echo ""
        echo "API will be available at: http://localhost:3000"
        echo "Portal will be available at: http://localhost:4200"
        ;;
    2)
        echo ""
        echo "Starting services in development mode..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        echo ""
        echo -e "${GREEN}✅ Services started in development mode${NC}"
        ;;
    3)
        echo ""
        echo "Stopping all services..."
        docker-compose down
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
    4)
        echo ""
        echo "Restarting all services..."
        docker-compose restart
        echo -e "${GREEN}✅ Services restarted${NC}"
        ;;
    5)
        echo ""
        echo "Viewing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "Running database migrations..."
        docker-compose exec api npm run migration:run
        echo -e "${GREEN}✅ Migrations completed${NC}"
        ;;
    7)
        echo ""
        echo "Seeding database..."
        docker-compose exec api npm run seed:run
        echo -e "${GREEN}✅ Database seeded${NC}"
        ;;
    8)
        echo ""
        echo -e "${YELLOW}⚠️  This will remove all containers and volumes${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            docker-compose down -v
            echo -e "${GREEN}✅ Cleanup completed${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
    9)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

