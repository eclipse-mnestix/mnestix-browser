- **compose.yml** - runs Mnestix Browser in production environment. Production image will be build if not found in local
  Docker Image Cache.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000**

- **docker-compose/compose.frontend.yml** - runs Mnestix Browser with a Basyx environment (AAS-Environment with MongoDB, Discovery Service, AAS/Submodel Registry) but without the Mnestix-API.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000**

- **docker-compose/compose.dev.yml** - override file to run Mnestix Browser in a development environment. A development
  image will be built if it is not found in the local Docker Image Cache.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000** <br>
  **Mnestix Api on port 5064 - http://localhost:5064** <br>
  **AAS Repo on port 8081 - http://localhost:8081/swagger-ui/index.html**

- **docker-compose/compose.test.yml** - override file used to configure and run end-to-end (E2E) tests using Cypress.
  When this file is executed, it will start the necessary services for the application and execute the Cypress tests.
  If any test fails, the results and logs will be saved in a designated directory for further analysis.

- **docker-compose/compose.azure_ad.yml** - override file to activate authentication using Azure Entra ID.
  You will need to provide your own Authentication Endpoint.
  Configuration can be found [here](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Mnestix-Configuration-Settings#using-azure-entra-id).

- **docker-compose/compose.keycloak.yml** - override file to activate authentication using keycloak.
  Configuration can be found [here](keycloak-configuration).<br>
  **keycloak admin page - http://localhost:8080**

- **docker-compose/compose.dynamic.rbac.yml** - override file to activate dynamic role based access control using the 
  Basyx security submodel.
  More information can be found [here](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Role-Based-Access-Control).

The files in the `docker-compose` directory
are [override compose files](https://docs.docker.com/compose/multiple-compose-files/merge/), which must be added with
the `-f <filename>` flag (Look inside the `package.json` for examples).<br>
The services are grouped into three [compose profiles](https://docs.docker.com/compose/profiles/): `basyx`, `backend`
and `frontend`.
They can be started together without defining `--profile` or separately by adding `--profile <profilename>` to the
docker command.
One example to start the backend in dev mode with authentication:

```shell
docker compose -f compose.yml -f docker-compose/compose.dev.yml -f docker-compose/compose.azure_ad.yml --profile basyx --profile backend up
```

Additional services used by the Mnestix browser:

- **mnestix-api** - API service from the Mnestix ecosystem designed to expand Mnestix Browser functionalities, adding
  AAS List, Template Builder and allowing for the configuration of custom settings such as themes and aasId
  generation. (**On port 5054 - http://localhost:5064/swagger/index.html#/**)
- **mongodb** - NoSql database to store data
- **aas-environment** - service of AAS repository (BaSyx
  component [aas-environment](https://github.com/eclipse-basyx/basyx-java-server-sdk/tree/main/basyx.aasenvironment))
- **aas-registry** - registry to register and search for AAS in multiple repositories
- **submodel-registry** - registry to register and search for submodels in multiple repositories
- **aas-discovery** - discovery service to register and search for an AAS by assetId

### Additional Command to view the logs for specific service:

```sh
docker compose -f compose.yml logs <service-name>
```

**Info:** For Keycloak setup instructions, please refer to the [Keycloak configuration](#keycloak-configuration)
section.

### Existing images in dockerhub

Our Docker images are available on Docker Hub [Mnestix Browser](https://hub.docker.com/r/mnestix/mnestix-browser)
and [Mnestix Api](https://hub.docker.com/r/mnestix/mnestix-api). You can pull the images using the following commands:

#### To pull a specific version, use the version tag:

```sh
docker pull mnestix/mnestix-browser:tag
```

```sh
docker pull mnestix/mnestix-api:latest
```