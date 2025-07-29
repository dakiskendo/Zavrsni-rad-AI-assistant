@echo off
start cmd /k "npm start"
timeout /t 3
start http://localhost:3000