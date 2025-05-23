#!/bin/bash
# This script generates the OpenAPI client code and applies patches to it.
# We use patches to quickly fix the generated code without changing the openapi-spec.
# Create patches with `git diff > patches/$INDEX-patch_name.patch`

set -e

cd "$(dirname "$0")"

../../../node_modules/.bin/openapi-generator-cli generate

../../../node_modules/.bin/prettier --write aas/**/*.ts

for patch in $(ls patches/*.patch | sort); do
  echo "Applying patch $patch"
  git apply "$patch"
done