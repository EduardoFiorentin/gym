#!/bin/bash

# 1. Para e remove containers, redes e volumes órfãos definidos no compose
echo "Removing old containers and networks..."
docker compose down --remove-orphans

# 2. Limpa imagens 'dangling' (camadas inúteis que ficam após o rebuild)
echo "Removing old images..."
docker image prune -f
