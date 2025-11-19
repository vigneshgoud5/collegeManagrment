#!/bin/bash
# Script to stop MongoDB container

echo "Stopping MongoDB container..."
cd "$(dirname "$0")"

if sudo docker compose stop mongo; then
    echo "✅ MongoDB stopped successfully!"
else
    echo "❌ Failed to stop MongoDB"
    exit 1
fi

