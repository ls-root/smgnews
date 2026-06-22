#!/bin/bash
set -e

echo "Building Next.js with standalone output..."
npm run build

if [ ! -d ".next/standalone" ]; then
  echo "Error: .next/standalone not found."
  exit 1
fi

echo "Copying public folder into standalone..."
cp -r public .next/standalone/ 2>/dev/null || echo "   (No public folder found, skipping)"

if [ -f "server.js" ] && [ ! -f ".next/standalone/server.js" ]; then
  cp server.js .next/standalone/
  echo "   Copied custom server.js"
fi

echo "Creating portable tarball..."

cd .next/standalone
tar -czvf ../../smgnews-portable.tar.gz .
cd ../..

SIZE=$(du -h smgnews-portable.tar.gz | cut -f1)
echo "Success! Portable tarball created: smgnews-portable.tar.gz ($SIZE)"
