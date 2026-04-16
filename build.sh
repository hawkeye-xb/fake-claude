#!/bin/bash
set -e

echo "🚀 One-click build for fake-claude"
echo ""

# 检查依赖
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found"
  exit 1
fi

if ! command -v bun &> /dev/null; then
  echo "⚠️  bun not found — will build Node.js source only"
  echo "   Install bun (https://bun.sh) for standalone binaries"
  echo ""
fi

# 安装依赖
echo "📦 Installing dependencies..."
npm install

# 一键构建 + 发布
echo ""
echo "🔨 Building and releasing..."
npm run release

echo ""
echo "✅ Build complete! Binary files are in release/"
