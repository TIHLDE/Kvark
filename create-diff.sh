#!/bin/bash

# https://megatops.github.io/PatchViewer
echo "Creating patch file..."
git diff dev refactor/react-router-v7 -- :\!pnpm-lock.yaml | grep -v "import .*" > changes.patch

echo "Filtering out import statements..."
bun run index.ts