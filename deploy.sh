#!/bin/bash

# Deployment script for College Portal
set -e

echo "🚀 Starting deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and configure it:"
    echo "   cp .env.example .env"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$JWT_ACCESS_SECRET" ] || [ -z "$JWT_REFRESH_SECRET" ]; then
    echo "❌ Error: JWT secrets not set in .env file!"
    echo "🔐 Generate secrets with:"
    echo "   openssl rand -base64 32"
    exit 1
fi

# Build and start services
echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Test API health endpoint
echo "🔍 Testing API health..."
sleep 5
if curl -f http://localhost:${SERVER_PORT:-3000}/api/health > /dev/null 2>&1; then
    echo "✅ API is healthy!"
else
    echo "⚠️  API health check failed. Check logs with:"
    echo "   docker-compose -f docker-compose.prod.yml logs server"
fi

echo "✅ Deployment complete!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend: http://localhost:${CLIENT_PORT:-80}"
echo "   Backend:  http://localhost:${SERVER_PORT:-3000}/api"
echo ""
echo "📊 View logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose -f docker-compose.prod.yml down"


