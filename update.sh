#!/bin/bash

# Update script for College Portal
set -e

echo "🔄 Updating application..."

# Detect Docker Compose command (v2 uses 'docker compose', v1 uses 'docker-compose')
if docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif docker-compose --version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Error: Docker Compose not found!"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Rebuild and restart services
echo "🔨 Rebuilding services..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d --build

echo "✅ Update complete!"
echo ""
echo "📊 View logs:"
echo "   $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f"


