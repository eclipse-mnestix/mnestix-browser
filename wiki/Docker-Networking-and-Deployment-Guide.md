# Docker Networking and Deployment Guide

This guide explains how Mnestix Browser communicates with BaSyx AAS infrastructure,
why certain configurations fail in Docker environments, and how to set up a working deployment.

> **Who is this for?** Developers who run Mnestix Browser via Docker and connect it to
> BaSyx AAS / Submodel infrastructure. If you've ever seen "submodel not found" errors
> or wondered why `localhost:8081` doesn't work from inside a container, start here.

---

## 1. Architecture Overview: Server-Side Request Execution

**Mnestix Browser is a Next.js application. All requests to AAS infrastructure
(repositories, registries, discovery) are executed server-side — from the Node.js backend,
not from the user's browser.**

This is fundamentally different from traditional AAS browsers (like the BaSyx AAS Web UI)
that make requests directly from the browser via JavaScript/fetch.

```
┌──────────────────────────────────────────────────────────┐
│  Traditional AAS Browser (e.g. BaSyx Web UI)             │
│                                                          │
│  Browser ──── fetch() ───────► AAS Repository            │
│  (user's machine)               (must be reachable       │
│                                  from user's network,    │
│                                  CORS required)          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Mnestix Browser                                         │
│                                                          │
│  Browser ──► Next.js Server ──► AAS Repository           │
│  (UI only)   (Node.js backend)  (must be reachable       │
│               executes all       from the SERVER,         │
│               AAS requests       not from the browser)    │
└──────────────────────────────────────────────────────────┘
```

### Why this matters

- **No CORS required.** The browser never talks to BaSyx directly. Cross-origin restrictions
  do not apply because the Node.js process makes the HTTP calls.
- **No credential leakage.** API keys (e.g., `MNESTIX_BACKEND_API_KEY`) remain on the
  server. They are never sent to or visible in the browser.
- **Network reachability is evaluated from the server container**, not from the user's
  machine. This is the root cause of most misconfiguration issues.

### Key implication

> When you configure `AAS_REPO_API_URL`, `REGISTRY_API_URL`, etc., these URLs must be
> reachable **from the Mnestix Browser container** — not from your host machine or browser.

---

## 2. Networking Model (Docker-Specific)

### `localhost` inside a container is NOT your host machine

Each Docker container has its own network namespace. Inside the `mnestix-browser` container,
`localhost` (or `127.0.0.1`) refers to **the container itself** — not your host machine,
and not other containers.

```
┌─────────────────────────────────────────────────────┐
│  Host Machine (your laptop)                         │
│  localhost:8081 ──► mapped to aas-environment:8081  │
│                                                     │
│  ┌─────────────────────────┐                        │
│  │ mnestix-browser          │                       │
│  │ localhost:8081 ──► ???   │  ← nothing listens    │
│  │                         │    on 8081 inside      │
│  │                         │    this container      │
│  └─────────────────────────┘                        │
│                                                     │
│  ┌─────────────────────────┐                        │
│  │ aas-environment          │                       │
│  │ localhost:8081 ──► BaSyx │  ← only reachable     │
│  │                         │    here or via Docker  │
│  └─────────────────────────┘    network name        │
└─────────────────────────────────────────────────────┘
```

### Docker networks and service names

When containers are on the same Docker network, they can reach each other using their
**service name** (from `docker-compose.yml`) as a hostname.

| You want to reach...          | From inside a container, use...      | NOT                      |
|-------------------------------|--------------------------------------|--------------------------|
| AAS Environment on port 8081  | `http://aas-environment:8081`        | `http://localhost:8081`  |
| AAS Registry on port 8080     | `http://aas-registry:8080`           | `http://localhost:8083`  |
| Submodel Registry on port 8080| `http://submodel-registry:8080`      | `http://localhost:8084`  |

> **Rule of thumb: If it runs in Docker, never use `localhost` in environment variable
> configuration. Use the Docker service name and the container-internal port.**

### Published ports vs. container-internal ports

`ports: "8083:8080"` means: host port 8083 maps to container-internal port 8080.

- From your **host machine**: `http://localhost:8083` works (mapped port).
- From **another container** on the same network: `http://aas-registry:8080` works
  (internal port). `http://aas-registry:8083` does **not** work — 8083 is only a host mapping.

