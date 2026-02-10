#!/bin/bash

echo "Build process started..."

# 1. Para e remove containers, redes e volumes órfãos definidos no compose
echo "Removing old containers and networks..."
docker compose down --remove-orphans

# 2. Limpa imagens 'dangling' (camadas inúteis que ficam após o rebuild)
echo "Removing old images..."
docker image prune -f

# 3. Sobe o ambiente construindo a imagem do Spring novamente
echo "Building applications..."
# docker-compose up --build --no-cache -d
docker compose build --no-cache
docker compose up -d

echo "Build finished!"
echo "(press Ctrl+C to skip logs, containers keep running):"
docker compose logs -f app-backend