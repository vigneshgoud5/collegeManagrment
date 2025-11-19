#!/bin/bash
# Setup script for MongoDB MCP Server

set -e

echo "🚀 Setting up MongoDB MCP Server..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your MongoDB connection details"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your MongoDB connection details"
echo "2. Start MongoDB: cd .. && ./start-mongo.sh"
echo "3. Run the server: npm start"
echo ""
echo "For development: npm run dev"

