# Setting Up MongoDB Authentication for MCP Server

## Current Configuration
The MCP MongoDB server is currently configured to connect without authentication:
```
MONGODB_URI=mongodb://localhost:27017
```

## Adding Authentication

### Step 1: Create MongoDB User

Connect to MongoDB and create a user:

```bash
# Connect to MongoDB
mongosh

# Switch to admin database
use admin

# Create admin user (if not exists)
db.createUser({
  user: "admin",
  pwd: "your_secure_password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Create user for college_portal database
use college_portal
db.createUser({
  user: "mcp_user",
  pwd: "mcp_secure_password",
  roles: [
    { role: "readWrite", db: "college_portal" }
  ]
})
```

### Step 2: Enable MongoDB Authentication

Edit MongoDB configuration (usually `/etc/mongod.conf` or Docker environment):

```yaml
security:
  authorization: enabled
```

Or for Docker, restart with authentication:
```bash
docker compose down
# Add environment variables for auth
docker compose up -d mongo
```

### Step 3: Update MCP Server Configuration

Update `mcp-mongodb/.env`:

```env
MONGODB_URI=mongodb://mcp_user:mcp_secure_password@localhost:27017/college_portal?authSource=college_portal
MONGODB_DATABASE=college_portal
```

**Connection String Format:**
```
mongodb://[username]:[password]@[host]:[port]/[database]?authSource=[authDatabase]
```

## Quick Setup Script

```bash
# Create user via mongosh
mongosh --eval "
use college_portal
db.createUser({
  user: 'mcp_user',
  pwd: 'mcp_secure_password',
  roles: [{ role: 'readWrite', db: 'college_portal' }]
})
"
```

## For Production

For production environments, use:
- Strong passwords
- MongoDB Atlas (cloud) with built-in authentication
- Connection string with SSL/TLS:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/college_portal?retryWrites=true&w=majority
  ```

## Current Status

**No authentication is currently configured** - MongoDB is running in development mode without authentication.

