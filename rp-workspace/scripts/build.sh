#!/bin/bash

# Build script for the Requirements Management System
# Usage: ./scripts/build.sh [api|portal|all]

set -e

BUILD_TARGET=${1:-all}

echo "🔨 Building Requirements Management System"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

build_api() {
    echo -e "${YELLOW}Building API...${NC}"
    cd apps/api
    npm run build
    echo -e "${GREEN}✅ API built successfully${NC}"
    cd ../..
}

build_portal() {
    echo -e "${YELLOW}Building Portal...${NC}"
    cd apps/portal
    npm run build
    echo -e "${GREEN}✅ Portal built successfully${NC}"
    cd ../..
}

case $BUILD_TARGET in
    api)
        build_api
        ;;
    portal)
        build_portal
        ;;
    all)
        echo "Building all applications..."
        build_api
        build_portal
        echo ""
        echo -e "${GREEN}✅ All builds completed successfully${NC}"
        ;;
    *)
        echo "Usage: $0 [api|portal|all]"
        exit 1
        ;;
esac