---

## 3. Endpoint Resolution Priority

Mnestix Browser resolves AAS/Submodel endpoints using a **priority chain**. Understanding
this is critical because registry descriptors can override your configured repository URLs.

### Resolution order for AAS

1. **Discovery Service** — find AAS ID by asset ID (if discovery is configured)
2. **AAS Registry** — look up the AAS descriptor by AAS ID; extract the endpoint URL from
   the descriptor's `endpoints` array
3. **AAS Repository** — fall back to the configured `AAS_REPO_API_URL` (direct lookup by
   encoded AAS ID)

### Resolution order for Submodels

1. **Descriptor endpoint** — if the AAS descriptor already contains submodel descriptors
   with endpoints, use those directly
2. **Submodel Registry** — look up the submodel descriptor; extract the endpoint URL
3. **Submodel Repository** — fall back to the configured `SUBMODEL_REPO_API_URL`

### How AAS resolution works

```mermaid
flowchart TD
    Start([User searches for AAS by Asset ID or AAS ID]) --> IsAssetId{Input is Asset ID?}

    IsAssetId -->|Yes| Discovery[Query Discovery Service]
    IsAssetId -->|No| Registry

    Discovery -->|AAS ID found| Registry[Query AAS Registry]
    Discovery -->|Not found| RepoFallback[Query AAS Repositories directly]

    Registry -->|Descriptor with endpoint found| UseRegistryEndpoint[Fetch AAS from descriptor endpoint URL]
    Registry -->|No descriptor found| RepoFallback

    UseRegistryEndpoint -->|Success| ReturnAAS([Return AAS + Submodel Descriptors])
    UseRegistryEndpoint -->|Fail: endpoint unreachable| Error([Error — check if endpoint URL is reachable from Mnestix container])

    RepoFallback -->|Found| ReturnAAS
    RepoFallback -->|Not found| NotFound([AAS not found])

    style Error fill:#f96,stroke:#c00
    style ReturnAAS fill:#9f9,stroke:#090
    style NotFound fill:#ff9,stroke:#cc0
```

### How Submodel resolution works

```mermaid
flowchart TD
    Start([AAS loaded — resolve Submodel reference]) --> HasDescriptor{Submodel Descriptor with endpoint already provided?}

    HasDescriptor -->|Yes| UseDescriptorEndpoint[Fetch Submodel from descriptor endpoint URL]
    HasDescriptor -->|No| QuerySmRegistry[Query Submodel Registry by Submodel ID]

    QuerySmRegistry -->|Descriptor with endpoint found| UseRegistryEndpoint[Fetch Submodel from registry endpoint URL]
    QuerySmRegistry -->|No descriptor found| RepoFallback[Query Submodel Repositories directly]

    UseDescriptorEndpoint -->|Success| ReturnSM([Return Submodel])
    UseDescriptorEndpoint -->|Fail| Error([Error — descriptor endpoint unreachable])

    UseRegistryEndpoint -->|Success| ReturnSM
    UseRegistryEndpoint -->|Fail| Error

    RepoFallback -->|Found| ReturnSM
    RepoFallback -->|Not found| NotFound([Submodel not found])

    style Error fill:#f96,stroke:#c00
    style ReturnSM fill:#9f9,stroke:#090
    style NotFound fill:#ff9,stroke:#cc0
```

> **Key takeaway:** If a registry descriptor exists and contains an endpoint, that endpoint
> is used — your configured `AAS_REPO_API_URL` / `SUBMODEL_REPO_API_URL` is bypassed.
> This is why broken descriptor endpoints cause failures even when your repository config
> is correct.

### The critical point: Descriptors override configured endpoints

When you register an AAS or Submodel in a BaSyx registry, the registration includes an
`endpoints` array. For example:

```json
{
  "endpoints": [
    {
      "protocolInformation": {
        "href": "http://localhost:8081/api/v3.0/submodels/BASE64ENCODEDID"
      },
      "interface": "SUBMODEL-3.0"
    }
  ]
}
```

**Mnestix Browser will use the `href` from the descriptor verbatim.** If that URL contains
`localhost`, Mnestix Browser's backend will try to reach `localhost:8081` — which resolves
to the Mnestix container itself, not to the AAS Environment.

### Example request flow

