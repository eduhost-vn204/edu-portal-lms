@echo off
echo ============================================
echo  VẬT LÝ XUÂN TRƯỜNG - Local Preview Server
echo ============================================
echo.
echo Starting server at http://localhost:3000
echo Press Ctrl+C to stop
echo.
cd /d "%~dp0"
start "" http://localhost:3000/index.html
python -m http.server 3000
