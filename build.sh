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

# Copying essential files
echo "Copying essential files..."

# Create the directory for the package
mkdir -p winslogify

# Copy necessary files to the new directory, handling missing files
cp package.json winslogify/
cp README.md winslogify/ || echo "No README.md found."
cp LICENSE winslogify/ || echo "No LICENSE found."

# Only copy dist if it exists
if [ -d "dist" ]; then
    mv dist winslogify/
else
    echo "No dist dir found."
fi

# Change to the winslogify directory
cd winslogify

# Remove the "scripts" section from package.json using sed
sed -i '/"scripts": {/ , /}/d' package.json

echo "Essential files copied and 'scripts' section removed from package.json."



echo "Build completed successfully."
