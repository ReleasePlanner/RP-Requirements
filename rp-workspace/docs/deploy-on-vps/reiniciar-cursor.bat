@echo off
echo ========================================
echo   Reiniciando Cursor para aplicar MCP
echo ========================================
echo.

echo [1/3] Cerrando Cursor...
taskkill /F /IM Cursor.exe >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Cursor cerrado exitosamente
) else (
    echo ℹ️  Cursor no estaba ejecutándose
)
echo.

echo [2/3] Esperando 3 segundos...
timeout /t 3 /nobreak >nul
echo.

echo [3/3] Abriendo Cursor...
start "" "C:\Users\beyon\AppData\Local\Programs\cursor\Cursor.exe"
echo ✅ Cursor iniciado
echo.

echo ========================================
echo   Configuración MCP aplicada
echo ========================================
echo.
echo Espera 10-15 segundos para que MCP se inicialice.
echo Luego prueba en Cursor: "List my SSH servers"
echo.
pause


