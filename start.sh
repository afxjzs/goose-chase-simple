#!/bin/bash

# Kill any existing Next.js process on port 3000
echo "Killing any existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No processes found on port 3000"

# Wait a moment for the port to be freed
sleep 2

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
	echo "Installing dependencies..."
	npm install
fi

# Start the development server
echo "Starting Chicago Venues Map app on port 3000..."
npm run dev
