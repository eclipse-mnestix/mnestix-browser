'use server';
import { mnestixFetch } from 'lib/api/infrastructure';
import { getInfrastructureByName } from './database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { RepositoryWithInfrastructure } from './database/InfrastructureMappedTypes';

export async function fetchFileServerSide(repository: RepositoryWithInfrastructure) {
    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure || undefined);
    const { fetch } = mnestixFetch(securityHeader);
    return await fetch<Blob>(repository.url);
}
