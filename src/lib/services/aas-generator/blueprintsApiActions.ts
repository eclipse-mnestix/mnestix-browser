'use server';

import { Submodel } from 'lib/api/aas/models';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import {
    AasGeneratorApiVersion,
    createVersionedAasGeneratorClients,
    resolveTemplateApiVersion,
} from './aasGeneratorVersioning';

export async function createBlueprint(
    template: Submodel | typeof EmptyDefaultTemplate,
    apiVersion?: AasGeneratorApiVersion,
): Promise<string> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        return clients.v2.blueprintsApi.blueprintsCreateBlueprint({
            body: template,
        });
    }

    return clients.v1.templateClient.createCustomSubmodel(template);
}

export async function updateBlueprint(
    submodel: Submodel,
    submodelId: string,
    apiVersion?: AasGeneratorApiVersion,
): Promise<void> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        return clients.v2.blueprintsApi.blueprintsUpdateBlueprint({
            submodelId,
            body: submodel,
        });
    }

    return clients.v1.templateClient.updateCustomSubmodel(submodel, submodelId);
}
