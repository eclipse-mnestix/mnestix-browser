> [!IMPORTANT]
> The documentation for **Mnestix Proxy** is located at [https://github.com/eclipse-mnestix/mnestix-proxy/wiki](https://github.com/eclipse-mnestix/mnestix-proxy/wiki).
> For more information about proxy setup, configuration, and advanced usage, please refer to the official documentation there.

# What is Mnestix AAS Generator?

The Mnestix API enhances the capabilities of the Mnestix Viewer, an Asset Administration Shell viewer. Built with ASP.NET Core 8, it offers the following advanced features:

- **AAS Creation Endpoint**: An endpoint for creating Asset Administration Shells (AAS) using only the assetId short.
- **AasRelationship Endpoint**: An endpoint to return AAS derived from a specified aasId.
- **Custom Submodel Templates**: Functionality for building custom submodel templates based on default templates, which can be combined with the AAS creation endpoint to efficiently create large numbers of AAS and map data into the submodels.

### Feature Overview

Below you can find an overview of the Mnestix Ecosystem and how the different components work together.

![Overview of Mnestix Infrastructure](https://github.com/user-attachments/assets/2e966021-98b4-4412-a568-6a16c22c6c71)

Mnestix AAS Generator (formerly known as the Data Ingest Endpoint)

On the right side of the diagram is the Eclipse Mnestix Browser component that enables browsing through multiple repositories and your AAS infrastructure.

The Mnestix Template Builder is already integrated within Mnestix Browser and is activated when the Mnestix AAS Generator environment variable is set. See [Mnestix Configuration Settings](Mnestix-Configuration-Settings) for more information.

## Run locally

### Requirements

- Linux or WSL
- Docker
- Docker-Compose

### Instructions:

1. **Copy the compose.yml code**

    Found [here](mnestix-aas-generator.compose.yaml)

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

The Mnestix AAS Generator is configured using environment variables in your `compose.yml` file. Below are the key settings you can adjust:

#### **API Key**

- `CustomerEndpointsSecurity__ApiKey`:  
  Set your API key to secure all API endpoints except the AasList endpoint.  
  Example:  
  `CustomerEndpointsSecurity__ApiKey: YOUR_API_KEY_HERE`
    > Replace `YOUR_API_KEY_HERE` with your actual API key.

#### **Feature Flags**

- `Features__UseAuthentication`:  
  Enable or disable authentication for the backend.  
  Example:  
  `Features__UseAuthentication: true`  
  Set to `true` to require authentication, or `false` to disable.

#### **Authentication Providers**

You can secure the API using Microsoft Entra ID (Azure AD) or an OpenID Connect provider (e.g., Keycloak).

**Azure AD Configuration:**

- `AzureAd__Domain`: Your Azure domain
- `AzureAd__TenantId`: Your Azure tenant ID
- `AzureAd__ClientId`: Your Azure client ID

**OpenID Connect Configuration:**

- `OpenId__EnableOpenIdAuth`: Set to `"true"` to enable OIDC authentication
- `OpenId__Issuer`: OIDC issuer URL (e.g., Keycloak realm)
- `OpenId__ClientID`: OIDC client ID
- `OpenId__RequireHttpsMetadata`: `"false"` for development, `"true"` for production

**Repository OpenID Connect (for Basyx Repository):**

- `RepositoryOpenIdConnect__EnableRepositoryOpenIdAuth`: `"true"` to enable
- `RepositoryOpenIdConnect__Authority`: OIDC authority URL
- `RepositoryOpenIdConnect__DiscoveryEndpoint`: Usually `.well-known/openid-configuration`
- `RepositoryOpenIdConnect__ClientId`: Client ID for repository access
- `RepositoryOpenIdConnect__ClientSecret`: Client secret for repository access
- `RepositoryOpenIdConnect__ValidateIssuer`: `"true"` for production

**Connection to AAS Repository and Submodel repository infrastructure (here via Proxy):**

- `ServerUrls`:  
  Defines the internal URL for the Mnestix proxy to access the repository.
  Example:  
  `ServerUrls: 'http://mnestix-proxy:5065/repo/'`
    > Adjust this value if your proxy or repository endpoint changes.

**Separate Submodel Repositories (API v2 only):**

You can optionally configure separate submodel repositories for blueprints and templates in API v2:

- `SubmodelTemplatesApiUrl`:  
  Defines a dedicated repository URL for submodel templates.  
  Example:  
  `SubmodelTemplatesApiUrl:` Your dedicated submodel repository for submodel templates

- `SubmodelBlueprintsApiUrl`:  
  Defines a dedicated repository URL for submodel blueprints.  
  Example:  
  `SubmodelBlueprintsApiUrl:` Your dedicated submodel repository for submodel blueprints

> **Note:**  
> If these settings are not configured, the Mnestix AAS Generator will use the standard submodel repository defined in `ServerUrls`. These settings are only available in API v2 and allow you to separate blueprint and template storage from your main AAS repository for better organization and scalability.

> **Tip:**  
> For production, always use secure values and restrict public access to MongoDB and API endpoints.

## API Versioning

The Mnestix AAS Generator has evolved over time, and the API client is automatically generated based on the version of the AAS Generator you are running. The API endpoints have been renamed and restructured between versions:

### API v1

The original API version with the following endpoints:

- **CustomTemplatesApi**: Manage custom submodel templates
- **DefaultTemplatesApi**: Access default template definitions
- **TemplateApi**: Core template operations

Swagger Documentation: http://localhost:5064/swagger/v1/swagger.json

> **⚠️ Important:** The health check endpoint will not work if you are using AAS Generator v1. It will show offline even, when the AAS Generator is online, due to not having a health endpoint.

### API v2

The current API version with renamed and enhanced endpoints:

- **BlueprintsApi**: Replaces the previous template management (create, update, delete, and manage blueprints for AAS generation)
- **TemplatesApi**: Advanced template management with enhanced features

Swagger Documentation: http://localhost:5064/swagger/v2/swagger.json

> **Note:** The API version is automatically selected based on which version of the Mnestix AAS Generator you are running. You don't need to manually choose between versions
