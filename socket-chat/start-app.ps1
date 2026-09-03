#!/bin/bash

# Start Redis in WSL if it isn't already running
if ! wsl redis-cli ping >/dev/null 2>&1; then
    echo "Starting Redis..."
    wsl sudo service redis-server start
else
    echo "Redis already running"
fi

# Run the server of the application
echo "Starting Node server..."
NODE_ENV=development node -r dotenv/config ./index.js