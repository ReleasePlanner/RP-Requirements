@echo off
chcp 65001 >nul
echo ==========================================
echo   Test SSH Connection - GitHub Secrets
echo ==========================================
echo.

echo 🔍 Configuración:
echo   VPS_HOST: %VPS_HOST%
echo   VPS_USER: %VPS_USER%
if defined VPS_SSH_PASSWORD (
    echo   VPS_SSH_PASSWORD: ***configurado***
) else (
    echo   VPS_SSH_PASSWORD: NO CONFIGURADO
)
echo.

if not defined VPS_SSH_PASSWORD (
    echo ❌ VPS_SSH_PASSWORD no está configurado
    echo.
    echo Para probar la conexión, configura la variable de entorno:
    echo   set VPS_SSH_PASSWORD=tu_contraseña
    echo.
    echo O ejecuta:
    echo   set VPS_SSH_PASSWORD=tu_contraseña ^&^& test-ssh-with-github-secrets.bat
    echo.
    pause
    exit /b 1
)

echo [1/4] Verificando sshpass...
where sshpass >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ sshpass no está instalado
    echo.
    echo Para Windows, puedes:
    echo   1. Usar Git Bash (viene con sshpass)
    echo   2. Instalar WSL y usar el script .sh
    echo   3. Usar el script de PowerShell alternativo
    echo.
    pause
    exit /b 1
)
echo ✅ sshpass encontrado
echo.

echo [2/4] Deshabilitando agente SSH...
set SSH_AUTH_SOCK=
set SSH_AGENT_PID=
echo ✅ Agente SSH deshabilitado
echo.

echo [3/4] Probando conexión SSH con contraseña...
echo Comando que se ejecutará:
echo   sshpass -p '***' ssh ... %VPS_USER%@%VPS_HOST% 'echo test'
echo.

sshpass -p "%VPS_SSH_PASSWORD%" ^
    ssh -o StrictHostKeyChecking=no ^
        -o UserKnownHostsFile=/dev/null ^
        -o ConnectTimeout=10 ^
        -o PreferredAuthentications=password ^
        -o PubkeyAuthentication=no ^
        -o PasswordAuthentication=yes ^
        -o BatchMode=yes ^
        -o NumberOfPasswordPrompts=1 ^
        -o IdentitiesOnly=yes ^
        -o IdentityFile=/dev/null ^
        -o KbdInteractiveAuthentication=no ^
        -o ChallengeResponseAuthentication=no ^
        -o GSSAPIAuthentication=no ^
        -o HostbasedAuthentication=no ^
        %VPS_USER%@%VPS_HOST% ^
        "echo '✅ SSH connection successful!' && uname -a && docker --version 2>nul || echo '⚠️ Docker not installed'"

if %errorlevel% == 0 (
    echo.
    echo ==========================================
    echo   ✅ CONEXIÓN SSH EXITOSA
    echo ==========================================
    echo.
    echo La contraseña funciona correctamente.
    echo Puedes usar esta misma contraseña en GitHub Secrets.
    echo.
    
    echo [4/4] Probando comandos adicionales...
    echo Verificando Docker...
    sshpass -p "%VPS_SSH_PASSWORD%" ^
        ssh -o StrictHostKeyChecking=no ^
            -o UserKnownHostsFile=/dev/null ^
            -o PreferredAuthentications=password ^
            -o PubkeyAuthentication=no ^
            -o PasswordAuthentication=yes ^
            -o BatchMode=yes ^
            -o IdentitiesOnly=yes ^
            -o IdentityFile=/dev/null ^
            %VPS_USER%@%VPS_HOST% ^
            "docker --version && docker-compose --version 2>nul || echo '⚠️ Docker Compose not installed'"
    
    echo Verificando directorio de deployment...
    sshpass -p "%VPS_SSH_PASSWORD%" ^
        ssh -o StrictHostKeyChecking=no ^
            -o UserKnownHostsFile=/dev/null ^
            -o PreferredAuthentications=password ^
            -o PubkeyAuthentication=no ^
            -o PasswordAuthentication=yes ^
            -o BatchMode=yes ^
            -o IdentitiesOnly=yes ^
            -o IdentityFile=/dev/null ^
            %VPS_USER%@%VPS_HOST% ^
            "mkdir -p /opt/modules/requirements-management && ls -la /opt/modules && echo '✅ Directory accessible'"
    
    echo.
    echo ✅ Todas las pruebas pasaron exitosamente
    echo.
    echo 📋 Próximos pasos:
    echo    1. Actualiza VPS_SSH_PASSWORD en GitHub Secrets con esta contraseña
    echo    2. Ejecuta 'Test SSH Connection' en GitHub Actions
    echo    3. Si funciona, ejecuta el deployment completo
) else (
    echo.
    echo ==========================================
    echo   ❌ CONEXIÓN SSH FALLIDA
    echo ==========================================
    echo.
    echo El error indica que:
    echo   1. La contraseña es incorrecta
    echo   2. El usuario SSH es incorrecto
    echo   3. El servidor tiene restricciones
    echo.
    echo 🔍 Troubleshooting:
    echo    1. Verifica la contraseña manualmente:
    echo       ssh %VPS_USER%@%VPS_HOST%
    echo.
    echo    2. Verifica que el usuario sea correcto
    echo.
    echo    3. Verifica que el servidor permita autenticación por contraseña
    echo.
)

pause

