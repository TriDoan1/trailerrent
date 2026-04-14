#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Running lint..."
npm run lint

echo "Running typecheck..."
npm run typecheck

echo "Running build..."
npm run build

if [[ ! -d "$ROOT_DIR/out" ]]; then
  echo "Build validation failed: expected $ROOT_DIR/out to exist." >&2
  exit 1
fi

echo "Build validation passed: $ROOT_DIR/out exists."
