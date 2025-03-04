#!/bin/bash

LOCK_FILE="/workspace/.devcontainer/.lock"

touch "$LOCK_FILE"

echo "Installing Node dependencies..."
npm install

echo "Building the project..."
npm run build

rm -f "$LOCK_FILE"
