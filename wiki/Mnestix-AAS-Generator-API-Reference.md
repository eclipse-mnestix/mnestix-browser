# AAS Generator API Reference

This document describes the REST API endpoints for the AAS Generator service.

> **Interactive Documentation**: Access the Swagger UI at `http://localhost:5064/swagger` for live API testing with example requests and responses.

> **Note**: API v1 endpoints are deprecated. Use v2 endpoints for all new integrations.

## Base URL

```
/api/v2/
```

## Authentication

All API endpoints require authentication. The API supports two authentication schemes:

1. **API Key Authentication** - Include the API key in the `X-API-KEY` header
2. **JWT Bearer Token** - Include a valid JWT token in the `Authorization: Bearer <token>` header

For detailed authentication configuration, see [Mnestix AAS Generator](Mnestix-AAS-Generator#authentication).

---

## AAS Creator

Creates a new AAS for a given asset identifier. Optionally generates and attaches submodels if blueprint parameters are provided.

```http
POST /api/v2/AasCreator/{assetIdShort}
```

### Path Parameters

| Parameter      | Type   | Required | Description                                              |
| -------------- | ------ | -------- | -------------------------------------------------------- |
| `assetIdShort` | string | Yes      | The short identifier for the asset (e.g., `machine-001`) |

### Request Body (Optional)

```json
{
    "blueprintsIds": ["blueprint-id-1", "blueprint-id-2"],
    "data": {
        "serialNumber": "SN-12345",
        "manufacturer": "ACME Corp"
    },
    "language": "en",
    "debug": false
}
```

| Field           | Type     | Required | Description                                                      |
| --------------- | -------- | -------- | ---------------------------------------------------------------- |
| `blueprintsIds` | string[] | No       | List of blueprint IDs to use for submodel generation             |
| `data`          | object   | No       | JSON data to map into the submodel templates                     |
| `language`      | string   | No       | Language code for MultiLanguageProperties (e.g., `"en"`, `"de"`) |
| `debug`         | boolean  | No       | Include debug logs in response (default: `false`)                |

### Response

**Success (200 OK)**

```json
{
    "assetId": "https://example.com/assets/machine-001",
    "base64EncodedAssetId": "aHR0cHM6Ly9leGFtcGxlLmNvbS9hc3NldHMvbWFjaGluZS0wMDE=",
    "aasId": "https://example.com/aas/machine-001",
    "base64EncodedAasId": "aHR0cHM6Ly9leGFtcGxlLmNvbS9hYXMvbWFjaGluZS0wMDE=",
    "aasRepoUrl": "http://localhost:8081",
    "submodelResults": [
        {
            "blueprintId": "nameplate-v1",
            "success": true,
            "message": "",
            "generatedSubmodelId": "https://example.com/submodels/nameplate-001"
        }
    ]
}
```

**Error (400 Bad Request)** - Returned when:

- An AAS with the generated ID already exists
- Submodel generation failed (response includes `submodelResults` with error details)

> **Note:** If submodel generation fails mid-process, the AAS may have been partially created. Check the `submodelResults` array in the error response for details.

For details on blueprint usage, see [Data Ingest & Blueprint Guide](Data-Ingest-&-Blueprint-Guide).

---

## Data Ingest (Submodel Generation)

Generates and adds Submodels to an **existing** AAS using blueprints.

```http
POST /api/v2/DataIngest/{base64EncodedAasId}
```

### Path Parameters

| Parameter            | Type   | Required | Description                             |
| -------------------- | ------ | -------- | --------------------------------------- |
| `base64EncodedAasId` | string | Yes      | The AAS ID encoded in Base64 URL format |

### Request Body

```json
{
    "blueprintsIds": ["contact-template-v1", "nameplate-template-v1"],
    "data": {
        "manufacturer": "ACME Corp",
        "serialNumber": "SN-12345"
    },
    "language": "en",
    "debug": false
}
```

| Field           | Type     | Required | Description                                                         |
| --------------- | -------- | -------- | ------------------------------------------------------------------- |
| `blueprintsIds` | string[] | Yes      | List of blueprint IDs to generate submodels from                    |
| `data`          | object   | Yes      | JSON data to map into templates. Use `{}` if no mapping is defined. |
| `language`      | string   | Yes      | Language code for MultiLanguageProperties (e.g., `"en"`, `"de"`)    |
| `debug`         | boolean  | No       | Include debug logs in response (default: `false`)                   |

### Response

**Success (200 OK)**

```json
{
    "results": [
        {
            "blueprintId": "contact-template-v1",
            "success": true,
            "message": "",
            "generatedSubmodelId": "https://example.com/submodels/contact-001",
            "debugInfo": {
                "logs": ["Step 1: DeepCloneTemplate completed", "..."]
            }
        }
    ]
}
```

**Error (400 Bad Request)**

```json
{
    "results": [
        {
            "blueprintId": "contact-template-v1",
            "success": false,
            "message": "Missing required data at path: contacts.name",
            "generatedSubmodelId": "",
            "errorInfo": {
                "logs": ["Error occurred during mapping"],
                "qualifier": "SMT/MappingInfo",
                "qualifierPath": "contacts.name"
            }
        }
    ]
}
```

For details on blueprint configuration and mapping rules, see [Data Ingest & Blueprint Guide](Mnestix-API-Data-Ingest).

---

## Blueprints

Blueprints are customized Submodel templates with embedded mapping rules. They define how structured data is transformed into AAS Submodels.

### Get All Blueprints

```http
GET /api/v2/Blueprints
```

**Response (200 OK)** - Array of blueprint Submodels in JSON format.

### Get Blueprint by ID

```http
GET /api/v2/Blueprints/{base64EncodedBlueprintId}
```

| Parameter                  | Type   | Required | Description                                   |
| -------------------------- | ------ | -------- | --------------------------------------------- |
| `base64EncodedBlueprintId` | string | Yes      | The blueprint ID encoded in Base64 URL format |

**Response (200 OK)** - Blueprint Submodel in JSON format.

### Create Blueprint

```http
POST /api/v2/Blueprints
```

**Request Body** - A complete Submodel JSON object with `kind: "Template"` and embedded Template Qualifiers for mapping rules.

**Response (200 OK)** - Returns the identifier of the newly created blueprint.

### Update Blueprint

```http
POST /api/v2/Blueprints/{submodelId}
```

| Parameter    | Type   | Required | Description                       |
| ------------ | ------ | -------- | --------------------------------- |
| `submodelId` | string | Yes      | The ID of the blueprint to update |

**Response (204 No Content)**

### Delete Blueprint

```http
DELETE /api/v2/Blueprints/{base64EncodedBlueprintId}
```

| Parameter                  | Type   | Required | Description                                   |
| -------------------------- | ------ | -------- | --------------------------------------------- |
| `base64EncodedBlueprintId` | string | Yes      | The blueprint ID encoded in Base64 URL format |

**Response**

- **204 No Content** - Deletion successful
- **404 Not Found** - Blueprint does not exist
- **400 Bad Request** - Invalid ID format

---

## Templates

Templates are standard Submodel templates from external sources or the templates AAS. Unlike blueprints, templates may be read-only if sourced from an external API.

### Get All Templates

```http
GET /api/v2/Templates
```

**Response (200 OK)** - Array of template Submodels.

**Error (404 Not Found)** - Templates could not be retrieved.

### Create Template

```http
POST /api/v2/Templates
```

> **Note**: This endpoint is disabled when `SubmodelTemplatesApiUrl` is configured. In that case, use the remote templates API.

**Request Body** - A complete Submodel template as JSON.

**Response**

- **204 No Content** - Template created successfully
- **403 Forbidden** - Remote templates API is configured; use that instead
- **400 Bad Request** - Invalid template format

---

## ID Generator

Generate standardized identifiers for AAS and Submodels.

### Generate AAS IDs with Asset ID Short

```http
GET /api/v2/IdGenerator/aasIds/{assetIdShort}
```

| Parameter      | Type   | Required | Description                        |
| -------------- | ------ | -------- | ---------------------------------- |
| `assetIdShort` | string | Yes      | The short identifier for the asset |

**Response (200 OK)**

```json
{
    "assetId": "https://example.com/assets/machine-001",
    "assetIdShort": "machine-001",
    "aasId": "https://example.com/aas/machine-001",
    "aasIdShort": "aas_machine-001"
}
```

### Generate AAS IDs (Auto-generated)

```http
GET /api/v2/IdGenerator/aasIds/
```

**Response (200 OK)**

```json
{
    "assetId": "https://example.com/assets/xdtzq0F",
    "assetIdShort": "xdtzq0F",
    "aasId": "https://example.com/aas/xdtzq0F",
    "aasIdShort": "aas_xdtzq0F"
}
```

### Generate Submodel IDs

```http
GET /api/v2/IdGenerator/submodelIds/{count}
```

| Parameter | Type    | Required | Description                        |
| --------- | ------- | -------- | ---------------------------------- |
| `count`   | integer | Yes      | Number of Submodel IDs to generate |

**Response (200 OK)**

```json
["https://example.com/submodels/abc123", "https://example.com/submodels/def456"]
```

---

## Configuration

Manage ID generation configuration settings.

### Get ID Configuration

```http
GET /api/v2/Configuration
```

**Response (200 OK)** - Configuration settings as JSON.

**Error (404 Not Found)** - Configuration not found.

### Update ID Configuration

```http
PATCH /api/v2/Configuration?idShortPath={path}&value={value}
```

| Parameter     | Type   | Required | Description                                          |
| ------------- | ------ | -------- | ---------------------------------------------------- |
| `idShortPath` | string | Yes      | The path to the setting within the submodel elements |
| `value`       | string | Yes      | The new value to apply                               |

**Response**

- **204 No Content** - Update successful
- **404 Not Found** - Setting not found

---

## AAS Relationships

Navigate relationships between Asset Administration Shells.

### Get Derived From

Returns all AAS instances that have a direct `derivedFrom` relationship to the specified AAS.

```http
GET /api/v2/AasRelationship/GetDerivedFrom?aasId={aasId}
```

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `aasId`   | string | Yes      | The ID of the AAS to find inheritors for |

**Response (200 OK)**

```json
[
    {
        "aasId": "https://example.com/aas/derived-001",
        "assetIdShort": "derived-asset-001"
    }
]
```

**Error (400 Bad Request)** - AAS ID is missing or invalid.

---

## Error Handling

All endpoints return standard HTTP status codes:

| Status Code               | Description                             |
| ------------------------- | --------------------------------------- |
| 200 OK                    | Request successful                      |
| 204 No Content            | Request successful, no content returned |
| 400 Bad Request           | Invalid request parameters or body      |
| 401 Unauthorized          | Missing or invalid authentication       |
| 403 Forbidden             | Insufficient permissions                |
| 404 Not Found             | Resource not found                      |
| 500 Internal Server Error | Server-side error                       |

### Error Response Format

```json
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "Bad Request",
    "status": 400,
    "detail": "Detailed error message"
}
```
