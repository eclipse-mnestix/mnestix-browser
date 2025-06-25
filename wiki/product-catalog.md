# Product Catalog
This product catalog was developed under the [VWS4LS project](https://arena2036.de/en/vws4ls/ueberblick/), together with Arena2036.
It features an extension to Mnestix that enables the Browser to show AAS repositories as a product catalog.

For setting up your own product catalog start the following docker compose file:
<details>
<summary>docker compose file for setup</summary>
  
```yaml
networks:
  mnestix-vws4ls:
    driver: bridge
    name: mnestix-vws4ls

volumes:
  mnestix-database:
  mongo-data:
  mongodb_data:

services:
  mnestix-browser-vws4ls:
    container_name: mnestix-browser-vws4ls
    image: mnestix/mnestix-browser:1.5.0-product-catalog
    restart: always
    environment:
      DISCOVERY_API_URL: 'http://mnestix-api-vws4ls:5064/discovery'
      AAS_REPO_API_URL: 'http://mnestix-api-vws4ls:5064/repo'
      SUBMODEL_REPO_API_URL: 'http://mnestix-api-vws4ls:5064/repo'
      CONCEPT_DESCRIPTION_REPO_API_URL: 'http://mnestix-api-vws4ls:5064/repo'
      MNESTIX_BACKEND_API_URL: 'http://mnestix-api-vws4ls:5064'
      MNESTIX_BACKEND_API_KEY: ${MNESTIX_BACKEND_API_KEY:-verySecureApiKey4ls}
      AAS_LIST_FEATURE_FLAG: "true"
      PRODUCT_VIEW_FEATURE_FLAG: "true"
      AUTHENTICATION_FEATURE_FLAG: "false"         
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-verySecureNextAuthSecret}
      IMPRINT_URL: ""
      DATA_PRIVACY_URL: ""
    depends_on:
      aas-environment-vws4ls:
        condition: service_healthy # only after the healthcheck in aas is successful, the mnestix container is being created
    networks:
      - mnestix-vws4ls
    volumes:
      - mnestix-database:/app/prisma/database


  mnestix-api-vws4ls:
    image: mnestix/mnestix-api:1.3.3
    container_name: mnestix-api-vws4ls
    restart: always
    environment:
      # API key authorization
      CustomerEndpointsSecurity__ApiKey: ${MNESTIX_BACKEND_API_KEY:-verySecureApiKey4ls}
      # Connection to Repository Service:
      ReverseProxy__Clusters__aasRepoCluster__Destinations__destination1__Address: 'http://aas-environment-vws4ls:8081/'
      ReverseProxy__Clusters__submodelRepoCluster__Destinations__destination1__Address: 'http://aas-environment-vws4ls:8081/'
      ReverseProxy__Clusters__discoveryCluster__Destinations__destination1__Address: 'http://aas-discovery-vws4ls:8081/'
      # Features Configuration
      Features__AasRegistryMiddleware: "true"
      Features__UseMongoDbBasedAasIdStorage: "true"
      Features__AllowRetrievingAllShellsAndSubmodels: "true"
      # InfluxDB Configuration
      # URL to specify the host and port where InfluxDB is running:
      ReverseProxy__Clusters__influxCluster__Destinations__destination1__Address: 'http://example/'
      # Token:
      ReverseProxy__Routes__InfluxRoute__Transforms__1__Set: 'Token '
      # MongoDB Configuration
      BasyxDbConnectionConfiguration__MongoConnectionString: 'mongodb://mongoAdmin:mongoPassword@mongodb-vws4ls:27017/?authSource=admin'
      BasyxDbConnectionConfiguration__DatabaseName: basyxdb
      BasyxDbConnectionConfiguration__AasCollectionName: 'aas-repo'
      # ASP.NET Core URLs
      ASPNETCORE_URLS: 'http://+:5064'
    depends_on:
      aas-environment-vws4ls:
        condition: service_healthy # only after the healthcheck in aas is successful, the mnestix container is being created
    logging:
      driver: 'json-file'
      options:
        max-file: '5'
        max-size: '100m'
    networks:
      - mnestix-vws4ls

  mongodb-vws4ls:
    image: mongo:5
    container_name: mongodb-vws4ls
    profiles: [ "", "basyx", "tests" ]
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongoAdmin
      MONGO_INITDB_ROOT_PASSWORD: mongoPassword
    # Set health checks to wait until mongo has started
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: echo "db.runCommand("ping").ok" | mongosh mongodb-vws4ls:27017/test --quiet
      interval: 3s
      timeout: 3s
      retries: 5
    logging:
      driver: 'json-file'
      options:
        max-file: '5'
        max-size: '100m'
    networks:
      - mnestix-vws4ls

  aas-environment-vws4ls:
    image: eclipsebasyx/aas-environment:2.0.0-milestone-05.1
    container_name: aas-environment-vws4ls
    profiles: [ "", "basyx", "tests" ]
    restart: always
    depends_on:
      - mongodb-vws4ls
    environment:
      # MongoDb configuration for Basyx Repository
      BASYX__BACKEND: MongoDB
      SPRING__DATA__MONGODB__HOST: mongodb-vws4ls
      SPRING__DATA__MONGODB__DATABASE: basyxdb
      SPRING__DATA__MONGODB__authentication-database: admin
      SPRING__DATA__MONGODB__USERNAME: mongoAdmin
      SPRING__DATA__MONGODB__PASSWORD: mongoPassword
      SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE: 100000KB
      SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE: 100000KB
      # Allow mnestix frontend and backend to call basyx
      BASYX_CORS_ALLOWED-ORIGINS: '*'
      BASYX_CORS_ALLOWED-METHODS: GET,POST,PATCH,DELETE,PUT,OPTIONS,HEAD
    healthcheck: # check the endpoint for a valid response (service ready)
      test: curl -f http://localhost:8081/actuator/health
      interval: 30s
      timeout: 10s
      retries: 6
    logging:
      driver: 'json-file'
      options:
        max-file: '5'
        max-size: '100m'
    networks:
      - mnestix-vws4ls

  aas-discovery-vws4ls:
    image: eclipsebasyx/aas-discovery:2.0.0-milestone-05.1
    container_name: aas-discovery-vws4ls
    profiles: [ "", "basyx", "tests" ]
    restart: always
    depends_on:
      - mongodb-vws4ls
    environment:
      BASYX__BACKEND: MongoDB
      SPRING__DATA__MONGODB__HOST: mongodb-vws4ls
      SPRING__DATA__MONGODB__DATABASE: basyxdb
      SPRING__DATA__MONGODB__authentication-database: admin
      SPRING__DATA__MONGODB__USERNAME: mongoAdmin
      SPRING__DATA__MONGODB__PASSWORD: mongoPassword
      BASYX__CORS__ALLOWED-ORIGINS: '*'
      BASYX__CORS__ALLOWED-METHODS: GET,POST,PATCH,DELETE,PUT,OPTIONS,HEAD
    healthcheck: # check the endpoint for a valid response (service ready)
      test: curl -f http://localhost:8081/actuator/health
      interval: 30s
      timeout: 10s
      retries: 6
    logging:
      driver: 'json-file'
      options:
        max-file: '5'
        max-size: '100m'
    networks:
      - mnestix-vws4ls

  searcher-mongodb:
    container_name: searcher-mongodb
    image: mongo:latest
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: superSecureSecret
    volumes:
      - mongodb_data:/data/db
    networks:
      - mnestix-vws4ls

  mnestix-searcher:
    container_name: mnestix-searcher
    image: mnestix/mnestix-searcher:latest-dev
    restart: always
    environment:
      AuthenticationSettings__ApiKey: ${MNESTIX_BACKEND_API_KEY:-verySecureApiKey4ls}
      AasSearcherDatabase__ConnectionString: 'mongodb://admin:superSecureSecret@searcher-mongodb:27017'
      BaseUrlSettings__AasRepositoryBaseUrl: 'http://mnestix-api-vws4ls:5064/repo'
      BaseUrlSettings__SubmodelRepositoryBaseUrl: 'http://mnestix-api-vws4ls:5064/repo'
      BaseUrlSettings__ConceptDescriptionRepositoryBaseUrl: 'http://mnestix-api-vws4ls:5064/repo'
      ASPNETCORE_URLS: 'http://+:5149'
    networks:
      - mnestix-vws4ls
```
</details>


The following adjustments to Eclipse Mnestix Browser version 1.5.0 were made:

### Adding a Startpage to overview all product catalogs 

- This page lists all product catalogs that are configured in the settings

![image](https://github.com/user-attachments/assets/4eaa80db-c236-4925-8972-d2e4617c5717)

### Adding a product catalog page for a single product catalog 

- Filter by Product Classifications and Manufacturer Product Hierarchy
- Search for Product Designation and Manufacturer Name

![image](https://github.com/user-attachments/assets/5f2c436d-8013-4485-8e82-480a2ac1c839)


### Extending the AAS view with a product view that highlights product information 

- Shows product specific information e.g. commercial data if available
- Download AASX file is possible

![image](https://github.com/user-attachments/assets/aa381cdd-4fa1-4ae7-b42e-419ce2d158d6)

### Extending the Settings to be able to configure a product catalog 

- Allows to add a product catalog with a name and the URL of the AAS Repository
- Optionally, a thumbnail can be added to the product catalog
- Commerical Data Submodel URL can be configured to show commercial data in the product view. This has to be the exact link to the submodel with its ID (not only the repository)
- AAS Searcher URL can be configured to allow searching for products in the product catalog through the Mnestix Searcher component

![image](https://github.com/user-attachments/assets/5162848d-41d9-4534-91b3-f8f2c9c024d4)

### Many small improvements
- sorting in an AAS list, breadcrumbs, new Visualisation for Technical Data submodel, ...


## Mnestix Searcher
For the catalog, a new component was introduced in order to allow the filtering a product catalog by their Product Classifications and Manufacturer Product Hierarchy.
This component is called "Mnestix Searcher" for now.

The Mnestix Searcher component improves the AAS List by enabling advanced search and filtering capabilities. To activate these features for any repository, the Searcher must be configured accordingly, as illustrated in the example above.  
The Searcher provides a single endpoint at /api/Seed, secured by an API key defined in the component's configuration. This endpoint retrieves data from the repositories and transforms it into a custom structure optimized for display in the Product Catalog List. This transformation ensures that filtering and searching are both efficient and performant.
To function properly, the Searcher must be configured with all relevant repository URLs—AAS, Submodels, and Concept Descriptions, so it knows where to pull the data from.  
Once transformed, the data is stored in a dedicated MongoDB instance, which is the second essential component in the Mnestix Searcher setup. This MongoDB instance holds the processed data and exposes it through GraphQL queries. The MongoDB configuration completes the required setup for AAS Searcher.
For each repository where the Mnestix Searcher is deployed, both components must be configured. This setup ensures data separation between producers, strengthens security, and allows for independent management.  
After deploying and configuring the components, it is crucial to manually invoke the Seed endpoint to initialize the first data load. Please note that data is not updated automatically, scheduling updates would require a separate cron job, which is outside the scope of this release.


Its functionality could be integrated into the Mnestix Proxy in the future.
The sourcecode can be found [here](https://github.com/mnestix/mnestix-searcher), although it is still in a PoC stage.
It allows to interact with a repository via a GraphQL API:
<details>
  <summary>GraphQL Schema</summary>
  
```graphql
  schema {
  query: Query
}

type AasSearchEntry {
  id: String
  createdTime: DateTime
  thumbnailUrl: String
  manufacturerName: PropertyData
  productRoot: PropertyData
  productFamily: PropertyData
  productDesignation: PropertyData
  productClassifications: [ProductClassificationValues!]!
  saveData: Boolean!
}

type MLValue {
  language: String!
  text: String!
}

type ProductClassificationValues {
  system: String!
  version: String!
  productId: String!
}

type PropertyData {
  semanticId: String!
  idShortPath: String!
  value: String
  mlValues: [MLValue!]
}

type Query {
  entries(
    where: AasSearchEntryFilterInput @cost(weight: "10")
  ): [AasSearchEntry!]! @cost(weight: "10")
}

input AasSearchEntryFilterInput {
  and: [AasSearchEntryFilterInput!]
  or: [AasSearchEntryFilterInput!]
  id: StringOperationFilterInput
  createdTime: DateTimeOperationFilterInput
  thumbnailUrl: StringOperationFilterInput
  manufacturerName: PropertyDataFilterInput
  productRoot: PropertyDataFilterInput
  productFamily: PropertyDataFilterInput
  productDesignation: PropertyDataFilterInput
  productClassifications: ListFilterInputTypeOfProductClassificationValuesFilterInput
  saveData: BooleanOperationFilterInput
}

input BooleanOperationFilterInput {
  eq: Boolean @cost(weight: "10")
  neq: Boolean @cost(weight: "10")
}

input DateTimeOperationFilterInput {
  eq: DateTime @cost(weight: "10")
  neq: DateTime @cost(weight: "10")
  in: [DateTime] @cost(weight: "10")
  nin: [DateTime] @cost(weight: "10")
  gt: DateTime @cost(weight: "10")
  ngt: DateTime @cost(weight: "10")
  gte: DateTime @cost(weight: "10")
  ngte: DateTime @cost(weight: "10")
  lt: DateTime @cost(weight: "10")
  nlt: DateTime @cost(weight: "10")
  lte: DateTime @cost(weight: "10")
  nlte: DateTime @cost(weight: "10")
}

input ListFilterInputTypeOfMLValueFilterInput {
  all: MLValueFilterInput @cost(weight: "10")
  none: MLValueFilterInput @cost(weight: "10")
  some: MLValueFilterInput @cost(weight: "10")
  any: Boolean @cost(weight: "10")
}

input ListFilterInputTypeOfProductClassificationValuesFilterInput {
  all: ProductClassificationValuesFilterInput @cost(weight: "10")
  none: ProductClassificationValuesFilterInput @cost(weight: "10")
  some: ProductClassificationValuesFilterInput @cost(weight: "10")
  any: Boolean @cost(weight: "10")
}

input MLValueFilterInput {
  and: [MLValueFilterInput!]
  or: [MLValueFilterInput!]
  language: StringOperationFilterInput
  text: StringOperationFilterInput
}

input ProductClassificationValuesFilterInput {
  and: [ProductClassificationValuesFilterInput!]
  or: [ProductClassificationValuesFilterInput!]
  system: StringOperationFilterInput
  version: StringOperationFilterInput
  productId: StringOperationFilterInput
}

input PropertyDataFilterInput {
  and: [PropertyDataFilterInput!]
  or: [PropertyDataFilterInput!]
  semanticId: StringOperationFilterInput
  idShortPath: StringOperationFilterInput
  value: StringOperationFilterInput
  mlValues: ListFilterInputTypeOfMLValueFilterInput
}

input StringOperationFilterInput {
  and: [StringOperationFilterInput!]
  or: [StringOperationFilterInput!]
  eq: String @cost(weight: "10")
  neq: String @cost(weight: "10")
  contains: String @cost(weight: "20")
  ncontains: String @cost(weight: "20")
  in: [String] @cost(weight: "10")
  nin: [String] @cost(weight: "10")
  startsWith: String @cost(weight: "20")
  nstartsWith: String @cost(weight: "20")
  endsWith: String @cost(weight: "20")
  nendsWith: String @cost(weight: "20")
}

"The purpose of the `cost` directive is to define a `weight` for GraphQL types, fields, and arguments. Static analysis can use these weights when calculating the overall cost of a query or response."
directive @cost(
  "The `weight` argument defines what value to add to the overall cost for every appearance, or possible appearance, of a type, field, argument, etc."
  weight: String!
) on SCALAR | OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | ENUM | INPUT_FIELD_DEFINITION

"The `@specifiedBy` directive is used within the type system definition language to provide a URL for specifying the behavior of custom scalar definitions."
directive @specifiedBy(
  "The specifiedBy URL points to a human-readable specification. This field will only read a result for scalar types."
  url: String!
) on SCALAR

"The `DateTime` scalar represents an ISO-8601 compliant date time type."
scalar DateTime @specifiedBy(url: "https://www.graphql-scalars.com/date-time")
```
</details>
