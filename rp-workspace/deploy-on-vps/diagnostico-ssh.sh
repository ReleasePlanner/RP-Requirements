#!/bin/bash

# Script de diagnóstico SSH para GitHub Actions
# Ejecuta este script en el VPS para verificar la configuración

set -e

echo "🔍 Diagnóstico SSH para GitHub Actions"
echo "======================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar si estamos en el VPS
if [ ! -f /etc/os-release ]; then
    echo -e "${RED}❌ Este script debe ejecutarse en el VPS${NC}"
    echo "Conéctate primero: ssh root@TU_VPS_IP"
    exit 1
fi

echo -e "${GREEN}✅ Ejecutándose en el VPS${NC}"
echo "Usuario actual: $(whoami)"
echo "Hostname: $(hostname)"
echo ""

# 1. Verificar directorio .ssh
echo -e "${BLUE}📁 1. Verificando directorio ~/.ssh...${NC}"
if [ -d ~/.ssh ]; then
    echo -e "   ${GREEN}✅ Directorio existe${NC}"
    PERMS=$(stat -c "%a" ~/.ssh)
    echo "   Permisos actuales: $PERMS"
    if [ "$PERMS" = "700" ]; then
        echo -e "   ${GREEN}✅ Permisos correctos (700)${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Permisos incorrectos (debería ser 700)${NC}"
        echo "   Ejecuta: chmod 700 ~/.ssh"
    fi
else
    echo -e "   ${RED}❌ Directorio no existe${NC}"
    echo "   Ejecuta: mkdir -p ~/.ssh && chmod 700 ~/.ssh"
fi
echo ""

