> **Note:** Keycloak support is available starting from version 1.1.0 and above.
>
> For Mnesitx API configuration details, please refer to the API documentation available
> on [Docker Hub](https://hub.docker.com/r/mnestix/mnestix-api).

### Setting Up Keycloak for Docker Development

To start Mnestix along with Keycloak as the authorization server, use one of the following commands:

```sh
docker compose -f compose.yml -f docker-compose/compose.keycloak.yml up -d
```

or, alternatively:

```sh
yarn docker:keycloak
```

On the first startup, the Keycloak Docker image (`docker-compose/data/keycloak/Dockerfile`) will be built with an
initializer configured for the BaSyx repository.
This setup ensures that localhost can be resolved within the Docker network. Additionally, a preconfigured Keycloak
realm (`docker-compose/data/keycloak/realm/Mnestix-realm.json`) will be imported,
eliminating the need for any initial Keycloak configuration.

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

- **Local Development:** This variable should be left empty when running Mnestix in a local browser environment.
- **Docker Environment:** When running in a Docker environment, set this variable to `localhost:8080` to enable user
  credential input. In Docker, the token, user info, and other endpoints will function correctly within the Docker
  network.

`NEXTAUTH_URL`: Required variable to configure redirect URL for NextAuth.

`NEXTAUTH_SECRET`: Required variable used to encrypt the NextAuth.js JWT, and to hash email verification tokens.

> ⚠️ **Important:** Ensure that you update any confidential variables from their default values before deploying to a
> production environment.
