# MongoDB Compass Connection

## Connection URL

Use this connection string to connect to MongoDB using MongoDB Compass:

```
mongodb://vigneshGoud:23831a05a2@localhost:27017/college_portal?authSource=college_portal
```

## How to Connect in MongoDB Compass

1. **Open MongoDB Compass**
2. **Paste the connection string** in the connection field
3. **Click "Connect"**

## Connection Details Breakdown

- **Protocol:** `mongodb://`
- **Username:** `vigneshGoud`
- **Password:** `23831a05a2`
- **Host:** `localhost`
- **Port:** `27017`
- **Database:** `college_portal`
- **Auth Source:** `college_portal`

## Alternative: Manual Connection

If you prefer to enter details manually:

1. Click "Fill in connection fields individually"
2. Enter:
   - **Hostname:** `localhost`
   - **Port:** `27017`
   - **Authentication:** Username / Password
   - **Username:** `vigneshGoud`
   - **Password:** `23831a05a2`
   - **Authentication Database:** `college_portal`
   - **Default Database:** `college_portal`

## Connection Without Authentication (Current Setup)

Since MongoDB is currently running without authentication enabled, you can also connect using:

```
mongodb://localhost:27017/college_portal
```

**Note:** This will work until MongoDB authentication is fully enabled.

## Troubleshooting

- **Connection refused:** Make sure MongoDB is running (`./start-mongo.sh`)
- **Authentication failed:** MongoDB authentication may not be enabled yet
- **Can't connect:** Check if MongoDB is listening on port 27017

