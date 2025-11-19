# Deployment Files in Git

## Files to Add to Git

### Deployment Scripts
- ✅ `deploy.sh` - Main deployment script
- ✅ `update.sh` - Update/restart script
- ✅ `fix-docker-permissions.sh` - Docker permission fix helper
- ✅ `setup-env.sh` - Environment setup script

### Docker Configuration
- ✅ `docker-compose.yml` - Development Docker Compose
- ✅ `docker-compose.prod.yml` - Production Docker Compose

### Documentation
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `DEPLOYMENT_QUICKSTART.md` - Quick deployment reference
- ✅ `ENV_SETUP.md` - Environment setup guide
- ✅ `env.template` - Environment variables template

### Other Files
- ✅ `README.md` - Project documentation
- ✅ `SECURITY.md` - Security documentation

## Files NOT to Add (in .gitignore)

- ❌ `.env` - Contains sensitive secrets
- ❌ `.env.local` - Local environment overrides
- ❌ `node_modules/` - Dependencies
- ❌ `dist/` - Build outputs
- ❌ `build/` - Build outputs

## Git Commands

### Add Deployment Files
```bash
# Add all deployment-related files
git add deploy.sh update.sh fix-docker-permissions.sh setup-env.sh
git add docker-compose.yml docker-compose.prod.yml
git add DEPLOYMENT.md DEPLOYMENT_QUICKSTART.md ENV_SETUP.md env.template
git add README.md SECURITY.md

# Or add all at once
git add *.sh docker-compose*.yml *DEPLOYMENT*.md *ENV*.md env.template README.md SECURITY.md
```

### Commit Changes
```bash
git commit -m "Add deployment scripts and documentation

- Add deploy.sh with Docker Compose v2 support
- Add update.sh for application updates
- Add fix-docker-permissions.sh helper
- Add comprehensive deployment documentation
- Add environment setup guides"
```

### Push to Repository
```bash
git push origin main
# or
git push origin master
```

