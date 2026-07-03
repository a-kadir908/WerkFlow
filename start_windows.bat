@echo off
echo ======== [Starting WerkFlow Setup...] ========

echo.
echo ====== [Installing Backend Dependencies...] ======
cd backend
call npm install
cd ..

echo.
echo ====== [Installing Frontend Dependencies...] ======
cd frontend
call npm install
cd ..

echo.
echo ======== [Starting Servers...] ========

echo Starting Backend Server in a new window...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Starting Frontend Server in a new window...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ============
echo Setup complete! Both servers are now running in separate windows.
echo ============
echo.
echo You can close this window now.
pause