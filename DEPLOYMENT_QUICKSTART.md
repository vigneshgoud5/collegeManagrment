# Quick Deployment Guide

## Issue Fixed: Docker Compose Command

The deployment scripts now automatically detect and use the correct Docker Compose command:
- **Docker Compose v2**: Uses `docker compose` (with space)
- **Docker Compose v1**: Uses `docker-compose` (with hyphen)

## Quick Deploy Commands

### 1. Setup Environment
```bash
./setup-env.sh
```

### 2. Deploy Application
```bash
./deploy.sh
```

## Docker Permission Issue

If you see "permission denied" errors, fix it with one of these options:

### Option 1: Add user to docker group (Recommended)
```bash
sudo usermod -aG docker $USER
# Then logout and login again, or run:
newgrp docker
```

### Option 2: Use sudo (Not recommended for production)
```bash
sudo ./deploy.sh
```

## Manual Commands (if scripts don't work)

### For Docker Compose v2 (modern):
```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml down
```

### For Docker Compose v1 (legacy):
```bash
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml down
```

## Verify Docker Compose Version

```bash
# Check which version you have
docker compose version
# OR
docker-compose --version
```

