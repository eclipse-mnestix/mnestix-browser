- **compose.yml** - runs Mnestix Browser in production environment. Production image will be build if not found in local
  Docker Image Cache.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000**

```shell
docker compose up
```

- **docker-compose/compose.frontend.yml** - runs Mnestix Browser with a BaSyx Go environment (unified AAS-Environment backed by PostgreSQL, providing the AAS/Submodel/Concept Description repositories, AAS/Submodel registries and Discovery Service) but without the Mnestix-API.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000**

```shell
docker compose -f docker-compose/compose.frontend.yml up
```

### Override Files

The files listed below
are [override compose files](https://docs.docker.com/compose/multiple-compose-files/merge/), which must be added with
the `-f <filename>` flag (Look inside the `package.json` for examples).<br>
The services are grouped into three [compose profiles](https://docs.docker.com/compose/profiles/): `basyx`, `backend`
and `frontend`.
They can be started together without defining `--profile` or separately by adding `--profile <profilename>` to the
docker command.

- **docker-compose/compose.dev.yml** - override file to run Mnestix Browser in a development environment. A development
  image will be built if it is not found in the local Docker Image Cache.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000** <br>
  **Mnestix AAS Generator on port 5064 - http://localhost:5064** <br>
  **AAS Repo on port 8081 - http://localhost:8081/swagger-ui/index.html**

- **docker-compose/compose.digital-twin-registry.yml** - adds the BaSyx Digital Twin registry instead
  of the AAS Registry, SM Registry and AAS Discovery. These services will be disabled and replaced
  with the Digital Twin Registry service.
  More information can be found [here](https://github.com/eclipse-basyx/basyx-java-server-sdk/tree/main/basyx.aasdigitaltwinregistry)
  or in the [corresponding GitHub Issue](https://github.com/eclipse-mnestix/mnestix-browser/issues/498).
  Run `docker compose -f compose.yml -f docker-compose/compose.digital-twin-registry.yml up` to see it working.

- **docker-compose/compose.test.yml** - override file used to configure and run end-to-end (E2E) tests using Cypress.
  When this file is executed, it will start the necessary services for the application and execute the Cypress tests.
  If any test fails, the results and logs will be saved in a designated directory for further analysis.

- **docker-compose/compose.azure_ad.yml** - override file to activate authentication using Azure Entra ID.
  You will need to provide your own Authentication Endpoint.
  Configuration can be found [here](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Mnestix-Configuration-Settings#using-azure-entra-id).

- **docker-compose/compose.keycloak.yml** - override file to activate authentication using keycloak.
  Configuration can be found [here](keycloak-configuration).<br>
  **keycloak admin page - http://localhost:8080**

- **docker-compose/compose.dynamic-rbac.yml** - override file to activate dynamic role based access control using the
  Basyx security submodel.
  More information can be found [here](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Role-Based-Access-Control).

One example to start the backend in dev mode with authentication:

```shell
docker compose -f compose.yml -f docker-compose/compose.dev.yml -f docker-compose/compose.azure_ad.yml --profile basyx --profile backend up
```

Additional services used by the Mnestix browser:

- **mnestix-aas-generator** - service from the Mnestix ecosystem designed to expand Mnestix Browser functionalities, adding
  AAS List, Template Builder and allowing for the configuration of custom settings such as themes and aasId
  generation. (**On port 5064 - http://localhost:5064/swagger/index.html#/**)
  The former **Mnestix API** has been split into the [Mnestix Proxy](https://github.com/eclipse-mnestix/mnestix-proxy/wiki)
  and the [Mnestix AAS Generator](https://github.com/eclipse-mnestix/mnestix-aas-generator/wiki); see their wikis for details.

  > **Note:** The BaSyx Go environment requires **Mnestix AAS Generator >= 1.3.0** for compatibility. See the
  > [Migrate to AAS Generator 1.3.0](https://github.com/eclipse-mnestix/mnestix-aas-generator/wiki/Migrate-to-aas-generator-1.3.0) guide.
- **basyx-db** - PostgreSQL database used by the BaSyx Go environment to store AAS and Submodel data
- **basyx-configuration** - one-shot service (`eclipsebasyx/basyxconfigurationservice-go`) that initializes the PostgreSQL schema before the environment starts
- **aas-environment** - unified BaSyx Go environment (`eclipsebasyx/aasenvironment-go`) that serves the AAS repository,
  Submodel repository, Concept Description repository, AAS/Submodel registries and Discovery Service from a single service
  (BaSyx component [aas-environment](https://github.com/eclipse-basyx/basyx-go-sdk))

### Additional Command to view the logs for specific service:

```sh
docker compose -f compose.yml logs <service-name>
```

**Info:** For Keycloak setup instructions, please refer to the [Keycloak configuration](#keycloak-configuration)
section.

### Existing images in dockerhub

Our Docker images are available on Docker Hub [Mnestix Browser](https://hub.docker.com/r/mnestix/mnestix-browser)
and [Mnestix AAS Generator](https://hub.docker.com/r/mnestix/mnestix-aas-generator). You can pull the images using the following commands:

#### To pull a specific version, use the version tag:

```sh
docker pull mnestix/mnestix-browser:tag
```

```sh
docker pull mnestix/mnestix-aas-generator:latest
```
