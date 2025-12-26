#!/bin/bash

# Script de Deployment - Requirements Management
# Configuración lista para ejecutar

export VPS_HOST=72.60.63.240
export VPS_USER=root
export GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git

echo "🚀 Iniciando deployment..."
echo "VPS: $VPS_HOST"
echo "Repo: $GIT_REPO_URL"
echo ""

# Ejecutar script de deployment
./scripts/deploy-requirements-vps.sh
