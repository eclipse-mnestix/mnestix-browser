# Mnestix Infrastructure Configuration Guide

Mnestix supports **multiple infrastructures** within a single instance.  
Each infrastructure must have a **unique name** defined for the Mnestix instance.

## Access Control

Infrastructure configuration is restricted:

- Available only to **logged-in admin users**, depending on the instance configuration.
- Regular users cannot view or modify infrastructure settings.

## Infrastructure Components

An infrastructure can consist of the following interface types:

- **AAS Repository Interface**
- **AAS Registry Interface**
- **Submodel Repository Interface**
- **Submodel Registry Interface**
- **Discovery Interface**
- **Concept Description Repository Interface**

> It is not mandatory to configure all of these interfaces.  
> It is **recommended** to configure repositories.

## Endpoint Configuration

When configuring an infrastructure, it is required to:

1. **Provide an endpoint**.
2. **Select the endpoint type**.

Key points to note:

- A **single endpoint** can support multiple types.
- Alternatively, each type can have its own endpoint.
- It is also possible to configure **multiple endpoints of the same type** for one infrastructure.

## Infrastructure Security

Infrastructure security defines **custom security headers** that are added to requests made to configured endpoints.  
There are three security configuration types:

### 1. None (Default)

- No additional security headers are required.
- Suitable for non-secure or open infrastructures.

### 2. Mnestix Repository Proxy

- Used when the infrastructure is deployed as part of a **Mnestix ecosystem with Mnestix Proxy**.
- Requires an **API key configuration** from the Proxy and Template Builder.
- The API key is **encrypted** and cannot be retrieved later.
- The correct header is created automatically:
    - Depending on the Mnestix version, it will be either:
        - `ApiKey`
        - `X-API-KEY`

### 3. Header Security

- Allows configuring **custom security headers** and their values.
- As with the Proxy type, the values are **encrypted** and cannot be retrieved later.

## Authentication Note

At the moment, Mnestix only supports the three security configurations described above.  
**Other authentication methods (e.g., OpenID, OAuth2, SAML, etc.) are not supported.**

👉 If your use case requires additional authentication mechanisms, please **contact us** for support or feature requests.

## Secret Encryption Key

A critical environment variable must be set for each Mnestix instance:

- **`SECRET_ENC_KEY`**
    - Must be a **base64-encoded 32-byte secret key** (44 characters).
    - Used for secret encryption and decryption.

### ⚠️ Warning

- If `SECRET_ENC_KEY` is **not provided**, Mnestix will generate a random key at startup.
    - **This applies only when the application is started locally.**
    - In **Docker environments**, a validation script enforces this requirement and will **throw an exception** if the variable is missing or incorrectly set.
- The generated key will **not be retrievable**.
- This option should **never** be used in a production environment.
- It is intended **only for testing purposes**.
