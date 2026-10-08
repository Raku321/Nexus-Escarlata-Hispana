@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Nexus 1.0.7 - Compilacion optimizada
set "CI=false"
set "CSC_IDENTITY_AUTO_DISCOVERY=false"
set "LOG=%~dp0nexus-compilacion.log"
echo Nexus 1.0.7 - compilacion optimizada > "%LOG%"
where node >nul 2>nul || goto :missing
where npm >nul 2>nul || goto :missing
echo Verificando dependencias...
call npm ls electron-builder --depth=0 >> "%LOG%" 2>&1
if errorlevel 1 (
  echo Instalando dependencias por primera vez...
  call npm install --no-fund --no-audit --loglevel=error >> "%LOG%" 2>&1
  if errorlevel 1 goto :error
) else (
  echo Dependencias existentes: no se descargan otra vez.
)
echo Comprobando sintaxis...
node --check main.js >> "%LOG%" 2>&1
if errorlevel 1 goto :error
node --check preload.js >> "%LOG%" 2>&1
if errorlevel 1 goto :error
echo Compilando instalador...
call npm run dist -- --publish never >> "%LOG%" 2>&1
if errorlevel 1 goto :error
if not exist "dist\Instalador-Nexus-1.0.7.exe" goto :error
echo.
echo Instalador listo: dist\Instalador-Nexus-1.0.7.exe
echo Abriendo instalador automaticamente...
start "" "dist\Instalador-Nexus-1.0.7.exe"
echo Puedes compartir solo el archivo EXE de la carpeta dist.
pause
exit /b 0
:missing
echo Instala Node.js LTS.
pause
exit /b 1
:error
echo Fallo la compilacion. Abre nexus-compilacion.log.
pause
exit /b 1
