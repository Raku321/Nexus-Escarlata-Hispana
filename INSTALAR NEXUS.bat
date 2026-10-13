@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Nexus - Instalacion automatica
set "CI=false"
set "CSC_IDENTITY_AUTO_DISCOVERY=false"
set "LOG=%~dp0nexus-compilacion.log"
where node >nul 2>nul || goto :missing
where npm >nul 2>nul || goto :missing
for /f "usebackq delims=" %%V in (`node -p "require('./package.json').version"`) do set "NEXUS_VERSION=%%V"
if not defined NEXUS_VERSION goto :error
set "INSTALLER=%~dp0dist\Instalador-Nexus-%NEXUS_VERSION%.exe"
echo Nexus %NEXUS_VERSION% - compilacion > "%LOG%"
echo Preparando Nexus %NEXUS_VERSION%...
call npm ls electron-builder --depth=0 >> "%LOG%" 2>&1
if errorlevel 1 (
  echo Instalando dependencias...
  call npm install --no-fund --no-audit --loglevel=error >> "%LOG%" 2>&1
  if errorlevel 1 goto :error
)
echo Comprobando archivos...
node --check main.js >> "%LOG%" 2>&1
if errorlevel 1 goto :error
node --check preload.js >> "%LOG%" 2>&1
if errorlevel 1 goto :error
echo Generando instalador. Espera unos minutos...
call npm run dist -- --publish never
if errorlevel 1 goto :error
if not exist "%INSTALLER%" (
  echo No se encontro el instalador esperado: "%INSTALLER%" >> "%LOG%"
  goto :error
)
echo Instalador generado: "%INSTALLER%"
echo Abriendo instalador...
start "" "%INSTALLER%"
if errorlevel 1 goto :error
exit /b 0
:missing
echo ERROR: Necesitas instalar Node.js LTS.
pause
exit /b 1
:error
echo.
echo ERROR: No se pudo generar o abrir el instalador.
echo Revisa "%LOG%" y los mensajes anteriores.
pause
exit /b 1
