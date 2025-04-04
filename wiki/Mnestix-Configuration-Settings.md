### Frontend Configuration

Mnestix provides the following configuration options. You can adapt the values in your docker compose file.

| Name                                  | Default value               | Description                                                                                                                                                                                                                        | required |
| ------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
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
| `THEME_PRIMARY_COLOR`                 | Mnestix Primary Color       | Changes the primary color of Mnestix Browser, e.g. '#00ff00'. The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()                                                                            | optional |
| `THEME_SECONDARY_COLOR`               | Mnestix Secondary Color     | Changes the secondary color of Mnestix Browser, e.g. '#0d2'. The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()                                                                             | optional |
| `THEME_LOGO_MIME_TYPE`                |                             | Used in parsing the logo mounted `-v /path/to/logo:/app/public/logo` the mime type is needed, e.g. `image/svg+xml`, `image/png`, `image/jpg`                                                                                       | optional |
| `THEME_LOGO_URL`                      |                             | This variable **overwrites** the Logo in the theme, and thus the environment variable `THEME_LOGO_MIME_TYPE` will not be evaluated and it is not necessary to mount the image as specified below                                   | optional |
| `KEYCLOAK_ENABLED`                    | false                       | By default, it is set to false, meaning Keycloak authentication will be disabled, and the default authentication method will be Azure Entra ID. If you set this variable to true, Keycloak authentication will be enabled instead. | optional |
| `KEYCLOAK_CLIENT_ID`                  | mnestix-browser-client-demo | Configuration variable that specifies the client unique identifier used by your application when connecting to the Keycloak server.                                                                                                | optional |
| `KEYCLOAK_ISSUER`                     |                             | Configuration variable that specifies the URL of the Keycloak servers issuer endpoint. This endpoint provides the base URL for the Keycloak server that issues tokens and handles authentication requests                          | optional |
| `KEYCLOAK_LOCAL_URL`                  |                             | Optional configuration variable specifically used for development environments within Docker. This allows your application to connect to a Keycloak instance running in a Docker container                                         | optional |
| `KEYCLOAK_REALM`                      | BaSyx                       | Configuration variable that specifies the name of the Keycloak realm your application will use for authentication and authorization.                                                                                               | optional |
| `IMPRINT_URL`                         |                             | Address that will be used in the imprint link. Will only show the link, if a value has been set.                                                                                                                                   | optional |
| `DATA_PRIVACY_URL`                    |                             | Address that will be used in the data privacy link. Will only show the link, if a value has been set.                                                                                                                              | optional |
| `USE_BASYX_RBAC`                      | false                       | Set to true, if BaSyx is used together with RBAC. This will enable the administration of RBAC configuration inside Mnestix.                                                                                                        | optional |
| `WHITELIST_FEATURE_FLAG`              | false                       | Enables or disables the feature for showing/hiding specific submodels.                                                                                                                                                             | optional |
| `SUBMODEL_WHITELIST`                  |                             | This variable can be used to specify a list of submodel semantic ids in order to show them when the `WHITELIST_FEATURE_FLAG` is set to true.                                                                                       | optional |

### How to set a custom logo

There are multiple ways to set a logo. You can choose between either of the following options depending on your preference:

#### Option 1: Mount a logo

First you need to mount your logo to the container by adding it to the docker compose file.

```yaml
environment:
    - THEME_LOGO_MIME_TYPE: 'image/svg+xml'
---
volumes:
    - /path/to/my/logo.svg:/app/public/logo
```

When using the provided [`compose.yaml` File](https://github.com/eclipse-mnestix/mnestix-browser/blob/main/compose.yml)
you can just place your logo in the
[`data` folder](https://github.com/eclipse-mnestix/mnestix-browser/tree/main/docker-compose/data/).

You also have to set the mime type correctly in order for the browser to parse your image correctly.
E.g. for an SVG image, set the mime type to `image/svg+xml`:

```yaml
environment:
    THEME_LOGO_MIME_TYPE: 'image/svg+xml'
```

Only image mime types are allowed.
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

#### Option 2: Base64 encoded logo

This version overwrites the previous setting.
To use this, provide a base64 encoded image in the environment variable:

```yaml
environment:
    THEME_BASE64_LOGO: '<<BASE64_ENCODED_IMAGE>>'
```

#### Option 3: Link to a hosted logo

This version overwrites both of the previous settings.
To use this just set an environment variable to a link hosted that is publicly accessible:

```yaml
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

[<img src="https://github.com/eclipse-mnestix/mnestix-browser/blob/main/.images/overview_api.png" width="300"/>](https://industrialdigitaltwin.org/wp-content/uploads/2023/07/2023-07-27_IDTA_Tutorial_V3.0-Specification-AAS-Part-2_API.pdf)\
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
The other environment variables should be configured [as described](#frontend-configuration). If you want to run Mnestix
Browser with an Basyx environment you can simply use the compose.frontend file which is
described [here](Docker-compose-files).

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

#### AAS List V2 Feature Details

The `AAS_LIST_V2_FEATURE_FLAG` is a feature flag introduced as part of a preview release.
It enables access to an updated list implementation that operates independently of the Mnestix API.

This flag is currently disabled by default (false) and is available only in preview.
It is not yet recommended for production environments.

To enable the feature for testing or preview purposes, set the flag to true in your configuration.

#### AzureAD Service

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
