# Secret Environment Variables

Securely manage authentication and API keys for Mnestix.

## Prerequisites

1. Access to the repository root directory
2. Basic understanding of environment variables

## Setup Instructions

You can (and should) create your personal `.env` file in the root directory.
Simply rename `.env.example` to `.env` and enter your secrets.
The secrets may be arbitrary strings.

This `.env` file will be used automatically by docker compose and Next.js.

```yaml
AD_SECRET_VALUE: '<<YOUR_SECRET>>'
MNESTIX_BACKEND_API_KEY: '<<YOUR_API_KEY>>'
NEXTAUTH_SECRET: '<<YOUR_SECRET>>'
```

> ⚠️ **Important:** If you have not configured these secrets, a public secret will be used as a fallback!

## Related Documentation

- [Keycloak Configuration](Keycloak-Configuration)
- [Mnestix Configuration Settings](Mnestix-Configuration-Settings)
- [Getting Started with Developing](Getting-Started-with-Developing)
