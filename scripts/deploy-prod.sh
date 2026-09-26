#!/usr/bin/env bash

set -Eeuo pipefail

IMAGE_TAG="${1:?Usage: $0 <image-tag>}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Environment file not found: $ENV_FILE"
  exit 1
fi

export IMAGE_TAG

echo "Deploying Gym..."
echo "Image tag: $IMAGE_TAG"

docker compose \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  pull

docker compose \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  up \
  -d \
  --no-build \
  --remove-orphans \
  --wait \
  --wait-timeout 120

docker compose \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  ps

echo "Deployment finished: $IMAGE_TAG"