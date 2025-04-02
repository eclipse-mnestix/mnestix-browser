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
RESPONSE=$(curl -s -o response_body.txt -w "%{http_code}" -X POST http://security-submodel:8081/submodels \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$(cat initial-submodel.json)")

if [ "$RESPONSE" -eq 201 ]; then
    echo "Request succeeded with status code $RESPONSE."
elif [ "$RESPONSE" -eq 409 ]; then
    echo "Request succeeded with status code $RESPONSE. The submodel might already be initialized."
    echo Response body:
    cat response_body.txt
else
    echo "Request failed with status code $RESPONSE."
    echo Response body:
    cat response_body.txt
    exit 1
fi

rm -f response_body.txt