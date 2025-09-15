# Different Versions Configuration

## Overview

With the release of Mnestix AAS Generator v2.* (formerly known as Mnestix API v1.*), new configuration options have been introduced to support version compatibility and migration paths. 

## Version Support Status

### Current Support
- **Mnestix AAS Generator v2.*** - Active development and recommended
- **Mnestix Browser v2.*** - Active development and recommended

### Legacy Support (Temporary)
- **Mnestix API v1.*** - No further development, temporary support only
- **Mnestix Browser v1.*** - No further development, temporary support only

> **Important**: Support for v1.* versions is temporary and will end in the future. Migration to v2.* is strongly recommended.

## Feature Flag Configuration

### MNESTIX_V2_ENABLED

A new feature flag has been introduced to control version compatibility:

```bash
# Enable Mnestix AAS Generator v2.* (default)
MNESTIX_V2_ENABLED=true

# Enable legacy Mnestix API v1.* support
MNESTIX_V2_ENABLED=false
```

- **Default value**: `true`
- **Purpose**: Easy switching between backend versions
- **Recommendation**: Keep as `true` for new deployments

## Configuration Variables

### For Mnestix AAS Generator v2.*

```bash
# Primary endpoint for AAS Generator
MNESTIX_AAS_GENERATOR_API_URL=<your-aas-generator-endpoint>

# Feature flag (default: true)
MNESTIX_V2_ENABLED=true
```

### For Legacy Mnestix API v1.*

```bash
# Legacy backend endpoint (deprecated)
MNESTIX_BACKEND_API_URL=<your-legacy-api-endpoint>

# Feature flag for legacy support
MNESTIX_V2_ENABLED=false
```

## Mnestix Proxy Integration

### Overview
Mnestix Proxy is now available as a separate open-source project and serves as an authentication layer.

### Key Features
- Validates API Key & Access Token
- Acts as a security gateway
- Drops requests without successful authentication

### Configuration Requirements

> **Critical**: The API key configured in Mnestix Proxy **must match** the API key configured in Mnestix AAS Generator.

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

2. **Review API Integration**:
   - Update API calls to use new AAS Generator endpoints

3. **Test Configuration**:
   - Verify connectivity to Mnestix AAS Generator
   - Validate Template Builder functionality

### Compatibility Matrix

| Component | v1.* Support | v2.* Support | Recommended |
|-----------|--------------|--------------|-------------|
| Mnestix Browser v1.* | ✅ | ❌ | Migrate to v2.* |
| Mnestix Browser v2.* | ✅ (temporary) | ✅ | Use v2.* features |
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

- Legacy v1.* support will be removed in future releases
- Migration timeline will be communicated in advance
- New features will only be available in v2.* versions
- Security updates will focus on v2.* architecture

---

*Last updated: September 2025*