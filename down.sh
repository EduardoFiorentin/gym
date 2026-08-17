#!/bin/bash
set -e

ENVIRONMENT="${1:-dev}"
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"
ENV_FILE=".env.${ENVIRONMENT}"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

echo "Removing ${ENVIRONMENT} containers and networks..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down --remove-orphans
