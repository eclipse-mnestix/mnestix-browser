> **Note:** Keycloak support is available starting from version 1.1.0 and above.
>
> For Mnesitx API configuration details, please refer to the API documentation available
> on [Docker Hub](https://hub.docker.com/r/mnestix/mnestix-api).

### Setting Up Keycloak for Docker Development

> **How hostnames work (hostname v2):** Keycloak is configured with `KC_HOSTNAME: http://localhost:8080` plus
> `KC_HOSTNAME_BACKCHANNEL_DYNAMIC: 'true'`. The browser reaches Keycloak directly at `http://localhost:8080`
> (the published port), so **no `/etc/hosts` entry is needed**. The token issuer (`iss`) is therefore
> `http://localhost:8080/realms/Mnestix`. In-network backend services keep calling Keycloak at `http://keycloak:8080`;
> `backchannel-dynamic` makes Keycloak return the token/JWKS endpoint URLs for that internal host, so the backends can
> fetch signing keys while still accepting the `localhost` issuer. (The end-to-end test stack in
> `docker-compose/compose.test.yml` instead uses `KC_HOSTNAME: http://keycloak:8080`, because there the browser is the
> in-network Cypress container rather than a browser on the host.)

To start Mnestix along with Keycloak as the authorization server, use one of the following commands:

```sh
docker compose -f compose.yml -f docker-compose/compose.keycloak.yml up -d
```

or, alternatively:

```sh
yarn docker:keycloak
```

The stack uses the official `keycloak/keycloak:26.6.3` image directly (no custom build step). A preconfigured Keycloak
realm (`docker-compose/data/keycloak/realm/Mnestix-realm.json`) is imported on startup, eliminating the need for any
initial Keycloak configuration.

The Keycloak Admin Console will be accessible at [http://localhost:8080/admin](http://localhost:8080/admin).

The preconfigured realm ships with the following accounts:

| Username          | Password  | Login target             | Notes                                                                                                                                                       |
|-------------------|-----------|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `admin`           | `admin`   | Keycloak Admin Console    | Temporary admin credentials for the Keycloak Admin Console itself — not a Mnestix Browser login.                                                             |
| `test`            | `test`    | Mnestix Browser           | The `mnestix-admin` role is **not** assigned by default. See [Role Based Access Control](Role-Based-Access-Control) for details.                             |
| `test-admin`      | `admin`   | Mnestix Browser           | Has the `mnestix-admin` role assigned. **Not** an admin account for the Keycloak Admin Console.                                                              |
| `mnestix-visitor` | `mnestix` | Mnestix Browser (RBAC demo) | Access limited to a single Asset Administration Shell (AAS) with the ID `https://vws.xitaso.com/aas/mnestix`.                                                |
| `test-aas`        | `aas`     | Mnestix Browser (RBAC demo) | Can view AAS data but has no permission to access submodel data.                                                                                             |

**Note:** The `test`, `test-admin`, `mnestix-visitor`, and `test-aas` accounts exist solely for testing purposes and to showcase the RBAC implementation.

### Configuration Variables for Keycloak Setup

`KEYCLOAK_LOCAL_URL`:

- **Local Development:** This variable should be left empty when running Mnestix directly in a local browser
  environment (outside Docker).
- **Docker Environment:** This is the URL the browser is redirected to for login. In the dev compose files it is set to
  `http://localhost:8080`, which the browser can reach on the published port without any hosts-file changes. Backend
  services still talk to Keycloak at `http://keycloak:8080` over the Docker network (resolved dynamically via
  `KC_HOSTNAME_BACKCHANNEL_DYNAMIC`).

`NEXTAUTH_URL`: Required variable to configure redirect URL for NextAuth.

`NEXTAUTH_SECRET`: Required variable used to encrypt the NextAuth.js JWT, and to hash email verification tokens.

> ⚠️ **Important:** Ensure that you update any confidential variables from their default values before deploying to a
> production environment.
