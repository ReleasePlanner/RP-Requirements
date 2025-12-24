# 📋 Requirements Management System

Complete requirements management system built with **NestJS** (API) and **Next.js** (Portal), following Clean Architecture principles, SOLID, and OWASP security best practices.

[![CI](https://github.com/USER/REPO/workflows/CI/badge.svg)](https://github.com/USER/REPO/actions)
[![CD Production](https://github.com/USER/REPO/workflows/CD%20-%20Production/badge.svg)](https://github.com/USER/REPO/actions)
[![Deploy](https://github.com/USER/REPO/workflows/Deploy%20-%20Full%20Stack/badge.svg)](https://github.com/USER/REPO/actions)

## 🎯 Key Features

### 📊 Requirements Management

- ✅ Complete requirements management with Belcorp prioritization matrix
- ✅ Association with Portfolios, Initiatives, Epics
- ✅ Effort tracking, business value, and metrics
- ✅ Functional discovery and experimentation control
- ✅ External references (Jira, Azure DevOps)
- ✅ Team dependencies

### 🏗️ Architecture

- ✅ **Clean Architecture** with layer separation
- ✅ **SOLID Principles** applied
- ✅ **Domain-Driven Design (DDD)**
- ✅ **TypeORM** for persistence
- ✅ **PostgreSQL** as database

### 🔒 Security

- ✅ JWT Authentication
- ✅ Rate Limiting (OWASP)
- ✅ Input validation
- ✅ Sensitive data sanitization
- ✅ CORS configured
- ✅ Helmet for security headers

### 📊 Monitoring

- ✅ Real-time metrics
- ✅ Structured logging with Winston
- ✅ Detailed health checks
- ✅ Monitoring dashboard in Portal
- ✅ Performance and error metrics

### 🚀 CI/CD

- ✅ GitHub Actions for complete CI/CD
- ✅ Automated tests with 100% coverage
- ✅ Automated deployment with Docker Compose
- ✅ Pre-deployment integrity checks
- ✅ Automated releases

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Portal (Next.js)                     │
│              Port: 4200                                 │
│  - Dashboard                                            │
│  - Requirements Management                              │
│  - Monitoring                                           │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────────┐
│              API (NestJS)                               │
│              Port: 3000                                 │
│  ┌──────────────────────────────────────────────┐     │
│  │  Presentation Layer (Controllers)             │     │
│  │  - Auth, Requirements, Portfolios, etc.      │     │
│  └──────────────────┬───────────────────────────┘     │
│  ┌──────────────────▼───────────────────────────┐     │
│  │  Application Layer (Services)                 │     │
│  │  - Business Logic                             │     │
│  └──────────────────┬───────────────────────────┘     │
│  ┌──────────────────▼───────────────────────────┐     │
│  │  Domain Layer (Entities)                      │     │
│  │  - Requirement, Portfolio, Epic, etc.          │     │
│  └──────────────────┬───────────────────────────┘     │
│  ┌──────────────────▼───────────────────────────┐     │
│  │  Infrastructure Layer                         │     │
│  │  - Repositories, Database, External APIs     │     │
│  └──────────────────┬───────────────────────────┘     │
└──────────────────────┼──────────────────────────────────┘
                      │ TypeORM
┌──────────────────────▼──────────────────────────────────┐
│         PostgreSQL Database                             │
│         Port: 5432                                      │
│  - 18 Main entities                                     │
│  - Automatic migrations                                │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 15.x or higher
- **Docker** 20.10+ (optional, for deployment)
- **Docker Compose** 2.0+ (optional, for deployment)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd rp-workspace

# 2. Configure environment variables
cp env.docker.example .env
# Edit .env with your values

# 3. Start all services
make up
# or
docker-compose up -d

# 4. Verify everything is working
make health
```

**Available Services:**

- 🌐 Portal: http://localhost:4200
- 🔌 API: http://localhost:3000/api/v1
- 📚 Swagger: http://localhost:3000/api/docs
- 🗄️ PostgreSQL: localhost:5432

### Option 2: Local Development

```bash
# 1. Install dependencies
npm ci

# 2. Configure PostgreSQL database
# Create database: requirements_db
# Configure environment variables in apps/api/.env

# 3. Run migrations and seed
cd apps/api
npm run migration:run
npm run seed:run

# 4. Start API
npm run start:dev
# In another terminal:
npm run start:api

# 5. Start Portal
npm run start:portal
```

## ⚙️ Configuration

### Environment Variables

#### API (.env or apps/api/.env)

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=requirements_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:4200

# Monitoring
ENABLE_MONITORING=true
METRICS_RETENTION_MS=3600000
LOG_LEVEL=info
```

#### Portal

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

See [`env.docker.example`](env.docker.example) for complete Docker configuration.

## 📚 Project Structure

```
rp-workspace/
├── apps/
│   ├── api/                 # NestJS API
│   │   ├── src/
│   │   │   ├── domain/      # Domain entities
│   │   │   ├── application/ # Business logic
│   │   │   ├── infrastructure/ # Repositories, DB
│   │   │   ├── presentation/ # Controllers, DTOs
│   │   │   └── shared/      # Shared utilities
│   │   └── docs/            # API documentation
│   └── portal/              # Next.js Portal
│       └── src/
│           ├── app/         # Next.js routes
│           ├── features/    # Portal features
│           └── components/  # UI components
├── docs/                    # Complete documentation
├── scripts/                 # Automation scripts
├── tests/                   # Test scripts and scenarios
├── .github/workflows/       # CI/CD workflows
├── docker-compose.yml       # Docker orchestration
└── Makefile                # Useful commands
```

## 🛠️ Available Commands

### Development

```bash
# Start API in development mode
npm run start:api

# Start Portal in development mode
npm run start:portal

# Run tests
npm run test:api

# Run tests with coverage
cd apps/api && npm run test:cov

# Linting
npm run lint:api
cd apps/portal && npm run lint
```

### Build

```bash
# Build API
npm run build:api

# Build Portal
cd apps/portal && npm run build
```

### Docker

```bash
# See all available commands
make help

# Start services
make up

# Stop services
make down

# View logs
make logs
make logs-api
make logs-portal

# Health checks
make health

# Run migrations
make migrate

# Seed database
make seed
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
cd apps/api && npm test

# Tests with coverage
cd apps/api && npm run test:cov

# Verify coverage (100% required)
cd apps/api && npm run test:cov:check
```

### Integration Tests & Test Scenarios

The project includes comprehensive test scenarios in the [`tests/`](tests/) directory. These scripts allow you to verify the complete functionality of the system, test API endpoints, and debug issues.

#### Test Scripts

- **[`test-api.js`](tests/test-api.js)** - Basic API tests (login, authentication)

  - Tests user authentication flow
  - Verifies JWT token generation
  - Validates API connectivity

- **[`test-requirements.js`](tests/test-requirements.js)** - Requirements-specific tests

  - Tests CRUD operations for requirements
  - Verifies requirement associations
  - Tests requirement filtering and pagination

- **[`verify-full-flow.js`](tests/verify-full-flow.js)** - Complete application flow verification

  - End-to-end flow testing
  - Portfolio → Initiative → Epic → Requirement chain
  - Validates complete business workflows

- **[`verify-rules.js`](tests/verify-rules.js)** - Rules and validations verification

  - Tests business rules enforcement
  - Validates data constraints
  - Verifies validation logic

- **[`verify-update.js`](tests/verify-update.js)** - Update operations verification
  - Tests PATCH/PUT operations
  - Verifies update validations
  - Tests partial updates

#### Debugging Scripts

- **[`api-debug.js`](tests/api-debug.js)** - API debugging scripts

  - Debugs API endpoints
  - Tests portfolio and initiative endpoints
  - Verifies API responses

- **[`debug-epics.js`](tests/debug-epics.js)** - Epics-specific debugging

  - Tests epic creation and management
  - Verifies epic associations
  - Debugs epic-related issues

- **[`portal-debug-api.js`](tests/portal-debug-api.js)** - Portal debugging with API

  - Tests Portal-API integration
  - Verifies API calls from Portal
  - Debugs frontend-backend communication

- **[`check-rgl.js`](tests/check-rgl.js)** - React Grid Layout verification
  - Verifies react-grid-layout installation
  - Tests component dependencies
  - Validates UI library setup

#### Running Test Scenarios

```bash
# API Tests
node tests/test-api.js

# Requirements Tests
node tests/test-requirements.js

# Complete Flow Verification
node tests/verify-full-flow.js

# Rules Verification
node tests/verify-rules.js

# Update Operations
node tests/verify-update.js

# API Debugging
node tests/api-debug.js

# Epics Debugging
node tests/debug-epics.js

# Portal Debugging
node tests/portal-debug-api.js
```

**Prerequisites for Test Scenarios:**

- API must be running on `http://localhost:3000`
- Database must be seeded with test data
- Environment variables must be configured

See **[`tests/README.md`](tests/README.md)** for complete test documentation and detailed usage instructions.

## 🚢 Deployment

### Automated Deployment with GitHub Actions

The system includes complete CI/CD workflows:

#### 1. CI (Continuous Integration)

- Runs on every push/PR
- Linting, tests, builds
- Coverage verification (100%)

#### 2. CD - Development

- Runs on push to `develop`
- Automatic deployment to development

#### 3. CD - Production

- Runs on version tags (`v*.*.*`)
- Production deployment with verifications

#### 4. Deploy - Full Stack

- Complete deployment with Docker Compose
- Includes API, Portal, and Database
- Automatic health checks

See [docs/CI_CD.md](docs/CI_CD.md) for complete documentation.

### Manual Deployment

```bash
# 1. Build Docker images
docker-compose build

# 2. Start services
docker-compose up -d

# 3. Verify health
curl http://localhost:3000/api/v1/health/liveness
curl http://localhost:4200
```

## 📊 Monitoring

### Monitoring Dashboard

Access the dashboard at: http://localhost:4200/portal/monitoring

**Available Metrics:**

- Total requests
- Error rate
- Average response time
- Slow requests (>500ms)
- Recent errors
- System resources (CPU, Memory)

### Monitoring Endpoints

```bash
# General metrics
GET /api/v1/monitoring/metrics

# Request metrics
GET /api/v1/monitoring/metrics/requests

# Error metrics
GET /api/v1/monitoring/metrics/errors

# Detailed health check
GET /api/v1/monitoring/health/detailed

# System resources
GET /api/v1/monitoring/system
```

See [docs/MONITORING.md](docs/MONITORING.md) for more details.

## 🗄️ Database

### Structure

- **18 Main entities**
- **PostgreSQL 15+**
- **TypeORM** for ORM
- **Automatic migrations**

### Main Entities

- `Portfolio` - Strategic portfolios
- `Initiative` - Initiatives
- `Epic` - Epics
- `Requirement` - Requirements
- `Sponsor` - Sponsors
- `ProductOwner` - Product Owners
- Catalogs (Priority, Status, Complexity, etc.)

See [docs/README-DATABASE.md](docs/README-DATABASE.md) for complete documentation.

## 📖 Documentation

### Complete Documentation

All documentation is available in [`docs/`](docs/):

#### 🚀 Quick Start Guides

- **[README.md](docs/README.md)** - Documentation index
- **[QUICK_START_DOCKER.md](docs/QUICK_START_DOCKER.md)** - Quick start with Docker Compose (3 steps)
- **[README_DEPLOYMENT.md](docs/README_DEPLOYMENT.md)** - Quick deployment guide

#### 🐳 Docker & Deployment

- **[README_DOCKER.md](docs/README_DOCKER.md)** - Complete Docker Setup guide
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete deployment and compilation guide

#### 🔄 CI/CD

- **[README_CI_CD.md](docs/README_CI_CD.md)** - Quick CI/CD guide
- **[CI_CD.md](docs/CI_CD.md)** - Complete CI/CD documentation

#### 📊 Monitoring & Verification

- **[MONITORING.md](docs/MONITORING.md)** - Complete monitoring system documentation
- **[INTEGRITY_CHECKS.md](docs/INTEGRITY_CHECKS.md)** - Integrity verification and coverage requirements
- **[INTEGRITY_REPORT.md](docs/INTEGRITY_REPORT.md)** - System integrity report and status
- **[INTEGRITY_CHECKLIST.md](docs/INTEGRITY_CHECKLIST.md)** - Complete verification checklist

#### 🗄️ Database

- **[README-DATABASE.md](docs/README-DATABASE.md)** - Complete database documentation
- **[requirements-fields.md](docs/requirements-fields.md)** - Requirements fields documentation and data model

#### 🚀 VPS Deployment

Todos los archivos de deployment están en [`deploy-on-vps/`](deploy-on-vps/):

- **[README.md](deploy-on-vps/README.md)** - Índice de archivos de deployment
- **[GITHUB_HOSTINGER_INTEGRATION.md](deploy-on-vps/GITHUB_HOSTINGER_INTEGRATION.md)** - 🔗 **GitHub Actions Integration** - Deployment automático desde GitHub
- **[PLAN_DEPLOYMENT_REQUIREMENTS.md](deploy-on-vps/PLAN_DEPLOYMENT_REQUIREMENTS.md)** - ⭐ **Start Here** - Simplified deployment plan for Requirements Management module
- **[QUICK_START_VPS.md](deploy-on-vps/QUICK_START_VPS.md)** - ⚡ **Quick Start** - 5 comandos para empezar rápido
- **[PLAN_DEPLOYMENT_VPS.md](deploy-on-vps/PLAN_DEPLOYMENT_VPS.md)** - Complete VPS deployment plan (multi-module)
- **[DEPLOYMENT_MULTI_MODULE.md](deploy-on-vps/DEPLOYMENT_MULTI_MODULE.md)** - Multi-module deployment guide
- Ver [`deploy-on-vps/`](deploy-on-vps/) para todos los scripts y documentación

#### 📝 Changelog

- **[CHANGELOG.md](docs/CHANGELOG.md)** - Project changelog

### API Documentation

- **Swagger UI**: http://localhost:3000/api/docs
- **API Documentation**: [`apps/api/docs/`](apps/api/docs/)
  - Architecture and structure
  - Testing guides
  - Compatibility rules
  - Implementation guides

### Application-Specific Documentation

- **API Documentation**: [`apps/api/docs/`](apps/api/docs/)

  - Architecture and structure
  - Testing guides
  - Compatibility rules
  - Implementation guides

- **Portal Documentation**: [`apps/portal/README.md`](apps/portal/README.md)

### Test Scenarios Documentation

Comprehensive test scenarios and debugging scripts are available in [`tests/`](tests/):

- **[README.md](tests/README.md)** - Complete test scenarios documentation
  - Test scripts overview
  - Usage instructions
  - Prerequisites and requirements
  - Debugging guides

See the [Testing](#-testing) section above for detailed information about running test scenarios.

## 🔍 Integrity Verification

Run the verification script to ensure everything is correctly configured:

```bash
./scripts/verify-integrity.sh
```

This script verifies:

- ✅ File structure
- ✅ Database configuration
- ✅ Monitoring integration
- ✅ Docker configuration
- ✅ CI/CD workflows

## 🛡️ Security

### Implemented Best Practices

- ✅ **JWT Authentication** with secure tokens
- ✅ **Rate Limiting** to prevent abuse
- ✅ **Input Validation** with class-validator
- ✅ **SQL Injection Protection** with TypeORM
- ✅ **XSS Protection** with sanitization
- ✅ **CORS** correctly configured
- ✅ **Helmet** for security headers
- ✅ **Secrets Management** with environment variables

### Security Configuration

```env
# JWT Secret (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🤝 Contributing

### Contribution Process

1. Create a branch from `develop`
2. Make changes
3. Run tests and linting
4. Create Pull Request
5. Wait for review and approval

### Code Standards

- ✅ **ESLint** for linting
- ✅ **Prettier** for formatting
- ✅ **100% Coverage** required
- ✅ **Conventional Commits** recommended

## 📝 Useful Scripts

```bash
# Verify integrity
./scripts/verify-integrity.sh

# Generate changelog
node scripts/generate-changelog.js [version]

# Version bump
node scripts/version-bump.js [major|minor|patch]

# Docker setup
./scripts/docker-setup.sh
```

## 🐛 Troubleshooting

### Common Issues

#### API won't start

```bash
# Check environment variables
cat apps/api/.env

# Check database connection
psql -h localhost -U postgres -d requirements_db

# View logs
make logs-api
```

#### Portal can't connect to API

```bash
# Check NEXT_PUBLIC_API_URL variable
echo $NEXT_PUBLIC_API_URL

# Check if API is running
curl http://localhost:3000/api/v1/health/liveness
```

#### Database won't connect

```bash
# Check PostgreSQL service
docker-compose ps postgres

# View database logs
make logs-db

# Check environment variables
docker-compose config
```

## 📊 Project Status

### ✅ Completed

- ✅ Complete API with Clean Architecture
- ✅ Complete Portal with Next.js
- ✅ Integrated monitoring system
- ✅ Complete CI/CD with GitHub Actions
- ✅ Docker Compose for deployment
- ✅ Tests with 100% coverage
- ✅ Complete documentation

### 🚧 In Development

- Continuous performance improvements
- New features as per requirements

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 👥 Authors

Development Team

## 🔗 Useful Links

### Documentation

- [Complete Documentation Index](docs/README.md)
- [Quick Start Guide](docs/QUICK_START_DOCKER.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [CI/CD Documentation](docs/CI_CD.md)
- [Monitoring Documentation](docs/MONITORING.md)
- [Database Documentation](docs/README-DATABASE.md)
- [Integrity Checks](docs/INTEGRITY_CHECKS.md)

### Test Scenarios

- [Test Scenarios Documentation](tests/README.md)
- [Test Scripts](tests/)

### Application

- [API Swagger](http://localhost:3000/api/docs)
- [Monitoring Dashboard](http://localhost:4200/portal/monitoring)
- [API Health Check](http://localhost:3000/api/v1/health/liveness)

### CI/CD

- [GitHub Actions](https://github.com/USER/REPO/actions)
- [CI Workflow](.github/workflows/ci.yml)
- [CD Production Workflow](.github/workflows/cd-production.yml)
- [Deploy Full Stack Workflow](.github/workflows/deploy.yml)

## 📞 Support

For support or questions:

- Create an Issue on GitHub
- Review documentation in [`docs/`](docs/)
- Check logs: `make logs`
- Run test scenarios: [`tests/`](tests/)
- Review test scenarios documentation: [`tests/README.md`](tests/README.md)
- Check integrity: `./scripts/verify-integrity.sh`

---

**Developed with ❤️ using NestJS, Next.js and PostgreSQL**
