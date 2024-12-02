<p align="right">
  <picture>
    <source srcset="src/assets/XitasoLogo.svg"  media="(prefers-color-scheme: dark)">
    <img src="src/assets/XitasoLogoBlack.svg" width=20%>
  </picture>
</p>
<p align="center">
 <img src="public/android-chrome-192x192.png" alt="Mnestix Logo">
</p>
<h1 style="text-align: center">Mnestix</h1>

[![Made by XITASO](https://img.shields.io/badge/Made_by_XITASO-005962?style=flat-square)](https://xitaso.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-005962.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![Yarn License](https://img.shields.io/badge/YARN-V1.22.22-005962?style=flat-square)]()
[![Join our Community](https://img.shields.io/badge/Join_our_Community-005962?style=flat-square)](https://xitaso.com/kompetenzen/mnestix/#support)

### Welcome to the Mnestix Community!

Mnestix Browser is an open source software designed to simplify the implementation of the Asset Administration Shell.
Together
with increasing contributions from users and developers, a growing community is working on further development under the
leadership of XITASO, a leading high-end software development company in the engineering industry.
Mnestix Browser is the perfect tool to demonstrate the power and potential of AAS (**Asset Administration Shells**) for
the
implementation of standardized digital twins. It opens the way for use cases such as the Digital Product Passport (DPP).

You can find a demo [here](https://mnestix-prod.azurewebsites.net/).
Some screenshots can be found in the [screenshots folder](screenshots).

### **If you need support feel free to contact us through our website [here](https://xitaso.com/kompetenzen/mnestix/#support).**

## Quickstart

All you need to start your first Mnestix instance is the `compose.yml` (or clone the repository).
In the root directory run the following command and open http://localhost:3000 in your web browser.

```shell
docker compose up
```

If you want to further configure your mnestix instance, read about [configuration](#mnestix-configuration-settings).

## Getting started with developing

### Development technologies

- Next.js

### Prerequisites

Before you begin, ensure you have the following tools installed on your system:

1. **Node.js**

2. **Yarn**

3. **Docker**: Docker is required to create and run the application containers.

    - [Install Docker](https://docs.docker.com/get-docker/)

4. **Docker Compose**: Docker Compose is a tool for defining and running multi-container Docker applications.
    - [Install Docker Compose](https://docs.docker.com/compose/install/)

Windows users may use WSL for their docker instance.

### Run Mnestix as Complete AAS Application

The easiest way to get Mnestix up and running is by using the prepared development environment.
This setup includes:

- Mnestix Browser (This repository)
- Mnestix Backend
- BaSyx Repository
- BaSyx Discovery Service
- BaSyx Registry
- BaSyx Submodel Registry

To start all mentioned services together, run the following command:

```shell
yarn docker:dev
```

This will build the Mnestix Browser and start all mentioned services with a default configuration, to adapt this setup
have a look at [configuration](#mnestix-configuration-settings).
The Mnestix Browser is now running on http://localhost:3000.

### Run Mnestix through IDE

If you want to start the browser through your IDE separately start BaSyx and the backend with

```shell
yarn docker:backend
```

In your IDE you can then simply start the dev environment with hot reloading by running

```shell
yarn dev
```

The Mnestix Browser is now running on http://localhost:3000 and will update on changed files.

If you want to activate debug breakpoints in the code, you may have to open the website through a debug environment:

- In `JetBrains WebStorm` you can run a debug browser with the `JS Debug` run configuration.
- In `Visual Studio Code` you can set up a debug browser by creating a `launch.json` file in the `Run and Debug` tab and
  create a run configuration for your preferred browser.

You may need to set the initial URL to http://localhost:3000.

### Other launch options

To check what other options exist to run the Mnestix Browser, see the yarn scripts in `package.json`. Highlights are:

- `yarn dev` to start the browser in a hot reloading dev environment.
- `yarn prettier`, `yarn format` and `yarn lint` to apply code formatting and linting.
- `yarn test` and `yarn test:headless` to run cypress tests locally.
- `yarn docker:prod` will build everything with the production flag.
- `yarn docker:test` will run all tests in the docker environment.
- `yarn docker:prune` will stop all docker containers, remove them from the list and prune all volumes. Start with a
  blank slate :)
- `yarn docker:keycloak` will setup a local keycloak instance and start Mnestix with keycloak support enabled

## Secret environment variables

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

## Docker Compose files

- **compose.yml** - runs Mnestix Browser in production environment. Production image will be build if not found in local
  Docker Image Cache.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000**
  <br><br>

- **docker-compose/compose.dev.yml** - override file to run Mnestix Browser in a development environment. A development
  image will be built if it is not found in the local Docker Image Cache.<br>
  **Mnestix Browser on port 3000 - http://localhost:3000** <br>
  **Mnestix Api on port 5064 - http://localhost:5064** <br>
  **AAS Repo on port 8081 - http://localhost:8081/swagger-ui/index.html** <br><br>

- **docker-compose/compose.test.yml** - override file used to configure and run end-to-end (E2E) tests using Cypress.
  When this file is executed, it will start the necessary services for the application and execute the Cypress tests.
  If any test fails, the results and logs will be saved in a designated directory for further analysis.<br><br>

- **docker-compose/compose.azure_ad.yml** - override file to activate authentication using Azure Entra ID.
  You will need to provide your own Authentication Endpoint.
  Configuration can be found [here](#using-azure-entra-id).<br><br>

- **docker-compose/compose.keycloak.yml** - override file to activate authentication using keycloak.
  Configuration can be found [here](#keycloak-configuration).<br>
  **keycloak admin page - http://localhost:8080**

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

### Install Mnestix Browser from local build

Install all packages for the frontend.

```sh
yarn install
```

### Upload your first AAS

We provide a simple AAS in the folder **test-data** which you can use as a first test AAS.
You can upload the `.aasx` file to your BaSyx repository by using the upload endpoint of BaSyx (check
`http://localhost:8081/swagger-ui/index.html` and search for the `/upload` endpoint to get more information).  
Afterward, you can visit your running Mnestix Browser and search for the AAS ID `https://vws.xitaso.com/aas/mnestix` to
visualize the test AAS.

## Feature Overview

The Mnestix Browser enables you to browse through the different AAS Dataspaces.
It allows you to **visualize Asset Administration Shells and their submodels**. It supports the AAS Metamodel and API in
version 3.

You configure the endpoint of an AAS repository and browse the different AAS, if a Discovery Service is available, it is
also possible to search for AssetIds and visualize the corresponding AAS.

Mnestix AAS Browser is also **optimized for mobile view** to have a **great user experience** on mobile phones.

Mnestix can **visualize every submodel** even if it is not standardized by IDTA. There are some submodels **visualized
in an extra user-friendly manner**. These are:

- Digital Nameplate
- Handover Documentation
- Carbon Footprint
- **and more!**

Moreover, dedicated visualizations for submodels can be added as a further feature.

## Use Mnestix

### Personalization

It is possible to change the look and feel by setting a theme color and a personal logo when deploying the Mnestix
Browser, see [here](#how-to-set-a-custom-logo).

### BaSyx API

- Mnestix is using BaSyx, by appending /repo to our URLs, we are forwarding the requests to BaSyx via
  proxy: [BaSyx AAS API Collection](https://app.swaggerhub.com/apis/Plattform_i40/Entire-API-Collection/V3.0#/Asset%20Administration%20Shell%20Repository%20API/GetAssetAdministrationShellById)
- With this, BaSyx endpoints can be reached through Mnestix.
    - AAS Repository Api: http://localhost:3000/repo/shells/{YourAasIdInBase64}
    - Submodel Repository Api: http://localhost:3000/repo/submodels/{YourAasIdInBase64}
    - The BaSyx Swagger UI gives a detailed overview of all available
      endpoints: http://localhost:8081/swagger-ui/index.html

## Mnestix Configuration Settings

### Frontend Configuration

Mnestix provides the following configuration options. You can adapt the values in your docker compose file.

| Name                                  | Default value               | Description                                                                                                                                                                                                                        | required |
|---------------------------------------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `DISCOVERY_API_URL`                   |                             | Address of the Discovery Service to find an AAS for an Asset                                                                                                                                                                       | required |
| `REGISTRY_API_URL`                    |                             | Address of the AAS Registry Service to retrieve the related descriptor for an AAS                                                                                                                                                  | optional |
| `SUBMODEL_REGISTRY_API_URL`           |                             | Address of the Submodel Registry Service to retrieve the related descriptor for a Submodel                                                                                                                                         | optional |
| `AAS_REPO_API_URL`                    |                             | Default AAS Repository to display when AAS Id is not in AAS Registry                                                                                                                                                               | required |
| `SUBMODEL_REPO_API_URL`               |                             | Default Submodel Repository to display when Submodel Id is not in Submodel Registry                                                                                                                                                | required |
| `MNESTIX_BACKEND_API_URL`             |                             | Mnestix Backend with a lot of business comfort features like the Repository-Proxy or the Template builder                                                                                                                          | optional |
| `AAS_LIST_FEATURE_FLAG`               | false                       | Enables or disables the AasList in the frontend. This only works in combination with `Features__AllowRetrievingAllShellsAndSubmodels` being set to `true` (Needs the Mnestix Backend to work)                                      | optional |
| `TRANSFER_FEATURE_FLAG`               | false                       | Enables or disables the Transfer Feature in the frontend. If enabled, it is possible to import a viewed AAS to a configured repository. This feature is currently being developed.                                                 | optional |
| `AUTHENTICATION_FEATURE_FLAG`         | false                       | Enable or disable the authentication in the frontend. (Needs the Mnestix Backend to work)                                                                                                                                          | optional |
| `COMPARISON_FEATURE_FLAG`             | false                       | Enables or disables the comparison feature.                                                                                                                                                                                        | optional |
| `LOCK_TIMESERIES_PERIOD_FEATURE_FLAG` | false                       | Enables or disables the selection of the timerange in the TimeSeries submodel.                                                                                                                                                     | optional |
| `THEME_PRIMARY_COLOR`                 | Mnestix Primary Color       | Changes the primary color of Mnestix Browser, e.g. #00ff00. The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()                                                                              | optional |
| `THEME_SECONDARY_COLOR`               | Mnestix Secondary Color     | Changes the secondary color of Mnestix Browser, e.g. #0d2. The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()                                                                               | optional |
| `THEME_LOGO_MIME_TYPE`                |                             | Used in parsing the logo mounted `-v /path/to/logo:/app/public/logo` the mime type is needed, e.g. `image/svg+xml`, `image/png`, `image/jpg`                                                                                       | optional |
| `THEME_LOGO_URL`                      |                             | This variable **overwrites** the Logo in the theme, and thus the environment variable `THEME_LOGO_MIME_TYPE` will not be evaluated and it is not necessary to mount the image as specified below                                   | optional |
| `KEYCLOAK_ENABLED`                    | false                       | By default, it is set to false, meaning Keycloak authentication will be disabled, and the default authentication method will be Azure Entra ID. If you set this variable to true, Keycloak authentication will be enabled instead. | optional |
| `KEYCLOAK_CLIENT_ID`                  | mnestix-browser-client-demo | Configuration variable that specifies the client unique identifier used by your application when connecting to the Keycloak server.                                                                                                | optional |
| `KEYCLOAK_ISSUER`                     |                             | Configuration variable that specifies the URL of the Keycloak servers issuer endpoint. This endpoint provides the base URL for the Keycloak server that issues tokens and handles authentication requests                          | optional |
| `KEYCLOAK_LOCAL_URL`                  |                             | Optional configuration variable specifically used for development environments within Docker. This allows your application to connect to a Keycloak instance running in a Docker container                                         | optional |
| `KEYCLOAK_REALM`                      | BaSyx                       | Configuration variable that specifies the name of the Keycloak realm your application will use for authentication and authorization.                                                                                               | optional |

### How to set a custom logo

There are multiple ways to set a logo, you can either use Option 1 or Option 2:

#### Option 1

First you need to mount your logo to the container, e.g. by adding it to the docker compose file

```yaml
environment:
  - THEME_LOGO_MIME_TYPE: 'image/svg+xml'
---
volumes:
  - /path/to/my/logo.svg:/app/public/logo
```

When using the provided [`compose.yaml` File](compose.yml) you can just replace the [image in the
`data` folder](docker-compose/data/logo.svg) with your preferred logo.

Remember to set the mime type correctly in order for the browser to parse your image correctly.
Only image mime types are allowed.
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

#### Option 2

This version overwrites the previous settings, you can either use one or the other.
To use this just set an environment variable to a link hosted that is publicly accessible:

```yaml

---
environment:
  THEME_LOGO_URL: https://xitaso.com/wp-content/uploads/XITASO-Logo-quer.svg
```

### Using Azure Entra ID

> **You will need your own AzureAD authentication service!**

You can activate authentication with Azure Entra ID by starting the Mnestix docker container with the
`-f docker-compose/compose.azure_ad.yml` flag.
Please configure the tenant ID in both services and both client IDs for your own authentication service in this file.

Use the .env file to configure your sensitive information:

```yaml
AD_SECRET_VALUE: '<<YOUR_SECRET>>'
```

**Note (Mnestix version 1.1.0 and above):** With NextAuth, authentication now happens server-side. You'll need an Azure
Secret `AD_SECRET_VALUE` for secure server-side communication, unlike the previous client-side SPA setup.

> ⚠️ **Important:** Ensure that you update any confidential variables from their default values before deploying to a
> production environment.

#### Development

If you want to start the browser with Next.js and Azure authentication directly, take a look at the `.env.local` file
and update the environment variables mentioned above in there.
Notably, the following flags must be set `AUTHENTICATION_FEATURE_FLAG: true` and `KEYCLOAK_ENABLED: false`.

### Using the Mnestix Backend

> Without specifying your own API key, Mnestix will use the default 'verySecureApiKey'!

To have the full functionality of the Mnestix Browser you can configure the environment variables for the mnestix-api
service in the `compose.yml` file.
It is also necessary to set `MNESTIX_BACKEND_API_KEY`.
This may be any string and acts as your password for the backend api service and the repo proxy.
This can be done directly in the `compose.yml` or by defining the environment variable in your `.env` file:

```yaml
MNESTIX_BACKEND_API_KEY: '<<YOUR_API_KEY>>'
```

### Retrieval of AAS and Submodels?

#### Concept

The **Discovery Service** enables Mnestix to find all AASs that belong to one Asset.
We are standard conform but recommend the usage of
the [BaSyx Implementation of the Discovery Service](https://github.com/eclipse-basyx/basyx-java-server-sdk/tree/main/basyx.aasdiscoveryservice).

The **AAS Registry** is designed to retrieve AAS Descriptors that contain the endpoint for the **Asset Administration
Shell (AAS) Interface**.

[<img src=".images/overview_api.png" width="300"/>](https://industrialdigitaltwin.org/wp-content/uploads/2023/07/2023-07-27_IDTA_Tutorial_V3.0-Specification-AAS-Part-2_API.pdf)\
(
Source: [IDTA](https://industrialdigitaltwin.org/wp-content/uploads/2023/07/2023-07-27_IDTA_Tutorial_V3.0-Specification-AAS-Part-2_API.pdf))

A tutorial about the Discovery Service along with the registries can be
found [on the IDTA website](https://industrialdigitaltwin.org/wp-content/uploads/2023/07/2023-07-27_IDTA_Tutorial_V3.0-Specification-AAS-Part-2_API.pdf).

### How to connect Mnestix Browser to the different components

#### Running Mnestix with its API

There also exists the [Mnestix API](https://hub.docker.com/r/mnestix/mnestix-api), that provides different business
comfort features.
Here it is possible to set an API Key, for example, to secure your backend services like the repository or the discovery
service.
When running the [Mnestix API](https://hub.docker.com/r/mnestix/mnestix-api) you can change the paths to the different
services like described in the [Mnestix API Documentation](https://hub.docker.com/r/mnestix/mnestix-api).
For example (change `{{MNESTIX_BACKEND_API_URL}}` to the URL of the
running [Mnestix API](https://hub.docker.com/r/mnestix/mnestix-api))

```yaml
DISCOVERY_API_URL: '{{MNESTIX_BACKEND_API_URL}}/discovery'
AAS_REPO_API_URL: '{{MNESTIX_BACKEND_API_URL}}/repo'
SUBMODEL_REPO_API_URL: '{{MNESTIX_BACKEND_API_URL}}/repo'
MNESTIX_BACKEND_API_URL: '{{MNESTIX_BACKEND_API_URL}}'
```

#### Running Mnestix without its API

This is the easiest configuration, for when you only want to visualize and browse through AAS.
If you choose to run the Mnestix Browser without the Mnestix API, the Feature Flags `AUTHENTICATION_FEATURE_FLAG`
and `AAS_LIST_FEATURE_FLAG` will be overwritten to `false` as these Features use the functionality of the API.
The other environment variables should be configured [as described](#frontend-configuration).

#### How to configure the BaSyx AAS Repository

We recommend the usage of Mnestix together with
the [BaSyx AAS Repository](https://github.com/eclipse-basyx/basyx-java-server-sdk).
This component stores all the different AAS (type 2), it is recommended to configure it to use a database for
persistence.
We recommend to set the following environment variables (replace `{{MNESTIX VIEWER URL}}, {{MNESTIX API URL}}` with the
corresponding values):

```yaml
# Allow to upload bigger AASX files
SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE: 100000KB
SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE: 100000KB
# Allow mnestix frontend and backend to call basyx
BASYX_CORS_ALLOWED-ORIGINS: '{{MNESTIX VIEWER URL}}, {{MNESTIX API URL}}'
BASYX_CORS_ALLOWED-METHODS: GET,POST,PATCH,DELETE,PUT,OPTIONS,HEAD
```

If you are using the Mnestix API see [here](#running-mnestix-with-its-api) on how to set the Frontend Flags.
If you are using only the Mnestix Browser just set the environment variables `AAS_REPO_API_URL` and
`SUBMODEL_REPO_API_URL` accordingly.

#### How to configure the BaSyx Discovery Service

We recommend the usage of Mnestix together with
the [BaSyx AAS Discovery Service](https://github.com/eclipse-basyx/basyx-java-server-sdk/tree/main/basyx.aasdiscoveryservice).
This component links Asset IDs to AAS IDs. It is recommended to configure it to use a database for persistence.
We recommend to set the following environment variables (replace `{{MNESTIX VIEWER URL}}, {{MNESTIX API URL}}` with the
corresponding values):

```yaml
# Allow mnestix frontend and backend to call discovery service
BASYX_CORS_ALLOWED-ORIGINS: '{{MNESTIX VIEWER URL}}, {{MNESTIX API URL}}'
BASYX_CORS_ALLOWED-METHODS: GET,POST,PATCH,DELETE,PUT,OPTIONS,HEAD
```

If you are using the Mnestix API see [here](#running-mnestix-with-its-api) on how to set the Frontend Flags.
If you are using only the Mnestix Browser just set the environment variable `DISCOVERY_API_URL` accordingly.

#### Technical Information - Discovery Service

The functions that are described in
the [Specification AAS - Part 2: API](https://industrialdigitaltwin.org/wp-content/uploads/2023/06/IDTA-01002-3-0_SpecificationAssetAdministrationShell_Part2_API_.pdf)
were implemented in the [`discoveryServiceApi.ts`](src/lib/api/discovery-service-api/discoveryServiceApi.ts).
They make the respective `GET`, `POST` and `DELETE` requests to the specified `DISCOVERY_API_URL`.
Two additional functions were added that simplify the usage of the Discovery Service by just requiring the globalAssetId
and no additional AssetLinks.

These functions are `LinkAasIdAndAssetId(aasId: string, assetId: string)` and `GetAasIdsByAssetId(assetId: string)`.
The return of all functions is the response from the Discovery Service parsed as an object.
So they can be used like in the example below:

```typescript
await LinkAasIdAndAssetId(aasId, assetId);
const foundAasIds = (await discoveryServiceClient.GetAasIdsByAssetId(assetId)).result;
```

#### How to configure the BaSyx AAS Registry Service

The AAS Registry Service is designed to provide descriptors for Asset Administration Shells (AAS),
including endpoints to various repositories that may be stored elsewhere.
This architecture ensures support for multiple repositories, provided they are registered in the designated AAS
registry.

When an AAS for the specified AAS-Id is found, it is displayed in the detail view. If the AAS is not found,
the service will search in the local repository for the requested information.

If the discovery service is configured, it will initially identify the relevant AAS-ID for the searched Asset ID before
querying the Registry Service.
Configuration of the Registry Service is optional. If the AAS Registry Service is not configured, the search will
default to the local repository.

To configure the AAS registry, please provide the URL in the Frontend Configuration variables.

```yaml
REGISTRY_API_URL: '{{REGISTRY-SERVICE-URL}}'
```

By setting the REGISTRY_API_URL, you enable the AAS Registry Service, ensuring efficient retrieval of AAS descriptors.

#### How to configure the BaSyx Submodel Registry Service

The Submodel Registry feature provides an optional configuration that allows you to manage and resolve submodels
efficiently.
When the Submodel Registry is configured, any reference to a submodel will first check if the submodel is available in
the specified registry endpoint.
If the submodel is found in the registry, it will be fetched from there. If the submodel is not found in the registry,
the system will then check the local repository for the submodel.

Configuring the Submodel Registry is optional. If not configured, all submodel references will default to being resolved
from the local repository only.

To configure the Submodel registry, please provide the URL in the Frontend Configuration variables.

```yaml
SUBMODEL_REGISTRY_API_URL: '{{SUBMODEL_REGISTRY_API_URL}}'
```

By setting the SUBMODEL_REGISTRY_API_URL, you enable the Submodel Registry Service, ensuring efficient retrieval of
Submodel descriptors.

#### Technical Information - Registry Service

The functions that are described in
the [Specification AAS - Part 2: API](https://industrialdigitaltwin.org/wp-content/uploads/2023/06/IDTA-01002-3-0_SpecificationAssetAdministrationShell_Part2_API_.pdf)
were implemented in the [`registryServiceApi.ts`](src/lib/api/registry-service-api/registryServiceApi.ts).
They make the respective `GET`, `POST` and `DELETE` requests to the specified `REGISTRY_API_URL`.

### Different Mnestix Configurations

There are multiple scenarios possible on how to deploy the Mnestix Browser with different configurations.
In the following, it is described, what scenarios were thought of and how to configure them

#### I want to only view AAS

If you just want to view AAS and integrate it into your existing environment, you can run only the `mnestix-viewer`
without its API.
See [Running Mnestix without its API](#Running-Mnestix-without-its-API).

#### I want to use more advanced features

There are also some more advanced features one might want to use.
For this you need to enable the Mnestix API, see [here](#running-mnestix-with-its-api).
It enables you to secure all `POST/PATCH/DELETE`-Request with an API-Key.
The API-Key needs to be sent within the Header `ApiKey` to make those requests.
Normal `GET/FETCH`-Requests are not affected by this.

When using it is also possible to restrict some functions that you possibly don't want to be accessible.
For example, it is possible to restrict the access to the `/shells` endpoint of the AAS repository by setting the
backend environment variable `Features__AllowRetrievingAllShellsAndSubmodels: false`.
Remember that this also means that the functionality to list all AAS won't work anymore in the Mnestix Browser, so
disable this functionality with the environment variable `AAS_LIST_FEATURE_FLAG: false`.

One can also add an AzureAD Service to give people deeper access, this enables the "Login" Button in the Mnestix
Browser.
After logging in, users have access to even more functionality.
To see how to connect to an Azure Tenant and enable the login functionality see
the [official Mnestix API documentation](https://hub.docker.com/r/mnestix/mnestix-api).

#### I want to create multiple AAS

This option builds upon the advanced features described in
the [previous section](#i-want-to-use-more-advanced-features).
After logging in it is possible to configure the ID Generation Functionality of the backend.
Here it is possible to automatically generate AAS using only a short ID of the Asset.
How the AAS Creator in conjunction with the ID Generations Functionality works can be seen in
the [official Mnestix API documentation](https://hub.docker.com/r/mnestix/mnestix-api).

One can also use the Template Builder with the Data Ingest Endpoint to send arbitrary JSON files to the API and
automatically add them to a specified AAS.
This enables easy integration into existing ETL processes.
How exactly this works can be seen in
the [official Mnestix API documentation](https://hub.docker.com/r/mnestix/mnestix-api).

Below you'll find a small overview on how the components interact with each other:
![Overview of all Mnestix Functionality](https://xitaso.com/wp-content/uploads/final_LP_Desktop_Mnestix_AAS_0424_cor.svg)

## Maintaining

### Setting up VSCode

#### Extensions

See `.vscode/extensions.json` for a list of recommended extensions.
VSCode will suggest to install them when opening the project.

#### Settings

See `.vscode/settings.json` for defined workspace settings.

### Setting up Rider

Check the configurations for Rider under `.idea/` folder

### Installing and adding/removing frontend packages

### Formatting & Linting

We use Prettier and ESLint to keep our frontend code clean. Having a ESLint warning **will break the pipeline**. It's
therefore always a good idea to run `yarn format` and `yarn lint` before you commit.

#### Run prettier check

```sh
yarn prettier
```

#### Run prettier (be aware, this changes files!)

```sh
yarn format
```

#### Check your code for formatting issues

```sh
yarn lint
```

If you want specific files or folders to be excluded from linting (e.g. generated files), you can add them
to `.eslintignore` and `.prettierignore`

### Cypress Testing

We use Cypress for End-to-End-Testing. In order to navigate to the right folder and run Cypress you can use the
following command. In order to use cypress testing the Mnestix Browser must be running.

#### Open the cypress application

```sh
yarn test
```

#### Run cypress headless (runs all tests inside the integration folder)

```sh
yarn test:headless
```

Cypress will put videos and screenshots of the tests inside the cypress folder.

In order to run your own E2E-Tests you can put your test files in `/cypress/e2e`.

In the `fixtures` folder you can put data to use in your E2E-Tests as json files.

If you have commands you want to use in multiple tests you can put them into the `commands.ts` file inside
the `support` folder.
Don't forget to write the method header of your custom commands inside the `e2e.ts` file as well. This way the IDE
will stop marking your custom commands as wrong.

### Reverse Proxy Configuration

The YARP proxy route `/repo/shells` now limits resource and list returns to 104 elements due to the lack of pagination
support.
This change aims to prevent server overload and ensure smoother navigation through resource lists.

## Keycloak Configuration

> **Note:** Keycloak support is available starting from version 1.1.0 and above.
>
> For Mnesitx API configuration details, please refer to the API documentation available
> on [Docker Hub](https://hub.docker.com/r/mnestix/mnestix-api).

### Setting Up Keycloak for Docker Development

To start Mnestix along with Keycloak as the authorization server, use one of the following commands:

```sh
docker compose -f compose.yml -f docker-compose/compose.dev.yml -f docker-compose/compose.keycloak.yml up -d
```

or, alternatively:

```sh
yarn docker:keycloak
```

On the first startup, the Keycloak Docker image (`docker-compose/data/keycloak/Dockerfile`) will be built with an
initializer configured for the BaSyx repository.
This setup ensures that localhost can be resolved within the Docker network. Additionally, a preconfigured Keycloak
realm (`docker-compose/data/keycloak/realm/BaSyx-realm.json`) will be imported,
eliminating the need for any initial Keycloak configuration.

The Keycloak Admin Console will be accessible at [http://localhost:8080/admin](http://localhost:8080/admin).

For initial access, use the following temporary credentials:

- **Username:** admin
- **Password:** admin

A test user is preconfigured with the following credentials allowing login to Mnestix Browser:

- **Username:** test
- **Password:** test

### Configuration variables for keycloak setup

`KEYCLOAK_LOCAL_URL`:

- **Local Development:** This variable should be left empty when running Mnestix in a local browser environment.
- **Docker Environment:** When running in a Docker environment, set this variable to `localhost:8080` to enable user
  credential input. In Docker, the token, user info, and other endpoints will function correctly within the Docker
  network.

`NEXTAUTH_URL`: Required variable to configure redirect URL for NextAuth.

`NEXTAUTH_SECRET`: Required variable used to encrypt the NextAuth.js JWT, and to hash email verification tokens.

> ⚠️ **Important:** Ensure that you update any confidential variables from their default values before deploying to a
> production environment.

## Contributing

Right now, we are building a community around Mnestix.
If you are looking for a way to support us, you can start contributing to Mnestix right away.
For this purpose, issues which are particularly suitable for a first contribution are labeled with the tag
`good first issue`.  
If this is your first time contributing to a eclipse project, we recommend having a look at this
guide: [Contributing to a Eclipse project](https://www.eclipse.org/contribute/).  
We would be more than happy to have you onboard. If there is anything you want to know, feel free to contact
us [mnestix@xitaso.com](mailto:mnestix@xitaso.com) or through our website [here](https://xitaso.com/kompetenzen/mnestix/#support).   
