'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { TemplateClient } from 'lib/api/generated-api/clients.g';
import { Submodel } from 'lib/api/aas/models';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import { envs } from 'lib/env/MnestixEnv';
import { getDefaultInfrastructure } from './database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export async function createCustomSubmodelTemplate(template: Submodel | typeof EmptyDefaultTemplate): Promise<string> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClientWithAuth = TemplateClient.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL,
        mnestixFetch(securityHeaders),
    );
    return templateApiClientWithAuth.createCustomSubmodel(template);
}

export async function updateCustomSubmodelTemplate(submodel: Submodel, submodelId: string): Promise<void> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClientWithAuth = TemplateClient.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL,
        mnestixFetch(securityHeaders),
    );
    return templateApiClientWithAuth.updateCustomSubmodel(submodel, submodelId);
}
