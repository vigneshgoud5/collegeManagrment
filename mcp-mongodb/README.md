# MongoDB MCP Server

A production-ready MongoDB Model Context Protocol (MCP) server that enables AI assistants to interact with MongoDB databases.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Aggregation pipeline support
- ✅ Collection management
- ✅ Connection pooling and error handling
- ✅ TypeScript with full type safety
- ✅ Production-ready configuration

## Installation

```bash
cd mcp-mongodb
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=college_portal
```

## Development

```bash
# Run in development mode (with watch)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Available Tools

### `mongodb_query`
Query documents from a collection.

**Parameters:**
- `collection` (string, required): Collection name
- `filter` (object, optional): MongoDB filter
- `limit` (number, optional): Max documents to return
- `sort` (object, optional): Sort order
- `projection` (object, optional): Field selection

**Example:**
```json
{
  "collection": "users",
  "filter": { "role": "student" },
  "limit": 10,
  "sort": { "createdAt": -1 }
}
```

### `mongodb_insert`
Insert documents into a collection.

**Parameters:**
- `collection` (string, required)
- `documents` (array, required): Documents to insert

### `mongodb_update`
Update documents in a collection.

**Parameters:**
- `collection` (string, required)
- `filter` (object, required): Match criteria
- `update` (object, required): Update operations
- `upsert` (boolean, optional): Create if not exists
- `multi` (boolean, optional): Update multiple

### `mongodb_delete`
Delete documents from a collection.

**Parameters:**
- `collection` (string, required)
- `filter` (object, required): Match criteria
- `multi` (boolean, optional): Delete multiple

### `mongodb_aggregate`
Run aggregation pipeline.

**Parameters:**
- `collection` (string, required)
- `pipeline` (array, required): Aggregation stages

### `mongodb_list_collections`
List all collections in the database.

### `mongodb_collection_stats`
Get collection statistics.

**Parameters:**
- `collection` (string, required)

## Usage with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": ["/path/to/mcp-mongodb/dist/index.js"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017",
        "MONGODB_DATABASE": "college_portal"
      }
    }
  }
}
```

## Security Considerations

- ⚠️ **Never expose this server to untrusted networks**
- ⚠️ **Use authentication in MongoDB connection string**
- ⚠️ **Limit database permissions to necessary operations**
- ⚠️ **Validate and sanitize all inputs**

## License

MIT

