#!/bin/bash

# Integrity Verification Script
# Verifies that the entire system is correctly configured

set -e

echo "🔍 Requirements Management System - Integrity Check"
echo "===================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (missing)"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ (missing)"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Check API Structure
echo "📦 Checking API Structure..."
check_directory "apps/api/src"
check_directory "apps/api/src/domain/entities"
check_directory "apps/api/src/application"
check_directory "apps/api/src/infrastructure"
check_directory "apps/api/src/presentation"
check_directory "apps/api/src/shared"
check_file "apps/api/package.json"
check_file "apps/api/tsconfig.json"
check_file "apps/api/Dockerfile"
check_file "apps/api/src/main.ts"
check_file "apps/api/src/app.module.ts"
check_file "apps/api/src/infrastructure/database/database.config.ts"
check_file "apps/api/src/presentation/monitoring/monitoring.module.ts"
check_file "apps/api/src/shared/services/metrics.service.ts"
check_file "apps/api/src/shared/interceptors/metrics.interceptor.ts"
echo ""

# 2. Check Portal Structure
echo "🌐 Checking Portal Structure..."
check_directory "apps/portal/src"
check_directory "apps/portal/src/app"
check_directory "apps/portal/src/features"
check_directory "apps/portal/src/features/monitoring"
check_file "apps/portal/package.json"
check_file "apps/portal/tsconfig.json"
check_file "apps/portal/Dockerfile"
check_file "apps/portal/next.config.ts"
check_file "apps/portal/src/app/portal/monitoring/page.tsx"
check_file "apps/portal/src/features/monitoring/service.ts"
echo ""

# 3. Check Database Configuration
echo "🗄️ Checking Database Configuration..."
check_file "apps/api/src/infrastructure/database/database.config.ts"
# Count entities
ENTITY_COUNT=$(grep -c "import.*entity" apps/api/src/infrastructure/database/database.config.ts || echo "0")
if [ "$ENTITY_COUNT" -ge "18" ]; then
    echo -e "${GREEN}✅${NC} All entities imported ($ENTITY_COUNT)"
else
    warn "Only $ENTITY_COUNT entities found (expected 18+)"
fi
echo ""

# 4. Check Monitoring Integration
echo "📊 Checking Monitoring Integration..."
if grep -q "MonitoringModule" apps/api/src/app.module.ts; then
    echo -e "${GREEN}✅${NC} MonitoringModule imported in AppModule"
else
    echo -e "${RED}❌${NC} MonitoringModule not found in AppModule"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "MetricsInterceptor" apps/api/src/presentation/monitoring/monitoring.module.ts; then
    echo -e "${GREEN}✅${NC} MetricsInterceptor registered"
else
    echo -e "${RED}❌${NC} MetricsInterceptor not registered"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "PerformanceMonitorService" apps/api/src/presentation/monitoring/monitoring.module.ts; then
    echo -e "${GREEN}✅${NC} PerformanceMonitorService registered"
else
    echo -e "${RED}❌${NC} PerformanceMonitorService not registered"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 5. Check Docker Configuration
echo "🐳 Checking Docker Configuration..."
check_file "docker-compose.yml"
check_file "apps/api/Dockerfile"
check_file "apps/portal/Dockerfile"
check_file ".dockerignore"
check_file "env.docker.example"

# Check docker-compose services
if grep -q "postgres:" docker-compose.yml && grep -q "api:" docker-compose.yml && grep -q "portal:" docker-compose.yml; then
    echo -e "${GREEN}✅${NC} All services defined in docker-compose.yml"
else
    echo -e "${RED}❌${NC} Missing services in docker-compose.yml"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 6. Check CI/CD Configuration
echo "🔄 Checking CI/CD Configuration..."
check_file ".github/workflows/ci.yml"
check_file ".github/workflows/cd-production.yml"
check_file ".github/workflows/cd-dev.yml"
check_file ".github/workflows/integrity-check.yml"
check_file ".github/workflows/docker-build.yml"
echo ""

# 7. Check Environment Configuration
echo "⚙️ Checking Environment Configuration..."
check_file "apps/api/src/shared/config/config.validation.ts"
if grep -q "ENABLE_MONITORING" apps/api/src/shared/config/config.validation.ts; then
    echo -e "${GREEN}✅${NC} Monitoring variables in config validation"
else
    warn "Monitoring variables not in config validation"
fi
echo ""

# 8. Check Portal Monitoring Integration
echo "📱 Checking Portal Monitoring..."
if grep -q "monitoring" apps/portal/src/components/layout/sidebar.tsx; then
    echo -e "${GREEN}✅${NC} Monitoring link in sidebar"
else
    echo -e "${RED}❌${NC} Monitoring link missing in sidebar"
    ERRORS=$((ERRORS + 1))
fi

check_file "apps/portal/src/app/portal/monitoring/page.tsx"
check_file "apps/portal/src/features/monitoring/components/monitoring-dashboard.tsx"
echo ""

# Summary
echo "===================================================="
echo "📊 Summary"
echo "===================================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! System is ready for deployment.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️ $WARNINGS warning(s) found. System should work but review warnings.${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo "Please fix the errors before deploying."
    exit 1
fi

