#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${ENV_FILE:-${PROJECT_ROOT}/.env.prod}"
REQUESTED_TAG="${1:-}"

if [[ -z "${REQUESTED_TAG}" ]]; then
  echo "Usage: $0 <tag>"
  echo "Example: $0 v1.0.1"
  exit 1
fi

if [[ ! "${REQUESTED_TAG}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid tag: ${REQUESTED_TAG}"
  echo "Expected format: v1.0.0"
  exit 1
fi

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

IMAGE_TAG="${REQUESTED_TAG}"
IMAGE_REPOSITORY="${BACKEND_IMAGE_REPOSITORY:-eduardo0987/gym-backend}"
IMAGE_NAME="${IMAGE_REPOSITORY}:${IMAGE_TAG}"

echo "Building backend image ${IMAGE_NAME}..."
docker build --target prod -t "${IMAGE_NAME}" "${PROJECT_ROOT}/backend"

echo "Pushing backend image ${IMAGE_NAME}..."
docker push "${IMAGE_NAME}"

echo "Backend image published: ${IMAGE_NAME}"
