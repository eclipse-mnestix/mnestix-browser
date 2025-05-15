#!/bin/bash

set -e

../../../node_modules/.bin/openapi-generator-cli generate

../../../node_modules/.bin/prettier --write aas/**/*.ts

for patch in $(ls patches/*.patch | sort); do
  echo "Applying patch $patch"
  git apply "$patch"
done