#!/bin/bash

# ============================================
# DEPLOYMENT - Requirements Management
# Configuración lista para ejecutar
# ============================================

# Configuración
export VPS_HOST=72.60.63.240
export VPS_USER=root
export GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git

# Mostrar configuración
echo "═══════════════════════════════════════════════════════════"
echo "  Requirements Management - Deployment"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Configuración:"
echo "  VPS Host: $VPS_HOST"
echo "  VPS User: $VPS_USER"
echo "  SSH: ssh $VPS_USER@$VPS_HOST"
echo "  Repositorio: $GIT_REPO_URL"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "scripts/deploy-requirements-vps.sh" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    echo "   cd /c/MySources/RP-Requirements-Web/rp-workspace"
    exit 1
fi

# Ejecutar script de deployment
echo "🚀 Iniciando deployment..."
echo ""
./scripts/deploy-requirements-vps.sh

