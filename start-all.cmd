@echo off
cd /d "%~dp0"
echo Abrindo API e frontend...
start "Biblioteca API" cmd /k "cd /d %~dp0 && C:\Program Files\nodejs\node.exe apps\api\src\server.js"
start "Biblioteca Frontend" cmd /k "cd /d %~dp0\apps\web && C:\Program Files\nodejs\node.exe server.js"
echo.
echo API: http://localhost:3001
echo Frontend: http://localhost:3000
pause
