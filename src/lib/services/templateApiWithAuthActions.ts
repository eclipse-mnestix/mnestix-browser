'use server';

import { mnestixFetchLegacy } from 'lib/api/infrastructure';
import { TemplateClient } from 'lib/api/generated-api/clients.g';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import { envs } from 'lib/env/MnestixEnv';
import { Submodel } from 'lib/api/aas/models';

const templateApiClientWithAuth = TemplateClient.create(envs.MNESTIX_BACKEND_API_URL, mnestixFetchLegacy());

export async function createCustomSubmodelTemplate(template: Submodel | typeof EmptyDefaultTemplate): Promise<string> {
    return templateApiClientWithAuth.createCustomSubmodel(template);
}

export async function updateCustomSubmodelTemplate(submodel: Submodel, submodelId: string): Promise<void> {
    return templateApiClientWithAuth.updateCustomSubmodel(submodel, submodelId);
}
