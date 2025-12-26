#!/bin/bash

# Script para configurar SSH en el VPS para GitHub Actions
# Uso: bash fix-ssh-setup.sh

set -e

echo "🔧 Script de Configuración SSH para GitHub Actions"
echo "=================================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si estamos en el VPS
if [ ! -f /etc/os-release ]; then
    echo -e "${RED}❌ Este script debe ejecutarse en el VPS${NC}"
    echo "Conéctate primero: ssh root@TU_VPS_IP"
    exit 1
fi

echo "✅ Ejecutándose en el VPS"
echo ""

# Paso 1: Crear directorio .ssh si no existe
echo "📁 Paso 1: Verificando directorio ~/.ssh..."
if [ ! -d ~/.ssh ]; then
    echo "   Creando ~/.ssh..."
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    echo -e "   ${GREEN}✅ Directorio creado${NC}"
else
    echo -e "   ${GREEN}✅ Directorio existe${NC}"
fi

# Paso 2: Verificar permisos de .ssh
echo ""
echo "🔒 Paso 2: Verificando permisos de ~/.ssh..."
CURRENT_PERMS=$(stat -c "%a" ~/.ssh)
if [ "$CURRENT_PERMS" != "700" ]; then
    echo "   Permisos actuales: $CURRENT_PERMS (debería ser 700)"
    echo "   Corrigiendo permisos..."
    chmod 700 ~/.ssh
    echo -e "   ${GREEN}✅ Permisos corregidos a 700${NC}"
else
    echo -e "   ${GREEN}✅ Permisos correctos (700)${NC}"
fi

# Paso 3: Crear authorized_keys si no existe
echo ""
echo "📝 Paso 3: Verificando ~/.ssh/authorized_keys..."
if [ ! -f ~/.ssh/authorized_keys ]; then
    echo "   Creando archivo authorized_keys..."
    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    echo -e "   ${GREEN}✅ Archivo creado${NC}"
else
    echo -e "   ${GREEN}✅ Archivo existe${NC}"
fi

# Paso 4: Verificar permisos de authorized_keys
echo ""
echo "🔒 Paso 4: Verificando permisos de authorized_keys..."
CURRENT_PERMS=$(stat -c "%a" ~/.ssh/authorized_keys)
if [ "$CURRENT_PERMS" != "600" ]; then
    echo "   Permisos actuales: $CURRENT_PERMS (debería ser 600)"
    echo "   Corrigiendo permisos..."
    chmod 600 ~/.ssh/authorized_keys
    echo -e "   ${GREEN}✅ Permisos corregidos a 600${NC}"
else
    echo -e "   ${GREEN}✅ Permisos correctos (600)${NC}"
fi

# Paso 5: Mostrar contenido actual
echo ""
echo "📋 Paso 5: Claves SSH actualmente autorizadas:"
echo "--------------------------------------------"
if [ -s ~/.ssh/authorized_keys ]; then
    cat ~/.ssh/authorized_keys
    echo "--------------------------------------------"
    KEY_COUNT=$(wc -l < ~/.ssh/authorized_keys)
    echo -e "${GREEN}✅ Total de claves: $KEY_COUNT${NC}"
else
    echo -e "${YELLOW}⚠️  No hay claves autorizadas aún${NC}"
fi

# Paso 6: Instrucciones para agregar clave
echo ""
echo "📝 Paso 6: Para agregar una nueva clave SSH:"
echo "--------------------------------------------"
echo "1. Desde tu máquina local, genera la clave pública:"
echo "   ssh-keygen -y -f ~/.ssh/hostinger_deploy"
echo ""
echo "2. Copia la clave pública que se muestra arriba"
echo ""
echo "3. Ejecuta este comando en el VPS:"
echo "   echo 'TU_CLAVE_PUBLICA_AQUI' >> ~/.ssh/authorized_keys"
echo ""
echo "4. O usa ssh-copy-id desde tu máquina local:"
echo "   ssh-copy-id -i ~/.ssh/hostinger_deploy.pub root@TU_VPS_IP"
echo ""

# Paso 7: Verificación final
echo ""
echo "✅ Verificación Final:"
echo "--------------------------------------------"
echo "Permisos de ~/.ssh: $(stat -c "%a" ~/.ssh)"
echo "Permisos de authorized_keys: $(stat -c "%a" ~/.ssh/authorized_keys)"
echo "Número de claves: $(wc -l < ~/.ssh/authorized_keys 2>/dev/null || echo 0)"
echo ""

# Verificar configuración SSH del servidor
echo "🔍 Verificando configuración SSH del servidor..."
if [ -f /etc/ssh/sshd_config ]; then
    echo "   Archivo de configuración encontrado"
    
    # Verificar que PubkeyAuthentication esté habilitado
    if grep -q "^PubkeyAuthentication yes" /etc/ssh/sshd_config || ! grep -q "^PubkeyAuthentication no" /etc/ssh/sshd_config; then
        echo -e "   ${GREEN}✅ Autenticación por clave pública habilitada${NC}"
    else
        echo -e "   ${RED}❌ Autenticación por clave pública deshabilitada${NC}"
        echo "   Necesitas editar /etc/ssh/sshd_config y cambiar:"
        echo "   PubkeyAuthentication no -> PubkeyAuthentication yes"
        echo "   Luego reinicia SSH: systemctl restart sshd"
    fi
    
    # Verificar AuthorizedKeysFile
    if grep -q "^AuthorizedKeysFile" /etc/ssh/sshd_config; then
        AUTH_KEYS_FILE=$(grep "^AuthorizedKeysFile" /etc/ssh/sshd_config | awk '{print $2}')
        echo "   Archivo de claves autorizadas: $AUTH_KEYS_FILE"
    fi
fi

echo ""
echo -e "${GREEN}✅ Configuración SSH verificada${NC}"
echo ""
echo "💡 Próximos pasos:"
echo "   1. Agrega tu clave pública SSH al archivo authorized_keys"
echo "   2. Verifica la conexión desde tu máquina local"
echo "   3. Ejecuta el workflow de GitHub Actions nuevamente"

