# Different Versions Configuration

## Overview

Mnestix Browser connects to the Mnestix AAS Generator v2.* (formerly known as Mnestix API v1.*). Support for the legacy Mnestix API v1.* has been removed, together with the `MNESTIX_V2_ENABLED` feature flag.

## Version Support Status

### Current Support
- **Mnestix AAS Generator v2.*** - Active development and recommended
- **Mnestix Browser v2.*** - Active development and recommended

### Removed Support
- **Mnestix API v1.*** - No longer supported
- **Mnestix Browser v1.*** - No longer supported

> **Important**: If you are still running Mnestix API v1.*, migrate to the Mnestix AAS Generator before upgrading the Browser. See the migration guide below.

## Configuration Variables

```bash
# Primary endpoint for AAS Generator
MNESTIX_AAS_GENERATOR_API_URL=<your-aas-generator-endpoint>
```

The `MNESTIX_V2_ENABLED` flag and the legacy `MNESTIX_BACKEND_API_URL` endpoint no longer exist. Setting either has no effect.

## Mnestix Proxy Integration

### Overview
Mnestix Proxy is now available as a separate open-source project and serves as an authentication layer.

### Key Features
- Validates API Key & Access Token
- Acts as a security gateway
- Drops requests without successful authentication

### Configuration Requirements

> **Critical**: The API key configured in Mnestix Proxy **must match** the API key configured in Mnestix AAS Generator.

Mnestix Browser sends the API key in the `X-API-KEY` header. The legacy `ApiKey` header used by Mnestix API v1.* is no longer sent.

### Endpoint Configuration

When using Mnestix Proxy:
```bash
# Point to proxy endpoint
MNESTIX_AAS_GENERATOR_API_URL=https://your-proxy-endpoint

# Proxy will forward to actual AAS Generator
```

When connecting directly:
```bash
# Point directly to AAS Generator
MNESTIX_AAS_GENERATOR_API_URL=https://your-aas-generator-endpoint
```

## Migration Guide

### From v1.* to v2.*

1. **Update Environment Variables**:
   ```bash
   # Replace
   MNESTIX_BACKEND_API_URL=<old-endpoint>

   # With
   MNESTIX_AAS_GENERATOR_API_URL=<new-endpoint>
   ```

   If you previously set `MNESTIX_V2_ENABLED=false`, remove it. The variable is gone and v1.* endpoints are no longer called.

2. **Review API Integration**:
   - Update API calls to use new AAS Generator endpoints

3. **Test Configuration**:
   - Verify connectivity to Mnestix AAS Generator
   - Validate Template Builder functionality

### Compatibility Matrix

| Component | v1.* Support | v2.* Support | Recommended |
|-----------|--------------|--------------|-------------|
| Mnestix Browser v1.* | ✅ | ❌ | Migrate to v2.* |
| Mnestix Browser v2.* | ❌ | ✅ | Use v2.* features |
| Mnestix API v1.* | ✅ | ❌ | Migrate to AAS Generator |
| Mnestix AAS Generator v2.* | ❌ | ✅ | Recommended |

## New Features in v2.*

### Mnestix AAS Generator
- **AAS Creator**: Create multiple Asset Administration Shells
- **Submodel Creator**: Bulk creation of submodels
- **Template Builder Integration**: Works seamlessly with Browser's template features

### Enhanced Security
- **Mnestix Proxy**: Centralized authentication and authorization

### Support Resources

- **Mnestix AAS Generator Documentation**: [Link to be provided]
- **Mnestix Proxy Documentation**: [Home · eclipse-mnestix/mnestix-proxy Wiki](https://github.com/eclipse-mnestix/mnestix-proxy/wiki)
- **Migration Support**: Contact the development team for assistance

## Future Considerations

- New features will only be available in v2.* versions
- Security updates will focus on v2.* architecture

---

*Last updated: August 2026*
