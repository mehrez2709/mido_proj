@echo off
REM Simple script to start a local web server for the dashboard (Windows)

echo Starting local web server...
echo Open your browser to: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first, then Python 2
python -m http.server 8000 2>nul
if errorlevel 1 (
    python -m SimpleHTTPServer 8000
    if errorlevel 1 (
        echo Python not found. Please install Python or use: npx http-server
        pause
        exit /b 1
    )
)

