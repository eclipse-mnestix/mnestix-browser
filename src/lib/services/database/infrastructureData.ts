/**
 * Server-internal infrastructure data access.
 *
 * IMPORTANT: This module is intentionally NOT a `'use server'` module. The
 * functions here return `InfrastructureConnection` objects that include
 * `infrastructureSecurity` (encrypted header/proxy values, init vectors and
 * auth tags). Exposing them as server actions would make those encrypted
 * secrets retrievable by any client over HTTP. Keep this module importable by
 * server code only; expose UI-facing, non-sensitive shapes via dedicated
 * actions in `infrastructureDatabaseActions.ts`.
 */
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import { envs } from 'lib/env/MnestixEnv';
import {
    InfrastructureConnection,
    InfrastructureWithRelations,
} from 'lib/services/database/InfrastructureMappedTypes';

export const DEFAULT_INFRASTRUCTURE_NAME = 'Default Infrastructure';

export function buildDefaultInfrastructure(): InfrastructureConnection {
    return {
        name: DEFAULT_INFRASTRUCTURE_NAME,
        discoveryUrls: envs.DISCOVERY_API_URL ? [envs.DISCOVERY_API_URL] : [],
        aasRegistryUrls: envs.REGISTRY_API_URL ? [envs.REGISTRY_API_URL] : [],
        aasRepositoryUrls: envs.AAS_REPO_API_URL ? [envs.AAS_REPO_API_URL] : [],
        submodelRepositoryUrls: envs.SUBMODEL_REPO_API_URL ? [envs.SUBMODEL_REPO_API_URL] : [],
        submodelRegistryUrls: envs.SUBMODEL_REGISTRY_API_URL ? [envs.SUBMODEL_REGISTRY_API_URL] : [],
        conceptDescriptionRepositoryUrls: envs.CONCEPT_DESCRIPTION_REPO_API_URL
            ? [envs.CONCEPT_DESCRIPTION_REPO_API_URL]
            : [],
        serializationEndpointUrls: envs.SERIALIZATION_API_URL ? [envs.SERIALIZATION_API_URL] : [],
        isDefault: true,
    };
}

export async function fetchAllInfrastructureConnectionsFromDb(): Promise<InfrastructureConnection[]> {
    const connector = PrismaConnector.create();
    const infrastructures = await connector.getInfrastructures();

    if (!infrastructures) return [];

    return infrastructures.map((infra) => infrastructureMapper(infra));
}

export async function getInfrastructuresIncludingDefault(): Promise<InfrastructureConnection[]> {
    // build default infrastructure from envs
    const defaultInfrastructure = buildDefaultInfrastructure();

    // get from database as flat connection list
    const infrastructures = await fetchAllInfrastructureConnectionsFromDb();

    return [defaultInfrastructure, ...infrastructures];
}

export async function getInfrastructureByName(name: string): Promise<InfrastructureConnection | undefined> {
    const infrastructures = await getInfrastructuresIncludingDefault();
    const found_infrastructure = infrastructures.find((infra) => infra.name === name);
    if (!found_infrastructure) {
        return undefined;
    }
    return found_infrastructure;
}

function infrastructureMapper(infra: InfrastructureWithRelations): InfrastructureConnection {
    return {
        name: infra.name,
        discoveryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'DISCOVERY_SERVICE').map(() => conn.url),
        ),
        aasRegistryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'AAS_REGISTRY').map(() => conn.url),
        ),
        aasRepositoryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'AAS_REPOSITORY').map(() => conn.url),
        ),
        submodelRepositoryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'SUBMODEL_REPOSITORY').map(() => conn.url),
        ),
        submodelRegistryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'SUBMODEL_REGISTRY').map(() => conn.url),
        ),
        conceptDescriptionRepositoryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'CONCEPT_DESCRIPTION').map(() => conn.url),
        ),
        serializationEndpointUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'SERIALIZATION_ENDPOINT').map(() => conn.url),
        ),
        isDefault: false,
        infrastructureSecurity: {
            securityType: infra.securityType.typeName,
            securityHeader: infra.securitySettingsHeaders
                ? {
                      name: infra.securitySettingsHeaders.headerName,
                      value: infra.securitySettingsHeaders.headerValue,
                      initVector: infra.securitySettingsHeaders.initVector,
                      authTag: infra.securitySettingsHeaders.authTag,
                  }
                : undefined,
            securityProxy: infra.securitySettingsProxies
                ? {
                      value: infra.securitySettingsProxies.headerValue,
                      initVector: infra.securitySettingsProxies.initVector,
                      authTag: infra.securitySettingsProxies.authTag,
                  }
                : undefined,
        },
    };
}
