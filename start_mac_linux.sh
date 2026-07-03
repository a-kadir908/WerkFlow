#!/bin/bash

echo "======== [Starting WerkFlow Setup...] ========"

echo ""
echo "====== [Installing Backend Dependencies...] ======"
cd backend
npm install
cd ..

echo ""
echo "====== [Installing Frontend Dependencies...] ======"
cd frontend
npm install
cd ..

echo ""
echo "======== [Starting Servers...] ========"

echo "====== [Starting Backend Server...] ======"
cd backend
node server.js &
BACKEND_PID=$!
cd ..

echo "====== [Starting Frontend Server...] ======"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Setup complete! Both servers are running in the background."
echo "Press Ctrl+C to stop both servers."

# Wait for user to interrupt, then kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait
