#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
OUTDIR="release"

echo "Building fake-claude v${VERSION}..."
echo ""

# Clean
rm -rf "$OUTDIR"
mkdir -p "$OUTDIR"

# TypeScript compile (for Node.js source release)
npx tsc

# Source release (for users with Node.js)
tar -czf "${OUTDIR}/fake-claude-v${VERSION}-source.tar.gz" \
  bin/ dist/ package.json README.md LICENSE
echo "  source     -> ${OUTDIR}/fake-claude-v${VERSION}-source.tar.gz"

# Standalone binaries via bun (no Node.js needed)
if command -v bun &> /dev/null; then
  echo ""
  echo "Compiling standalone binaries..."

  # macOS ARM64 (Apple Silicon)
  bun build --compile --minify src/index.ts --outfile "${OUTDIR}/fake-claude-darwin-arm64" 2>&1 | tail -1
  echo "  darwin-arm64  -> ${OUTDIR}/fake-claude-darwin-arm64"

  # macOS x86_64 (Intel)
  bun build --compile --minify --target=bun-darwin-x64 src/index.ts --outfile "${OUTDIR}/fake-claude-darwin-x64" 2>&1 | tail -1
  echo "  darwin-x64    -> ${OUTDIR}/fake-claude-darwin-x64"

  # Linux x86_64
  bun build --compile --minify --target=bun-linux-x64 src/index.ts --outfile "${OUTDIR}/fake-claude-linux-x64" 2>&1 | tail -1
  echo "  linux-x64     -> ${OUTDIR}/fake-claude-linux-x64"

  # Linux ARM64
  bun build --compile --minify --target=bun-linux-arm64 src/index.ts --outfile "${OUTDIR}/fake-claude-linux-arm64" 2>&1 | tail -1
  echo "  linux-arm64   -> ${OUTDIR}/fake-claude-linux-arm64"

  # Compress binaries
  echo ""
  echo "Compressing..."
  cd "$OUTDIR"
  for f in fake-claude-darwin-arm64 fake-claude-darwin-x64 fake-claude-linux-x64 fake-claude-linux-arm64; do
    gzip -k "$f"
    SIZE=$(ls -lh "${f}.gz" | awk '{print $5}')
    echo "  ${f}.gz  (${SIZE})"
  done
  cd ..

  echo ""
  echo "Done! Release artifacts in ${OUTDIR}/:"
  ls -lh "${OUTDIR}"/*.gz "${OUTDIR}"/*.tar.gz
else
  echo ""
  echo "bun not found — skipping standalone binaries."
  echo "Install bun (https://bun.sh) to build standalone executables."
  echo ""
  echo "Done! Source release: ${OUTDIR}/fake-claude-v${VERSION}-source.tar.gz"
fi

echo ""
echo "Upload these to GitHub Releases: https://github.com/hawkeye-xb/fake-claude/releases/new"
