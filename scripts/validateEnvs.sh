#!/bin/sh
set -euo pipefail

# Validate that required env vars are set and non-empty
require_env() {
    key="$1"
    if [ -z "${!key:-}" ]; then
        echo "Error: $key is required when certain flags are enabled"
        exit 1
    fi
}

if [ "${KEYCLOAK_ENABLED:-}" = "true" ]; then
    for key in KEYCLOAK_ISSUER KEYCLOAK_LOCAL_URL KEYCLOAK_REALM KEYCLOAK_CLIENT_ID NEXTAUTH_SECRET; do
        require_env "$key"
    done
fi

if [ "${AUTHENTICATION_FEATURE_FLAG:-}" = "true" ]; then
    if [ "${KEYCLOAK_ENABLED:-}" != "true" ]; then
        echo "Error: Keycloak must be configured when AUTHENTICATION_FEATURE_FLAG is true"
        exit 1
    fi
fi

if [ "${USE_BASYX_RBAC:-}" = "true" ]; then
    for key in AUTHENTICATION_FEATURE_FLAG KEYCLOAK_ENABLED; do
        if [ "${!key:-}" != "true" ]; then
            echo "Error: $key must be 'true' when USE_BASYX_RBAC is true"
            exit 1
        fi
    done
    require_env "SEC_SM_API_URL"
fi

echo "Configuration valid."
