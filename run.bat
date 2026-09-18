@echo off
title Dr. Chandana's 23rd Birthday Website
echo ==========================================================
echo   Dr. Chandana's 23rd Birthday Celebration Website
echo ==========================================================
echo Opening http://localhost:8080 ...
start http://localhost:8080
python -m http.server 8080
pause
