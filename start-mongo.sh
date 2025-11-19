#!/bin/bash
# Script to start MongoDB using Docker Compose

echo "Starting MongoDB container..."
cd "$(dirname "$0")"

if sudo docker compose up -d mongo; then
    echo "✅ MongoDB started successfully!"
    echo ""
    echo "Waiting for MongoDB to be ready..."
    sleep 3
    
    if sudo docker ps | grep -q mongo; then
        echo "✅ MongoDB is running on port 27017"
        echo ""
        echo "You can now start your Node.js server:"
        echo "  cd server && npm run dev"
    else
        echo "❌ MongoDB container failed to start"
        exit 1
    fi
else
    echo "❌ Failed to start MongoDB"
    echo ""
    echo "Make sure Docker is installed and running:"
    echo "  sudo systemctl status docker"
    exit 1
fi

