#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting build process..."

# Step 1: Clean previous builds
echo "Cleaning up previous builds..."
rm -rf dist
mkdir dist

# Step 2: Install dependencies
echo "Installing dependencies..."
npm install

# Step 3: Transpile the code (assuming TypeScript or Babel is used)
echo "Building the project..."
if [ -f "tsconfig.json" ]; then
    npx tsc
elif [ -f ".babelrc" ]; then
    npx babel src --out-dir dist
else
    echo "No build configuration found. Skipping transpilation."
fi

# Step 4: Copy other necessary files (e.g., package.json, README.md)
echo "Copying essential files..."
cp package.json dist/
cp README.md dist/ || echo "No README.md found."
cp LICENSE dist/ || echo "No LICENSE found."

echo "Build completed successfully."
