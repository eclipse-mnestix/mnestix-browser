'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { TemplateClient } from 'lib/api/generated-api/clients.g';
import { Submodel } from 'lib/api/aas/models';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import { envs } from 'lib/env/MnestixEnv';
import { getDefaultInfrastructure } from './database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
//import { Configuration } from 'lib/api/mnestix-aas-generator/v2/runtime';

export async function createBlueprint(template: Submodel | typeof EmptyDefaultTemplate): Promise<string> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
/*    TODO MNE-371
const fetchClient = mnestixFetchRaw(securityHeaders);
 
    const apiConfig = new Configuration({
        basePath: envs.MNESTIX_AAS_GENERATOR_API_URL,
        fetchApi: (input: RequestInfo | URL, init?: RequestInit) => fetchClient.fetch(input, init),
    });

    // TODO if v2:
    const blueprintApiClient = new BlueprintsApi(apiConfig);
    return blueprintApiClient.blueprintsCreateBlueprint({
        apiVersion: 'v2',
        body: template,
    });
 */
    const templateApiClientWithAuth = TemplateClient.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL,
        mnestixFetch(securityHeaders),
    );
    return templateApiClientWithAuth.createCustomSubmodel(template);
}

export async function updateBlueprint(submodel: Submodel, submodelId: string): Promise<void> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClientWithAuth = TemplateClient.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL,
        mnestixFetch(securityHeaders),
    );
    return templateApiClientWithAuth.updateCustomSubmodel(submodel, submodelId);
}
