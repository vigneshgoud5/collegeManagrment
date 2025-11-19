#!/bin/bash

# Script to fix Docker permissions
set -e

echo "🔧 Fixing Docker permissions..."

CURRENT_USER=$(whoami)

echo "Current user: $CURRENT_USER"
echo ""

# Check if user is already in docker group
if groups | grep -q docker; then
    echo "✅ User is already in docker group"
    echo "   You may need to logout and login again, or run: newgrp docker"
    echo ""
    echo "   Try running: newgrp docker"
    echo "   Then test with: docker ps"
else
    echo "❌ User is NOT in docker group"
    echo ""
    echo "To fix this, run the following command:"
    echo "   sudo usermod -aG docker $CURRENT_USER"
    echo ""
    echo "Then either:"
    echo "   1. Logout and login again"
    echo "   2. OR run: newgrp docker"
    echo ""
    read -p "Do you want to add user to docker group now? (requires sudo) [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Adding user to docker group..."
        sudo usermod -aG docker $CURRENT_USER
        echo ""
        echo "✅ User added to docker group!"
        echo ""
        echo "⚠️  IMPORTANT: You need to either:"
        echo "   1. Logout and login again"
        echo "   2. OR run: newgrp docker"
        echo ""
        echo "After that, test with: docker ps"
    else
        echo "Skipped. Please run manually:"
        echo "   sudo usermod -aG docker $CURRENT_USER"
        echo "   newgrp docker"
    fi
fi

