#!/bin/bash

# Script Completo de Deployment
# Ejecuta todos los pasos necesarios

set -e

VPS_HOST=72.60.63.240
VPS_USER=root
SSH_PASSWORD="Aar-Beto-2026"

echo "🚀 Iniciando deployment completo..."
echo ""

# Paso 1: Copiar script al VPS
echo "📦 Paso 1: Copiando script al VPS..."
echo "Nota: Se te pedirá la contraseña SSH"
echo "Contraseña: $SSH_PASSWORD"
echo ""

scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    scripts/deploy-on-vps.sh \
    $VPS_USER@$VPS_HOST:/tmp/ || {
    echo "❌ Error copiando script"
    echo ""
    echo "Ejecuta manualmente:"
    echo "  scp scripts/deploy-on-vps.sh root@72.60.63.240:/tmp/"
    echo "  ssh root@72.60.63.240"
    echo "  bash /tmp/deploy-on-vps.sh"
    exit 1
}

echo "✅ Script copiado"
echo ""

# Paso 2: Conectar y ejecutar
echo "🔌 Paso 2: Conectando al VPS y ejecutando deployment..."
echo "Nota: Se te pedirá la contraseña SSH nuevamente"
echo "Contraseña: $SSH_PASSWORD"
echo ""

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    $VPS_USER@$VPS_HOST \
    "bash /tmp/deploy-on-vps.sh" || {
    echo ""
    echo "⚠️  Si hubo errores, ejecuta manualmente:"
    echo "  ssh root@72.60.63.240"
    echo "  bash /tmp/deploy-on-vps.sh"
    exit 1
}

echo ""
echo "✅ Deployment completado!"
echo ""
echo "Próximos pasos:"
echo "1. Configurar DNS"
echo "2. Configurar Nginx y SSL"
echo "   Ver: docs/QUICK_START_VPS.md"

