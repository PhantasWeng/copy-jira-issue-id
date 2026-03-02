#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PKG="$ROOT_DIR/package.json"
MANIFEST="$ROOT_DIR/src/manifest.json"

# Read current version from package.json
CURRENT=$(node -p "require('$PKG').version")
echo ""
echo "  Current version: v$CURRENT"
echo ""

# Prompt for new version
read -p "  New version (leave empty to keep v$CURRENT): " NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
  NEW_VERSION="$CURRENT"
  echo "  → Keeping v$CURRENT"
else
  # Strip leading 'v' if user typed it
  NEW_VERSION="${NEW_VERSION#v}"
  echo "  → Updating to v$NEW_VERSION"

  # Update package.json version
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$PKG', 'utf8'));
    pkg.version = '$NEW_VERSION';
    fs.writeFileSync('$PKG', JSON.stringify(pkg, null, 2) + '\n');
  "

  # Update manifest.json version
  node -e "
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync('$MANIFEST', 'utf8'));
    manifest.version = '$NEW_VERSION';
    fs.writeFileSync('$MANIFEST', JSON.stringify(manifest, null, 2) + '\n');
  "
fi

echo ""
echo "  Building production bundle..."
cd "$ROOT_DIR"
cross-env NODE_ENV=production rollup -c

echo ""
echo "  Packaging zip..."
mkdir -p "$ROOT_DIR/releases"
ZIP_NAME="copy-jira-issue-id-v${NEW_VERSION}.zip"
cd "$ROOT_DIR/dist"
zip -r "$ROOT_DIR/releases/$ZIP_NAME" . -x '*.DS_Store'

echo ""
echo "  ✓ releases/$ZIP_NAME"
echo ""
