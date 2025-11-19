# MongoDB MCP Server Credentials

## Authentication Details

**Username:** `vigneshGoud`  
**Password:** `23831a05a2`  
**Database:** `college_portal`  
**Role:** `readWrite`

## Connection String

```
mongodb://vigneshGoud:23831a05a2@localhost:27017/college_portal?authSource=college_portal
```

## Important Notes

⚠️ **Current Status:** MongoDB user has been created, but MongoDB itself is still running **without authentication enabled**.

This means:
- The user exists in the database
- But MongoDB will accept connections without authentication
- To fully enable authentication, MongoDB needs to be restarted with auth enabled

## To Enable Full Authentication

1. **For Docker setup**, update `docker-compose.yml`:
   ```yaml
   mongo:
     image: mongo:7
     command: mongod --auth
     environment:
       MONGO_INITDB_ROOT_USERNAME: admin
       MONGO_INITDB_ROOT_PASSWORD: admin_password
   ```

2. **Restart MongoDB:**
   ```bash
   sudo docker compose restart mongo
   ```

3. **Test connection:**
   ```bash
   cd mcp-mongodb
   npm start
   ```

## Security Recommendations

- ✅ Change the default password in production
- ✅ Use environment variables for sensitive data
- ✅ Enable MongoDB authentication in production
- ✅ Use SSL/TLS for remote connections
- ✅ Restrict network access to MongoDB

