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

For initial access of the Keycloak Admin Console, use the following temporary credentials:

- **Username:** admin
- **Password:** admin

A test user is preconfigured with the following credentials allowing login to Mnestix Browser:

- **Username:** test
- **Password:** test  
  The role 'mnestix-admin' is not assigned to this test user by default. More information regarding Role Based Access
  Control
  can be found [here](Role-Based-Access-Control)

To access Mnestix as a test admin user, an additional account has been configured with the 'mnestix-admin' role. The
login credentials for this account are as follows:

- **Username:** test-admin
- **Password:** admin

**Note:** This is not an admin account for accessing the Keycloak Admin Console.

Additionally, two more test users have been configured to demonstrate role-based access control (RBAC):

- **'mnestix-visitor'**: This user has access to only a specific Asset Administration Shell (AAS) with the ID **"https://vws.xitaso.com/aas/mnestix"**.
    - **Username:** mnestix-visitor
    - **Password:** mnestix

- **'test-aas'**: This user can view AAS data but does not have permission to access submodel data.
    - **Username:** test-aas
    - **Password:** aas

**Note:** These accounts are created solely for testing purposes and to showcase the RBAC implementation.

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
