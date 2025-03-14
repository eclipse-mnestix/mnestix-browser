> [!IMPORTANT]  
>
> This part of the documentation is for the [Mnestix API](https://hub.docker.com/r/mnestix/mnestix-api) and will be moved once the API is Open Source.
> For now the different functionalities are all combined in the Mnestix API.


> [!WARNING] 
> When using the Mnestix API version `1.2.0` or above, you have to adjust the Environment variable for the `repoCluster`. It is now split into `aasRepoCluster` and `submodelRepoCluster`

# What is Mnestix API?

The Mnestix API enhances the capabilities of the Mnestix Viewer, an Asset Administration Shell viewer, by providing public endpoints and utilizing a reverse proxy (YARP) to ensure data protection. Built with ASP.NET Core 8, it offers the following advanced features:

- **AAS Creation Endpoint**: An endpoint for creating Asset Administration Shells (AAS) using only the assetId short.
- **AasRelationship Endpoint**: An endpoint to return AAS derived from a specified aasId.
- **Custom Submodel Templates**: Functionality for building custom submodel templates based on default templates, which can be combined with the AAS creation endpoint to efficiently create large numbers of AAS and map data into the submodels.

### Feature Overview
Below you can find an overview of the Mnestix Ecosystem and how the different components work together.

![Overview of Mnestix Infrastructure](https://github.com/user-attachments/assets/2e966021-98b4-4412-a568-6a16c22c6c71)

The Mnestix API currently encapsulates the following components:
- Mnestix Repository Proxy
- Mnestix AAS Generator (formally known as Data Ingest Endpoint)

On the right side of the diagram is the Eclipse Mnestix Browser component that enables browsing through multiple repositories and your AAS infrastructure.

The Mnestix Template Builder is already integrated within Mnestix Browser and is activated when the Mnestix API environment variable is set. See [Mnestix Configuration Settings](Mnestix-Configuration-Settings) for more information.


## Run locally

### Requirements
- Linux or WSL
- Docker
- Docker-Compose

### Instructions:

1. **Copy the compose.yml code**

   Found [here](mnestix-api.compose.yaml)

2. **Create the compose.yml file**

   Create a file in your local directory with the name compose.yml and paste the copied code in there.

3. **Run the application**

   Navigate to the directory where the compose.yml is, and run the following command:

    ```
    docker compose up
    ```
4. **Visit Mnestix**

    Open your Browser and go to http://localhost:5064/swagger/index.html to see Swagger documentation and all public 
 exposed endpoints.


5. **Change Enviromental Settings**

### Environment Settings

#### **Api Key**

- `CustomerEndpointsSecurity__ApiKey` - Configure the API key to secure all API endpoints, with the exception of the AasList endpoint.
This setting will also protect all non-GET endpoints through the YARP proxy.

> **Note:** The API key provided in the `compose.yml` file is just an example.
> Please replace `YOUR_API_KEY_HERE` with your actual API key immediately to ensure proper functionality and security.

#### **AAS Repository**

Mnestix is using BaSyx implementation, by appending /repo to our URLs, we are forwarding the requests to BaSyx repository via proxy: [BaSyx AAS API Collection](https://app.swaggerhub.com/apis/Plattform_i40/Entire-API-Collection/V3.0#/Asset%20Administration%20Shell%20Repository%20API/GetAssetAdministrationShellById)
With this, BaSyx endpoints can be reached through Mnestix.
- AAS Repository Api: http://localhost:5064/repo/shells/{ID}
- Submodel Repository Api: http://localhost:5064/repo/submodels/{ID}
- The BaSyx Swagger UI gives a detailed overview of all available endpoints: http://localhost:8081/swagger-ui/index.html

It's important to configure the environment settings to point towards the designated repository addresses. This setup is essential for enabling the YARP proxy cluster to effectively forward requests.
- `ReverseProxy__Clusters__aasRepoCluster__Destinations__destination1__Address` - The address of the AAS repository
- `ReverseProxy__Clusters__submodelRepoCluster__Destinations__destination1__Address` - The address of the submodel repository

#### **AAS Discovery**

Mnestix is using BaSyx implementation, by appending `/discovery` to our URLs, we are forwarding the requests to BaSyx repository via proxy: [BaSyx AAS API Collection](https://app.swaggerhub.com/apis/Plattform_i40/Entire-API-Collection/V3.0#/Asset%20Administration%20Shell%20Repository%20API/GetAssetAdministrationShellById)
With this, BaSyx endpoints can be reached through Mnestix.
- AAS Discovery Api: http://localhost:5064/discovery (e.g. http://localhost:5064/discovery/lookup/shells)
- The BaSyx Swagger UI gives a detailed overview of all available endpoints: http://localhost:8082/swagger-ui/index.html

It's important to configure the environment settings to point towards the designated AAS discovery address. This setup is essential for enabling the YARP proxy cluster to effectively forward requests.
- `ReverseProxy__Clusters__discoveryCluster__Destinations__destination1__Address` - The address of the discovery service

>**Note:** It is important to note that both services are exclusively exposed by publishing the port externally in Docker Compose only for development purposes.
>To ensure security, it is recommended that services should not be directly published and accessed only via a proxy.

#### **Feature Flags**

Mnestix provides multiple feature flags. You can find the feature flags in your `compose.yml`. Set them to `true` or `false` to define the behavior of Mnestix:  

| Feature Flag                                     | Default value | Description                                                                                                                                                                                         |
|--------------------------------------------------|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `Features__AllowRetrievingAllShellsAndSubmodels` | true | Allows or disallows the retrieval of all aas in the repo. Setting this to 'false' will restrict access to the 'repo/shells' and 'repo/submodels' endpoints.<br/>Needs to be enabled when the AasList should be visible. |
| `Features__UseAuthentication`                    | true | Enable or disable the authentication in the backend.                                                                                                                                                |
| `Features__AasRegistryMiddleware`                | true | When set to true, this feature flag enables the discovery service. As a result, AAS (Asset Administration Shell) and submodel records are registered and made available in the discovery service.           |

#### **InfluxDB Configuration**

- `ReverseProxy__Clusters__influxCluster__Destinations__destination1__Address`
Specifies the URL for the host and port where InfluxDB is running. Replace `"http://example/"` with the actual address of your InfluxDB instance.
- `ReverseProxy__Routes__InfluxRoute__Transforms__1__Set`  
  Sets the token for authentication with InfluxDB. Replace `"Token "` with the appropriate token value.
- *Note: These settings are specifically for configuring the TimeSeries submodel.*

#### **MongoDb Configuration (Used for AasRelationship Endpoint)**
- `BasyxDbConnectionConfiguration__MongoConnectionString` - Specifies the connection string for the MongoDB database. This should include the necessary information such as the host, port, and authentication credentials.
- `BasyxDbConnectionConfiguration__DatabaseName` - Specifies the name of the MongoDb 
>**Note:** It is crucial that the name specified here matches the name specified in AAS Repository service environment variables (here: `SPRING__DATA__MONGODB__DATABASE`).
- `BasyxDbConnectionConfiguration__AasCollectionName` - Specifies the name of the collection within the MongoDB database where AAS documents will be stored.
>**Note:** It is crucial that the name specified here matches the name generated by AAS Repository service (for Basyx `aas-repo`).

#### **MongoDb Configuration**
- Public access for development only

>MongoDB is exposed publicly solely for development purposes. It's crucial to restrict public access in production environments.

- Security reminder

>To enhance security, it's essential to update the default admin username and password.

### Authentication

This section is applicable only if `Features__UseAuthentication` is set to `true`.

#### Default Settings - Protecting Mnestix API Endpoints

By default, Mnestix API uses Microsoft Entra ID (formerly Azure AD) as the authorization server (OAuth 2.0). To secure Mnestix API endpoints with this configuration, you can use the `[Authorize]` attribute, which ensures that only authenticated users can access specific controllers or actions in your application.

**Key Settings for Configuring Microsoft Entra ID:**

| **Parameter**           | **Description**                                         | **Example Value**                  |
|-------------------------|---------------------------------------------------------|------------------------------------|
| **AzureAd__ClientId**   | Unique ID for your application in Microsoft Entra ID.   | `"your-client-id"`                 |
| **AzureAd__Domain**     | Domain name of your Microsoft Entra ID tenant.          | `"your-domain.onmicrosoft.com"`    |
| **AzureAd__TenantId**   | Unique ID for your Microsoft Entra ID tenant.           | `"your-tenant-id"`                 |

#### OpenID Settings - Protecting Mnestix API Endpoints

Mnestix API can also be secured using an OpenID Connect (OIDC) provider, such as Keycloak. If using an OpenID Connect provider, configure the following settings:

| **Parameter**                 | **Description**                                                                                                          | **Example Value**                    | **Note**                                                                                      | **Default Value** |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------|-------------------|
| **OpenId__EnableOpenIdAuth**  | Determines whether OpenID authentication is activated. Set this to `true` to enable authentication via the OpenID Connect provider. | -                                    | When this is set to `true`, the default Azure settings will no longer be applied.             | -                 |
| **OpenId__Issuer**            | The URL of the OpenID Connect provider's issuer. This URL is used to discover authentication endpoints and verify tokens. | `http://localhost:9096/realms/BaSyx` | -                                                                                              | -                 |
| **OpenId__ClientID**          | Unique identifier for your application as registered with the OpenID Connect provider. This ID is used during authentication. | `"mnestixApi-demo"`                  | -                                                                                              | -                 |
| **OpenId__RequireHttpsMetadata** | Determines whether the OpenID Connect provider metadata should be accessed over HTTPS. Set this to `true` to enforce HTTPS for secure communication. | -                                    | Setting this to `false` is intended only for development environments. For production, always use `true` to ensure secure communication. | `false`           |


### OpenID Settings - Configuring Client for Repository Authentication

When using Basyx with authorization and Keycloak as an OpenID Connect (OIDC) provider, Mnestix API needs to authenticate with the repository. Configure the following settings to support this repository authentication:

| **Parameter**                                  | **Description**                                                                                                          | **Example Value**                          | **Note**                                                         | **Default Value** |
|------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|------------------------------------------------------------------|-------------------|
| **RepositoryOpenIdConnect__EnableRepositoryOpenIdAuth** | Determines whether OpenID Connect authentication is enabled for the repository. Set this to `true` to activate authentication through the OpenID Connect provider. | -                                          | -                                                                | `false`           |
| **RepositoryOpenIdConnect__Authority**         | Base URL of the OpenID Connect provider's authority. This URL is used to obtain authentication tokens and metadata.       | `http://localhost:9096/realms/BaSyx`       | -                                                                | -                 |
| **RepositoryOpenIdConnect__DiscoveryEndpoint** | Endpoint used to discover OpenID Connect configuration details. This is appended to the `Authority` URL to access the provider's configuration. | `.well-known/openid-configuration`         | -                                                                | -                 |
| **RepositoryOpenIdConnect__ClientId**          | Unique identifier for the client application registered with the OpenID Connect provider. This ID is used during authentication. | `"mnestix-repo-client-demo"`               | -                                                                | -                 |
| **RepositoryOpenIdConnect__ClientSecret**      | Secret key associated with the client application. This key secures client credentials during authentication. Leave empty if not required. | `"your-secret"`                            | -                                                                | -                 |
| **RepositoryOpenIdConnect__ValidateIssuer**    | Indicates whether to validate the issuer of the OpenID Connect tokens. Set this to `true` to ensure tokens are issued by the expected authority. | -                                          | For enhanced security, it is recommended to set this to `true` in production environments. | `false`           |
| **TokenEndpoint**     | Used to explicitly define the token endpoint URL that your application will use to obtain access tokens. This is crucial in a Dockerized environment where the internal network configuration might differ from the external one. |                                          |                                                                                            | -                |

> [!IMPORTANT]  
> **`TokenEndpoint` Configuration**
> For production, this setting should be left empty. In a production environment, relying on environment-specific configurations can introduce security risks and maintenance challenges. The system should be configured to use the default discovery mechanisms provided by OIDC to dynamically determine the token endpoint, ensuring a more robust and secure setup.