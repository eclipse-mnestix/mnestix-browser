'use server';

import { Submodel } from 'lib/api/aas/models';
import {
    ApiResponseWrapper,
    wrapResponse,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ResponseError } from 'lib/api/mnestix-aas-generator/v2/runtime';
import {
    AasGeneratorApiVersion,
    resolveTemplateApiVersion,
    createVersionedAasGeneratorClients,
} from './aasGeneratorVersioning';
import { handleResponseError } from './apiHelper';

export async function getTemplates(apiVersion?: AasGeneratorApiVersion): Promise<ApiResponseWrapper<Submodel[]>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            const response = await clients.v2.templatesApi.templatesGetAllTemplatesRaw();
            return await wrapResponse<Submodel[]>(response.raw);
        } catch (error) {
            if (error instanceof ResponseError) {
                return handleResponseError<Submodel[]>(error);
            }
            throw error;
        }
    }

    return clients.v1.shellApi.getTemplates();
}
