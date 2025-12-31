#!/bin/bash

# Pomodoro Extension Installation Script
# This script installs/updates the Pomodoro GNOME extension

set -e

EXTENSION_UUID="pomodoro-timer@local"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

echo "========================================="
echo "Pomodoro Timer Extension Installer"
echo "========================================="
echo ""

# Check if extension.js exists in current directory
if [ ! -f "extension.js" ]; then
    echo "Error: extension.js not found in current directory!"
    echo "Please make sure extension.js is in the same folder as this script."
    exit 1
fi

# Create extension directory
echo "Creating extension directory..."
mkdir -p "$EXTENSION_DIR"

# Copy extension.js
echo "Copying extension.js..."
cp extension.js "$EXTENSION_DIR/extension.js"

# Create metadata.json
echo "Creating metadata.json..."
cat > "$EXTENSION_DIR/metadata.json" << 'EOF'
{
  "name": "Pomodoro Timer",
  "description": "A simple Pomodoro timer with custom durations",
  "uuid": "pomodoro-timer@local",
  "shell-version": [
    "45",
    "46",
    "47",
    "48",
    "49"
  ],
  "version": 1
}
EOF

echo ""
echo "Files installed successfully!"
echo ""
echo "Extension installed to: $EXTENSION_DIR"
echo ""

# Enable the extension
echo "Enabling extension..."
gnome-extensions enable "$EXTENSION_UUID" 2>/dev/null || echo "Note: You may need to restart GNOME Shell first"

echo ""
echo "========================================="
echo "Installation complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Restart GNOME Shell:"
echo "   - On X11: Press Alt+F2, type 'r', press Enter"
echo "   - On Wayland: Log out and log back in"
echo ""
echo "2. The Pomodoro timer should appear in your top panel"
echo ""
echo "If it doesn't appear, enable it manually:"
echo "   gnome-extensions enable pomodoro-timer@local"
echo ""