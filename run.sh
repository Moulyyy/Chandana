#!/usr/bin/env bash

# Dr. Chandana's 23rd Birthday Experience - Local Server Runner
PORT=${1:-8080}

echo "=========================================================="
echo "  🎂 Dr. Chandana's 23rd Birthday Celebration Website"
echo "=========================================================="
echo "Starting local server at http://localhost:$PORT ..."
echo "Press Ctrl+C to stop the server."
echo "=========================================================="

if command -v python3 &>/dev/null; then
    python3 -m http.server "$PORT"
elif command -v python &>/dev/null; then
    python -m http.server "$PORT"
elif command -v npx &>/dev/null; then
    npx serve -l "$PORT" .
elif command -v php &>/dev/null; then
    php -S "localhost:$PORT"
else
    echo "Error: Neither Python, Node (npx), nor PHP found. Please install Python to run the server."
    exit 1
fi
