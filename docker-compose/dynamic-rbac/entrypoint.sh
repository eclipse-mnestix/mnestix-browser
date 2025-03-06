#!/bin/bash

echo "Sending POST request to the service..."
curl -v POST http://submodel-repository:8081/submodels \
    -H "Content-Type: application/json" \
    -d "$(cat initial-submodel.json)"