```
User opens AAS in browser
  │
  ▼
Mnestix Server queries AAS Registry
  │
  ▼
Registry returns descriptor with endpoint:
  "href": "http://localhost:8081/api/v3.0/shells/..."
  │
  ▼
Mnestix Server tries GET http://localhost:8081/api/v3.0/shells/...
  │
  ▼
FAILS — nothing listens on port 8081 inside the mnestix-browser container
```

The configured `AAS_REPO_API_URL: "http://aas-environment:8081"` is never used because
the registry descriptor took priority.

### How to fix descriptor endpoints

When registering AAS/Submodels in a BaSyx registry, the endpoint `href` must be reachable
from the Mnestix Browser container. Use Docker service names:

```json
{
  "endpoints": [
    {
      "protocolInformation": {
        "href": "http://aas-environment:8081/api/v3.0/submodels/BASE64ENCODEDID"
      },
      "interface": "SUBMODEL-3.0"
    }
  ]
}
```

---

## 4. Common Deployment Pitfalls

### Pitfall 1: "Submodels not found at localhost:8081"

**Symptom:** AAS loads, but submodels show errors or are empty.

**Cause:** Registry descriptors contain `localhost:8081` endpoints. Mnestix Backend tries
to reach `localhost:8081`, which is the Mnestix container itself.

**Fix:** Re-register your AAS/Submodel descriptors with endpoints using Docker service names
(e.g., `http://aas-environment:8081/...`).

### Pitfall 2: Using published ports instead of internal ports

**Symptom:** Configuration uses `http://aas-registry:8083` but requests fail.

**Cause:** The AAS registry container listens on port 8080 internally. The `8083:8080`
mapping only applies to host-to-container access.

**Fix:** Use the internal port:
```yaml
# Wrong (8083 is the host-mapped port)
REGISTRY_API_URL: "http://aas-registry:8083"

# Correct (8080 is the actual port inside the container)
REGISTRY_API_URL: "http://aas-registry:8080"
```

> Note: The default `compose.yml` uses `https://aas-registry:8083/` which works because
> the registry's internal server port is configured to match. Always check the target
> service's actual listening port.

### Pitfall 3: Registry descriptors pointing to unreachable endpoints

**Symptom:** Some AAS/Submodels work, others don't — inconsistent behavior.

**Cause:** Descriptors were registered from different environments. Some contain
`localhost` URLs, some contain hostnames that only resolve in a different network.

**Fix:** Audit your registry entries. Every `href` in every descriptor must be resolvable
from the Mnestix Browser container. Use a consistent base URL when registering.

```bash
# Check what endpoints your registry returns
curl http://localhost:8083/api/v3.0/shell-descriptors | jq '.[].endpoints'
```

### Pitfall 4: Misunderstanding proxy vs. direct mode

Mnestix Browser supports two deployment patterns:

| Mode | Config pattern | When to use |
|------|---------------|-------------|
| **With Mnestix Proxy** (default `compose.yml`) | URLs point to `http://mnestix-proxy:5065/repo`, `http://mnestix-proxy:5065/discovery` | When you need API key authentication, centralized routing, or the AAS Generator |
| **Direct / Frontend-only** (`compose.frontend.yml`) | URLs point directly to BaSyx services: `http://aas-environment:8081`, `http://aas-discovery:8081` | When you only need read access to existing infrastructure without the proxy layer |

**Common mistake:** Mixing patterns — pointing some URLs at the proxy and others directly
at BaSyx services without the proxy being configured to route those paths.

---

## 5. Recommended Deployment Patterns

### Pattern A: All components on one Docker network (recommended)

All services share a single bridge network and communicate via service names.

```yaml
networks:
  mnestix-network:
    driver: bridge

services:
  mnestix-browser:
    environment:
      AAS_REPO_API_URL: "http://aas-environment:8081"
      SUBMODEL_REPO_API_URL: "http://aas-environment:8081"
      REGISTRY_API_URL: "http://aas-registry:8080"
      SUBMODEL_REGISTRY_API_URL: "http://submodel-registry:8080"
      DISCOVERY_API_URL: "http://aas-discovery:8081"
    networks:
      - mnestix-network

  aas-environment:
    image: eclipsebasyx/aas-environment:2.0.0-milestone-08
    networks:
      - mnestix-network

  aas-registry:
    image: eclipsebasyx/aas-registry-log-mongodb:2.0.0-milestone-08
    ports:
      - "8083:8080"  # host access only; inter-container uses port 8080
    networks:
      - mnestix-network
  # ... other services on the same network
```

