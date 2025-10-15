'use server';

import { Submodel } from 'lib/api/aas/models';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import {
    AasGeneratorApiVersion,
    createVersionedAasGeneratorClients,
    resolveTemplateApiVersion,
} from './aasGeneratorVersioning';
import { ResponseError } from 'lib/api/mnestix-aas-generator/v2';
import { ApiResponseWrapper, wrapResponse, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { mapStatusToResult } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { encodeBase64 } from 'lib/util/Base64Util';
import { handleResponseError } from './apiHelper';

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

    return clients.v1.templateClient.templateCreateCustomSubmodel({ body: template });
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

    return clients.v1.templateClient.templateUpdateCustomSubmodel({ submodelId, body: submodelId });
}

export async function getBlueprints(apiVersion?: AasGeneratorApiVersion): Promise<ApiResponseWrapper<Submodel[]>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            const response = await clients.v2.blueprintsApi.blueprintsGetAllBlueprintsRaw();
            return await wrapResponse<Submodel[]>(response.raw);
        } catch (error) {
            if (error instanceof ResponseError) {
                return handleResponseError<Submodel[]>(error);
            }
            throw error;
        }
    }

    return clients.v1.shellApi.getBlueprints();
}

export async function getBlueprintById(
    id: string,
    apiVersion?: AasGeneratorApiVersion
): Promise<ApiResponseWrapper<Submodel>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            const response = await clients.v2.blueprintsApi.blueprintsGetBlueprintByIdRaw({
                base64EncodedBlueprintId: encodeBase64(id),
            });
            return await wrapResponse<Submodel>(response.raw);
        } catch (error) {
            if (error instanceof ResponseError) {
                return handleResponseError<Submodel>(error);
            }
            throw error;
        }
    }

    return clients.v1.shellApi.getBlueprint(id);
}

export async function deleteBlueprintById(
    id: string,
    apiVersion?: AasGeneratorApiVersion
): Promise<ApiResponseWrapper<string | number>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            const response = await clients.v2.blueprintsApi.blueprintsDeleteBlueprintRaw({
                base64EncodedBlueprintId: encodeBase64(id),
            });

            const status = response.raw.status;
            const statusText = mapStatusToResult(status);

            return wrapSuccess<number>(status, status, statusText);
        } catch (error) {
            if (error instanceof ResponseError) {
                return handleResponseError<string | number>(error);
            }
            throw error;
        }
    }

    return clients.v1.shellApi.deleteBlueprintById(id);
}

