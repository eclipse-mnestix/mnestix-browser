#!/bin/bash

../../../node_modules/.bin/openapi-generator-cli generate

for patch in $(ls patches/*.patch | sort); do
  echo "Applying patch $patch"
  git apply "$patch"
done