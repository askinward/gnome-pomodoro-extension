#!/bin/bash

# =================================================================
# GNOME Pomodoro Extension Installer
# This script handles directory creation, file deployment, 
# and metadata generation for the pomodoro-timer@askinward extension.
# =================================================================

set -e

# Configuration
UUID="pomodoro-timer@askinward"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$UUID"

echo "------------------------------------------"
echo "🚀 Installing Pomodoro Timer Extension"
echo "------------------------------------------"

# 1. Validation
if [ ! -f "extension.js" ]; then
    echo "❌ Error: extension.js not found in the current directory."
    echo "   Please run this script from inside the repository folder."
    exit 1
fi

# 2. Prepare Directory
echo "📂 Preparing extension directory..."
if [ -d "$EXTENSION_DIR" ]; then
    echo "   (Removing existing version...)"
    rm -rf "$EXTENSION_DIR"
fi
mkdir -p "$EXTENSION_DIR"

# 3. Copy Files
echo "📄 Copying extension.js..."
cp extension.js "$EXTENSION_DIR/"

# 4. Generate Metadata
# We generate this dynamically to ensure the UUID matches the folder name exactly.
echo "📝 Generating metadata.json..."
cat > "$EXTENSION_DIR/metadata.json" << EOF
{
  "name": "Pomodoro Timer",
  "description": "A minimalist Pomodoro timer with adjustable durations and no forced breaks.",
  "uuid": "$UUID",
  "shell-version": [
    "45", "46", "47", "48", "49"
  ],
  "version": 1,
  "url": "https://github.com/askinward/gnome-pomodoro-extension"
}
EOF

echo "✅ Files installed to: $EXTENSION_DIR"

# 5. Activation
echo "🔧 Attempting to enable extension..."
# We suppress errors here because it might fail if the shell hasn't been restarted yet
gnome-extensions enable "$UUID" 2>/dev/null || true

echo ""
echo "------------------------------------------"
echo "🎉 Installation Complete!"
echo "------------------------------------------"
echo "To finish, you MUST restart GNOME Shell:"
echo ""
echo "  • X11: Press Alt+F2, type 'r', and press Enter."
echo "  • Wayland: Log out and log back in."
echo ""
echo "After restarting, the timer will appear in your top panel."
echo "------------------------------------------"