# Makefile for Docker Compose Management
# Usage: make <command>

.PHONY: help up down restart logs ps build clean migrate seed shell-api shell-portal shell-db build-api build-portal

# Default target
help:
	@echo "Requirements Management System - Docker Commands"
	@echo "================================================"
	@echo ""
	@echo "Available commands:"
	@echo "  make up          - Start all services"
	@echo "  make up-dev      - Start all services in development mode"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs (all services)"
	@echo "  make logs-api    - View API logs"
	@echo "  make logs-portal - View Portal logs"
	@echo "  make logs-db     - View Database logs"
	@echo "  make ps          - Show running services"
	@echo "  make build       - Build all images"
	@echo "  make build-api   - Build API image"
	@echo "  make build-portal - Build Portal image"
	@echo "  make clean       - Remove containers and volumes"
	@echo "  make migrate     - Run database migrations"
	@echo "  make seed        - Seed database"
	@echo "  make shell-api   - Open shell in API container"
	@echo "  make shell-portal - Open shell in Portal container"
	@echo "  make shell-db    - Open PostgreSQL shell"
	@echo "  make health      - Check health of all services"
	@echo ""

# Start services
up:
	docker-compose up -d
	@echo "✅ Services started"
	@echo "API: http://localhost:3000"
	@echo "Portal: http://localhost:4200"

up-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "✅ Services started in development mode"

# Stop services
down:
	docker-compose down
	@echo "✅ Services stopped"

# Restart services
restart:
	docker-compose restart
	@echo "✅ Services restarted"

# View logs
logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-portal:
	docker-compose logs -f portal

logs-db:
	docker-compose logs -f postgres

# Show running services
ps:
	docker-compose ps

# Build images
build:
	docker-compose build
	@echo "✅ Images built"

build-api:
	docker-compose build api
	@echo "✅ API image built"

build-portal:
	docker-compose build portal
	@echo "✅ Portal image built"

# Clean up
clean:
	docker-compose down -v
	@echo "✅ Containers and volumes removed"

# Database operations
migrate:
	docker-compose exec api npm run migration:run
	@echo "✅ Migrations completed"

seed:
	docker-compose exec api npm run seed:run
	@echo "✅ Database seeded"

# Shell access
shell-api:
	docker-compose exec api sh

shell-portal:
	docker-compose exec portal sh

shell-db:
	docker-compose exec postgres psql -U postgres -d requirements_db

# Health checks
health:
	@echo "Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "API Health:"
	@curl -s http://localhost:3000/api/v1/health/liveness || echo "❌ API not responding"
	@echo ""
	@echo "Portal Health:"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 || echo "❌ Portal not responding"
