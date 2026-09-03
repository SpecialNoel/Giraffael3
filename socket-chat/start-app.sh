#!/bin/bash

# Start Redis if haven't already
if ! brew services list | grep -q "redis.*started"; then
  echo "Starting Redis..."
  brew services start redis
else
  echo "Redis already running"
fi

# Run the server of the application; change NODE_ENV to "production" if in production
NODE_ENV=development node -r dotenv/config ./index.js