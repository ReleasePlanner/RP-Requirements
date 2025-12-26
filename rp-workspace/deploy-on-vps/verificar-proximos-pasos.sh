#!/bin/bash

echo "=========================================="
echo "  Verificación de Próximos Pasos"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
VPS_HOST="72.60.63.240"
VPS_USER="root"

echo "[1/6] Verificando configuración local..."
echo "  VPS_HOST: $VPS_HOST"
echo "  VPS_USER: $VPS_USER"
echo ""

echo "[2/6] Verificando archivos de documentación..."
if [ -f "rp-workspace/deploy-on-vps/SOLUCION_DEFINITIVA_PERMISSION_DENIED.md" ]; then
    echo -e "${GREEN}✅ Guía de solución encontrada${NC}"
else
    echo -e "${YELLOW}⚠️ Guía de solución no encontrada${NC}"
fi
echo ""

echo "[3/6] Verificando workflows de GitHub..."
if [ -f ".github/workflows/deploy-hostinger.yml" ]; then
    echo -e "${GREEN}✅ Workflow deploy-hostinger.yml encontrado${NC}"
    
    # Verificar que tenga la lógica de contraseña
    if grep -q "VPS_SSH_PASSWORD" ".github/workflows/deploy-hostinger.yml"; then
        echo -e "${GREEN}✅ Workflow configurado para usar contraseña${NC}"
    else
        echo -e "${RED}❌ Workflow no tiene configuración de contraseña${NC}"
    fi
else
    echo -e "${RED}❌ Workflow no encontrado${NC}"
fi
echo ""

echo "[4/6] Verificando configuración MCP..."
if [ -f "C:/Users/beyon/.ssh/mcp-ssh-manager.env" ]; then
    echo -e "${GREEN}✅ Configuración MCP encontrada${NC}"
    echo "  Archivo: C:/Users/beyon/.ssh/mcp-ssh-manager.env"
else
    echo -e "${YELLOW}⚠️ Configuración MCP no encontrada${NC}"
fi
echo ""

echo "[5/6] Checklist de Secrets en GitHub..."
echo ""
echo -e "${BLUE}📋 Secrets que DEBEN estar configurados en GitHub:${NC}"
echo ""
echo "🔴 Críticos (sin estos NO funcionará):"
echo "   [ ] VPS_HOST = $VPS_HOST"
echo "   [ ] VPS_USER = $VPS_USER"
echo "   [ ] VPS_SSH_PASSWORD = (tu contraseña SSH exacta)"
echo "   [ ] DB_USERNAME = (usuario PostgreSQL)"
echo "   [ ] DB_PASSWORD = (contraseña PostgreSQL)"
echo "   [ ] DB_DATABASE = requirements_db"
echo "   [ ] JWT_SECRET = (mínimo 32 caracteres)"
echo ""
echo "🟡 Opcionales (tienen valores por defecto):"
echo "   [ ] DB_PORT = 5432"
echo "   [ ] JWT_EXPIRES_IN = 1d"
echo "   [ ] CORS_ORIGIN = http://localhost:4200"
echo ""

echo "[6/6] Próximos pasos recomendados..."
echo ""
echo -e "${BLUE}📋 ACCIONES REQUERIDAS:${NC}"
echo ""
echo "1. ${YELLOW}Verificar contraseña SSH manualmente:${NC}"
echo "   ssh root@$VPS_HOST"
echo "   (Anota la contraseña EXACTA que funciona)"
echo ""
echo "2. ${YELLOW}Actualizar VPS_SSH_PASSWORD en GitHub:${NC}"
echo "   - Ve a: GitHub > Settings > Secrets > Actions"
echo "   - Busca: VPS_SSH_PASSWORD"
echo "   - Click: Update"
echo "   - Pega la contraseña EXACTA (sin espacios)"
echo "   - Click: Update secret"
echo ""
echo "3. ${YELLOW}Probar conexión SSH primero:${NC}"
echo "   - Ve a: Actions > Test SSH Connection"
echo "   - Click: Run workflow"
echo "   - Verifica que funcione antes del deployment completo"
echo ""
echo "4. ${YELLOW}Si Test SSH Connection funciona:${NC}"
echo "   - Ejecuta: Actions > Deploy to Hostinger VPS"
echo "   - Selecciona environment: development o production"
echo "   - Click: Run workflow"
echo ""
echo "5. ${YELLOW}Si sigue fallando:${NC}"
echo "   - Revisa los logs del workflow"
echo "   - Busca el step específico que falla"
echo "   - Verifica: SOLUCION_DEFINITIVA_PERMISSION_DENIED.md"
echo ""

echo "=========================================="
echo "  ✅ Verificación Completada"
echo "=========================================="
echo ""