**Advantages:** Simple, predictable, no host dependencies.

**Requirement:** Descriptor endpoints in registries must also use service names.

### Pattern B: Host network mode (Linux only)

All containers share the host's network namespace. `localhost` works everywhere.

```yaml
services:
  mnestix-browser:
    network_mode: host
    environment:
      AAS_REPO_API_URL: "http://localhost:8081"
      REGISTRY_API_URL: "http://localhost:8083"

  aas-environment:
    network_mode: host
    # no ports mapping needed — already on host network
```

**Caveats:**
- Only works on Linux (not Docker Desktop on macOS/Windows).
- Port conflicts if anything on the host already uses those ports.
- No network isolation between containers.
- `localhost` in registry descriptors will work, but the setup is not portable.

### Pattern C: Local non-Docker installation (debugging)

Run Mnestix Browser directly on the host via `npm run dev`, with BaSyx services either
in Docker (with published ports) or also running locally.

```bash
# .env.local
AAS_REPO_API_URL=http://localhost:8081
SUBMODEL_REPO_API_URL=http://localhost:8081
REGISTRY_API_URL=http://localhost:8083
SUBMODEL_REGISTRY_API_URL=http://localhost:8084
DISCOVERY_API_URL=http://localhost:8081
```

Here, `localhost` is valid because the Next.js process runs directly on the host machine
and reaches BaSyx via the published Docker ports.

**Use case:** Debugging networking issues. If it works locally but not in Docker, the
problem is container networking or descriptor endpoints.

---

## 6. Minimal Working Examples

### Example 1: Working docker-compose setup (direct mode, no proxy)

A minimal setup with Mnestix Browser talking directly to BaSyx services:

```yaml
networks:
  aas-network:
    driver: bridge

volumes:
  mongo-data:

services:
  mnestix-browser:
    image: mnestix/mnestix-browser:latest
    ports:
      - "3000:3000"
    environment:
      AAS_REPO_API_URL: "http://aas-environment:8081"
      SUBMODEL_REPO_API_URL: "http://aas-environment:8081"
      REGISTRY_API_URL: "http://aas-registry:8080"
      SUBMODEL_REGISTRY_API_URL: "http://submodel-registry:8080"
      DISCOVERY_API_URL: "http://aas-discovery:8081"
      AAS_LIST_FEATURE_FLAG: "true"
      COMPARISON_FEATURE_FLAG: "true"
      AUTHENTICATION_FEATURE_FLAG: "false"
      LOCK_TIMESERIES_PERIOD_FEATURE_FLAG: "true"
    depends_on:
      aas-environment:
        condition: service_healthy
    networks:
      - aas-network

  mongodb:
    image: mongo:8
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongoAdmin
      MONGO_INITDB_ROOT_PASSWORD: mongoPassword
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh mongodb:27017/test --quiet
      interval: 3s
      timeout: 3s
      retries: 5
    networks:
      - aas-network
    volumes:
      - mongo-data:/data/db

  aas-environment:
    image: eclipsebasyx/aas-environment:2.0.0-milestone-08
    depends_on:
      mongodb:
        condition: service_healthy
    ports:
      - "8081:8081"
    environment:
      BASYX__BACKEND: MongoDB
      SPRING__DATA__MONGODB__HOST: mongodb
      SPRING__DATA__MONGODB__DATABASE: basyxdb
      SPRING__DATA__MONGODB__authentication-database: admin
      SPRING__DATA__MONGODB__USERNAME: mongoAdmin
      SPRING__DATA__MONGODB__PASSWORD: mongoPassword
    healthcheck:
      test: curl -f http://localhost:8081/actuator/health
      interval: 10s
      timeout: 15s
      retries: 8
    networks:
      - aas-network

  aas-discovery:
    image: eclipsebasyx/aas-discovery:2.0.0-milestone-08
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      BASYX__BACKEND: MongoDB
      SPRING__DATA__MONGODB__HOST: mongodb
      SPRING__DATA__MONGODB__DATABASE: basyxdb
      SPRING__DATA__MONGODB__authentication-database: admin
      SPRING__DATA__MONGODB__USERNAME: mongoAdmin
      SPRING__DATA__MONGODB__PASSWORD: mongoPassword
    networks:
      - aas-network

  aas-registry:
    image: eclipsebasyx/aas-registry-log-mongodb:2.0.0-milestone-08
    ports:
      - "8083:8080"
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongoAdmin:mongoPassword@mongodb:27017/?authSource=admin
    networks:
      - aas-network

  submodel-registry:
    image: eclipsebasyx/submodel-registry-log-mongodb:2.0.0-milestone-08
    ports:
      - "8084:8080"
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongoAdmin:mongoPassword@mongodb:27017/?authSource=admin
    networks:
      - aas-network
```

