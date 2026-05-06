@echo off
cd /d "%~dp0\..\.."
echo Iniciando API em http://localhost:3001
"C:\Program Files\nodejs\node.exe" apps\api\src\server.js
pause
