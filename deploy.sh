#!/bin/bash

echo "Build process started..."

echo "Removing old containers and networks..."
docker compose down --remove-orphans

echo "Removing old images..."
docker image prune -f

echo "Building applications..."
# docker-compose up --build --no-cache -d
docker compose build --no-cache
docker compose up -d

echo "Build finished!"
echo "(press Ctrl+C to skip logs, containers keep running):"
docker compose logs -f app-backend
