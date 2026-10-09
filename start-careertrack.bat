@echo off
title CareerTrack - Job & Application Tracker
echo ====================================================
echo Starting CareerTrack (SQLite Backend + React UI)...
echo ====================================================
cd /d "%~dp0"
echo Opening in browser: http://localhost:5173
start http://localhost:5173
npm run dev
pause
