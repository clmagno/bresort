@echo off
echo Starting frontend server...
cd %~dp0frontend
start cmd /k npm run dev -- --host

echo Starting MySQL server...
start cmd /k C:\xampp\mysql\bin\mysqld.exe

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4 Address"') do set ip=%%a
set ip=%ip:~1%

echo Starting backend server...
cd %~dp0backend
start cmd /k python manage.py runserver %ip%:8081