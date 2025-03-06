#!/bin/bash

echo "Sending POST request to the service..."
curl -v POST http://security-submodel:8081/submodels \
    -H "Content-Type: application/json" \
    -d "$(cat initial-submodel.json)"