# 2. Verificar authorized_keys
echo -e "${BLUE}🔑 2. Verificando ~/.ssh/authorized_keys...${NC}"
if [ -f ~/.ssh/authorized_keys ]; then
    echo -e "   ${GREEN}✅ Archivo existe${NC}"
    PERMS=$(stat -c "%a" ~/.ssh/authorized_keys)
    echo "   Permisos actuales: $PERMS"
    if [ "$PERMS" = "600" ]; then
        echo -e "   ${GREEN}✅ Permisos correctos (600)${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Permisos incorrectos (debería ser 600)${NC}"
        echo "   Ejecuta: chmod 600 ~/.ssh/authorized_keys"
    fi
    
    KEY_COUNT=$(wc -l < ~/.ssh/authorized_keys 2>/dev/null || echo "0")
    echo "   Número de claves autorizadas: $KEY_COUNT"
    
    if [ "$KEY_COUNT" -gt 0 ]; then
        echo ""
        echo "   Claves autorizadas:"
        echo "   ----------------------------------------"
        cat ~/.ssh/authorized_keys | while read line; do
            if [ -n "$line" ] && [[ ! "$line" =~ ^# ]]; then
                KEY_TYPE=$(echo "$line" | awk '{print $1}')
                KEY_COMMENT=$(echo "$line" | awk '{print $3}')
                echo "   - Tipo: $KEY_TYPE | Comentario: ${KEY_COMMENT:-sin comentario}"
            fi
        done
        echo "   ----------------------------------------"
    else
        echo -e "   ${RED}❌ No hay claves autorizadas${NC}"
        echo "   Necesitas agregar tu clave pública SSH aquí"
    fi
else
    echo -e "   ${RED}❌ Archivo no existe${NC}"
    echo "   Ejecuta: touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
fi
echo ""

# 3. Verificar configuración SSH del servidor
echo -e "${BLUE}⚙️  3. Verificando configuración SSH del servidor...${NC}"
if [ -f /etc/ssh/sshd_config ]; then
    echo "   Archivo de configuración encontrado"
    
    # Verificar PubkeyAuthentication
    if grep -q "^PubkeyAuthentication yes" /etc/ssh/sshd_config; then
        echo -e "   ${GREEN}✅ Autenticación por clave pública habilitada${NC}"
    elif grep -q "^PubkeyAuthentication no" /etc/ssh/sshd_config; then
        echo -e "   ${RED}❌ Autenticación por clave pública DESHABILITADA${NC}"
        echo "   Necesitas editar /etc/ssh/sshd_config y cambiar:"
        echo "   PubkeyAuthentication no -> PubkeyAuthentication yes"
        echo "   Luego reinicia SSH: systemctl restart sshd"
    else
        echo -e "   ${YELLOW}⚠️  PubkeyAuthentication no está configurado (por defecto está habilitado)${NC}"
    fi
    
    # Verificar PasswordAuthentication
    if grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config; then
        echo -e "   ${GREEN}✅ Autenticación por contraseña deshabilitada (más seguro)${NC}"
    elif grep -q "^PasswordAuthentication yes" /etc/ssh/sshd_config; then
        echo -e "   ${YELLOW}⚠️  Autenticación por contraseña habilitada${NC}"
    fi
    
    # Verificar AuthorizedKeysFile
    if grep -q "^AuthorizedKeysFile" /etc/ssh/sshd_config; then
        AUTH_KEYS_FILE=$(grep "^AuthorizedKeysFile" /etc/ssh/sshd_config | awk '{print $2}' | head -1)
        echo "   Archivo de claves autorizadas configurado: $AUTH_KEYS_FILE"
        # Expandir ~ si está presente
        AUTH_KEYS_FILE_EXPANDED=$(echo "$AUTH_KEYS_FILE" | sed "s|~|$HOME|g")
        echo "   Ruta expandida: $AUTH_KEYS_FILE_EXPANDED"
    else
        echo "   Usando ubicación por defecto: ~/.ssh/authorized_keys"
    fi
else
    echo -e "   ${YELLOW}⚠️  No se encontró /etc/ssh/sshd_config${NC}"
fi
echo ""

# 4. Verificar permisos del usuario
echo -e "${BLUE}👤 4. Verificando usuario y permisos...${NC}"
echo "   Usuario actual: $(whoami)"
echo "   UID: $(id -u)"
echo "   GID: $(id -g)"
echo "   Directorio home: $HOME"

# Verificar propiedad de .ssh
if [ -d ~/.ssh ]; then
    OWNER=$(stat -c "%U" ~/.ssh)
    if [ "$OWNER" = "$(whoami)" ]; then
        echo -e "   ${GREEN}✅ Propiedad correcta de ~/.ssh${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Propiedad incorrecta: $OWNER (debería ser $(whoami))${NC}"
        echo "   Ejecuta: chown -R $(whoami):$(whoami) ~/.ssh"
    fi
fi

if [ -f ~/.ssh/authorized_keys ]; then
    OWNER=$(stat -c "%U" ~/.ssh/authorized_keys)
    if [ "$OWNER" = "$(whoami)" ]; then
        echo -e "   ${GREEN}✅ Propiedad correcta de authorized_keys${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Propiedad incorrecta: $OWNER (debería ser $(whoami))${NC}"
        echo "   Ejecuta: chown $(whoami):$(whoami) ~/.ssh/authorized_keys"
    fi
fi
echo ""

# 5. Verificar firewall
echo -e "${BLUE}🔥 5. Verificando firewall...${NC}"
if command -v ufw >/dev/null 2>&1; then
    echo "   UFW encontrado"
    SSH_RULE=$(ufw status | grep -i "22" || echo "")
    if [ -n "$SSH_RULE" ]; then
        echo "   Reglas SSH:"
        echo "$SSH_RULE"
    else
        echo -e "   ${YELLOW}⚠️  No se encontraron reglas explícitas para SSH (puerto 22)${NC}"
    fi
elif command -v firewall-cmd >/dev/null 2>&1; then
    echo "   firewalld encontrado"
    if firewall-cmd --query-service=ssh >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Servicio SSH permitido en firewall${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Servicio SSH puede no estar permitido${NC}"
    fi
else
    echo "   No se encontró firewall configurado (puede estar usando iptables directamente)"
fi
echo ""

# 6. Verificar que SSH está escuchando
echo -e "${BLUE}🌐 6. Verificando que SSH está escuchando...${NC}"
if ss -tlnp | grep -q ":22 "; then
    echo -e "   ${GREEN}✅ SSH está escuchando en el puerto 22${NC}"
    SSHD_PID=$(ss -tlnp | grep ":22 " | awk '{print $6}' | cut -d',' -f2 | cut -d'=' -f2 | head -1)
    if [ -n "$SSHD_PID" ]; then
        echo "   PID del proceso SSH: $SSHD_PID"
    fi
else
    echo -e "   ${RED}❌ SSH no está escuchando en el puerto 22${NC}"
    echo "   Verifica el estado: systemctl status sshd"
fi
echo ""

# 7. Resumen y recomendaciones
echo -e "${BLUE}📋 7. Resumen y Recomendaciones${NC}"
echo "======================================"

ISSUES=0

# Verificar problemas críticos
if [ ! -d ~/.ssh ]; then
    echo -e "${RED}❌ PROBLEMA CRÍTICO: Directorio ~/.ssh no existe${NC}"
    ISSUES=$((ISSUES + 1))
fi

if [ ! -f ~/.ssh/authorized_keys ]; then
    echo -e "${RED}❌ PROBLEMA CRÍTICO: Archivo authorized_keys no existe${NC}"
    ISSUES=$((ISSUES + 1))
fi

if [ -f ~/.ssh/authorized_keys ]; then
    KEY_COUNT=$(wc -l < ~/.ssh/authorized_keys 2>/dev/null || echo "0")
    if [ "$KEY_COUNT" -eq 0 ]; then
        echo -e "${RED}❌ PROBLEMA CRÍTICO: No hay claves autorizadas${NC}"
        ISSUES=$((ISSUES + 1))
    fi
fi

if [ -f ~/.ssh/authorized_keys ]; then
    PERMS=$(stat -c "%a" ~/.ssh/authorized_keys)
    if [ "$PERMS" != "600" ]; then
        echo -e "${YELLOW}⚠️  ADVERTENCIA: Permisos incorrectos en authorized_keys${NC}"
        ISSUES=$((ISSUES + 1))
    fi
fi

PERMS=$(stat -c "%a" ~/.ssh 2>/dev/null || echo "000")
if [ "$PERMS" != "700" ]; then
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Permisos incorrectos en ~/.ssh${NC}"
    ISSUES=$((ISSUES + 1))
fi

echo ""
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No se encontraron problemas críticos${NC}"
    echo ""
    echo "💡 Si aún tienes problemas de conexión:"
    echo "   1. Verifica que la clave pública en authorized_keys coincide con la clave privada en GitHub Secrets"
    echo "   2. Verifica los logs de SSH: tail -f /var/log/auth.log (o /var/log/secure)"
    echo "   3. Prueba la conexión manualmente desde tu máquina local"
else
    echo -e "${RED}❌ Se encontraron $ISSUES problema(s)${NC}"
    echo ""
    echo "🔧 Pasos para solucionar:"
    echo "   1. mkdir -p ~/.ssh && chmod 700 ~/.ssh"
    echo "   2. touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
    echo "   3. Agrega tu clave pública: echo 'TU_CLAVE_PUBLICA' >> ~/.ssh/authorized_keys"
    echo "   4. Verifica permisos: chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
fi

echo ""
echo "📚 Para más información, consulta:"
echo "   - SOLUCION_RAPIDA_SSH.md"
echo "   - MEJORES_PRACTICAS_SSH_GITHUB_ACTIONS.md"

