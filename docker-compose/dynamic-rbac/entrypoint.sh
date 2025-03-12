#!/bin/bash

CLIENT_ID="$CLIENT_ID"
CLIENT_SECRET="$CLIENT_SECRET"

TOKEN_URL="http://keycloak:8080/realms/Mnestix/protocol/openid-connect/token"
BODY="client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&grant_type=client_credentials&scope=openid"

# Fetch the OAuth2 token
ACCESS_TOKEN=$(curl -X POST $TOKEN_URL -d $BODY -H "Content-Type: application/x-www-form-urlencoded" | jq -r .access_token)

# Check if the access token was retrieved
if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to obtain access token. Exiting."
    exit 1
fi

# Export the token as an environment variable
export ACCESS_TOKEN

echo "Sending POST request to the service..."
curl -v POST http://security-submodel:8081/submodels \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$(cat initial-submodel.json)"
    