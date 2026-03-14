@echo off
chcp 65001 >nul
title 智能灯光控制系统
echo.
echo ========================================
echo    智能灯光控制系统 启动中...
echo ========================================
echo.
cd /d "%~dp0"
start http://localhost:5173
npm run dev
pause