### Example 2: Correct endpoint configuration (with Mnestix Proxy)

Using the full stack with the Mnestix Proxy for centralized routing and API key auth:

```yaml
# In mnestix-browser service environment:
environment:
  # Routes through the proxy — proxy forwards to aas-environment:8081
  AAS_REPO_API_URL: "http://mnestix-proxy:5065/repo"
  SUBMODEL_REPO_API_URL: "http://mnestix-proxy:5065/repo"
  DISCOVERY_API_URL: "http://mnestix-proxy:5065/discovery"
  # Registries contacted directly (no proxy needed for read-only access)
  REGISTRY_API_URL: "http://aas-registry:8080"
  SUBMODEL_REGISTRY_API_URL: "http://submodel-registry:8080"
  # Shared API key for proxy authentication
  MNESTIX_BACKEND_API_KEY: "your-secure-api-key"

# In mnestix-proxy service environment:
environment:
  CustomerEndpointsSecurity__ApiKey: "your-secure-api-key"
  ReverseProxy__Clusters__aasRepoCluster__Destinations__destination1__Address: "http://aas-environment:8081/"
  ReverseProxy__Clusters__submodelRepoCluster__Destinations__destination1__Address: "http://aas-environment:8081/"
  ReverseProxy__Clusters__discoveryCluster__Destinations__destination1__Address: "http://aas-discovery:8081/"
```

### Example 3: Incorrect configuration (and why it fails)

```yaml
# WRONG — do not use this
services:
  mnestix-browser:
    ports:
      - "3000:3000"
    environment:
      # WRONG: localhost from inside mnestix-browser container = the container itself
      AAS_REPO_API_URL: "http://localhost:8081"
      SUBMODEL_REPO_API_URL: "http://localhost:8081"
      # WRONG: 8083 is the HOST-mapped port; inside Docker, registry listens on 8080
      REGISTRY_API_URL: "http://aas-registry:8083"
      # WRONG: mixing host-style URL with container name
      DISCOVERY_API_URL: "http://localhost:8081"
```

**Why each line fails:**

| Line | Problem | Fix |
|------|---------|-----|
| `AAS_REPO_API_URL: "http://localhost:8081"` | `localhost` = mnestix-browser container, not aas-environment | `http://aas-environment:8081` |
| `REGISTRY_API_URL: "http://aas-registry:8083"` | 8083 is the host port mapping; container listens on 8080 | `http://aas-registry:8080` |
| `DISCOVERY_API_URL: "http://localhost:8081"` | Same localhost problem | `http://aas-discovery:8081` |

---

## Quick Reference: Debugging Checklist

When submodels or AAS are not loading:

1. **Check if it's a descriptor problem:**
   ```bash
   curl http://localhost:8083/api/v3.0/shell-descriptors | jq '.result[].endpoints'
   ```
   If any `href` contains `localhost`, that's your problem.

2. **Check if Mnestix can reach the target service:**
   ```bash
   docker exec mnestix-browser wget -qO- http://aas-environment:8081/actuator/health
   ```

3. **Check which network the containers are on:**
   ```bash
   docker network inspect mnestix-network
   ```
   Verify all relevant services are listed.

4. **Check the Mnestix Browser logs for failed requests:**
   ```bash
   docker logs mnestix-browser 2>&1 | grep -i "error\|ECONNREFUSED\|ENOTFOUND"
   ```

5. **Test with local (non-Docker) Mnestix Browser** to isolate whether the issue is
   container networking or something else entirely.
