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
