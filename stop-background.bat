@echo off
echo Stopping CareerTrack background process...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo CareerTrack process (PID %%a) stopped.
)
echo Done.
pause
