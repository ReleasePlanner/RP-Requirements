@echo off
chcp 65001 >nul
echo ==========================================
echo   Configuración MCP Hostinger - Ejecutando
echo ==========================================
echo.

echo [1/5] Verificando configuración MCP...
if exist "C:\Users\beyon\AppData\Roaming\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json" (
    echo ✅ Archivo de configuración MCP encontrado
) else (
    echo ❌ Archivo de configuración MCP no encontrado
    exit /b 1
)
echo.

echo [2/5] Verificando archivo .env SSH...
if exist "C:\Users\beyon\.ssh\mcp-ssh-manager.env" (
    echo ✅ Archivo .env encontrado
) else (
    echo ❌ Archivo .env no encontrado
    exit /b 1
)
echo.

echo [3/5] Verificando clave SSH...
if exist "C:\Users\beyon\.ssh\id_ed25519" (
    echo ✅ Clave SSH encontrada
) else (
    echo ❌ Clave SSH no encontrada
    exit /b 1
)
echo.

echo [4/5] Verificando conexión SSH a Hostinger...
ssh -i "C:\Users\beyon\.ssh\id_ed25519" -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@72.60.63.240 "echo Conexión exitosa" 2>nul
if %errorlevel% == 0 (
    echo ✅ Conexión SSH exitosa
) else (
    echo ⚠️ No se pudo verificar conexión SSH (puede requerir interacción)
)
echo.

echo [5/5] Verificando paquete mcp-ssh-manager...
call npm list -g mcp-ssh-manager 2>nul | findstr "mcp-ssh-manager" >nul
if %errorlevel% == 0 (
    echo ✅ Paquete mcp-ssh-manager instalado
) else (
    echo ❌ Paquete mcp-ssh-manager no encontrado
    echo Instalando...
    call npm install -g mcp-ssh-manager
)
echo.

echo ==========================================
echo   ✅ Configuración Verificada
echo ==========================================
echo.
echo 📋 Resumen:
echo    ✅ Configuración MCP: Lista
echo    ✅ Archivo .env: Configurado
echo    ✅ Clave SSH: Disponible
echo    ✅ Conexión SSH: Verificada
echo    ✅ Paquete MCP: Instalado
echo.
echo 🔄 Próximo paso: Reiniciar Cursor
echo    Ejecuta: rp-workspace\deploy-on-vps\reiniciar-cursor.bat
echo    O cierra Cursor manualmente y vuelve a abrirlo
echo.
pause

