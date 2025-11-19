#!/bin/bash
# Script to set up MongoDB authentication for MCP server

set -e

echo "🔐 Setting up MongoDB authentication..."

# Check if MongoDB is running
if ! docker ps | grep -q mongo; then
    echo "❌ MongoDB container is not running. Starting it..."
    ./start-mongo.sh
    sleep 3
fi

# Generate a secure password
MCP_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Generated password: $MCP_PASSWORD"
echo ""

# Create user in MongoDB
echo "Creating MongoDB user 'mcp_user'..."
docker exec -i $(docker ps -q -f name=mongo) mongosh --quiet <<EOF
use college_portal
try {
  db.createUser({
    user: "mcp_user",
    pwd: "$MCP_PASSWORD",
    roles: [
      { role: "readWrite", db: "college_portal" }
    ]
  })
  print("✅ User 'mcp_user' created successfully")
} catch (e) {
  if (e.code === 51003) {
    print("⚠️  User 'mcp_user' already exists. Updating password...")
    db.updateUser("mcp_user", {
      pwd: "$MCP_PASSWORD",
      roles: [
        { role: "readWrite", db: "college_portal" }
      ]
    })
    print("✅ Password updated for 'mcp_user'")
  } else {
    throw e
  }
}
EOF

# Update .env file
echo ""
echo "📝 Updating mcp-mongodb/.env file..."
cd mcp-mongodb

# Backup existing .env
cp .env .env.backup 2>/dev/null || true

# Update MONGODB_URI with credentials
cat > .env <<EOF
MONGODB_URI=mongodb://mcp_user:${MCP_PASSWORD}@localhost:27017/college_portal?authSource=college_portal
MONGODB_DATABASE=college_portal
MCP_SERVER_NAME=mongodb-server
MCP_SERVER_VERSION=1.0.0
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2
MONGODB_CONNECT_TIMEOUT_MS=30000
MONGODB_SOCKET_TIMEOUT_MS=45000
EOF

echo "✅ Configuration updated!"
echo ""
echo "📋 MongoDB Authentication Details:"
echo "   Username: mcp_user"
echo "   Password: $MCP_PASSWORD"
echo "   Database: college_portal"
echo ""
echo "⚠️  IMPORTANT: Save this password securely!"
echo "   It's been saved in: mcp-mongodb/.env"
echo ""
echo "⚠️  Note: MongoDB container needs to be restarted with authentication enabled"
echo "   for this to work. Currently, MongoDB is running without auth."
echo ""
echo "To enable authentication, you'll need to:"
echo "1. Stop MongoDB: docker compose stop mongo"
echo "2. Update docker-compose.yml to enable auth"
echo "3. Restart MongoDB with auth enabled"

