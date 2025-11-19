#!/bin/bash

# Update script for College Portal
set -e

echo "🔄 Updating application..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Rebuild and restart services
echo "🔨 Rebuilding services..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "✅ Update complete!"
echo ""
echo "📊 View logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"


