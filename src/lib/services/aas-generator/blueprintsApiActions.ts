'use server';

import { Submodel } from 'lib/api/aas/models';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import {
    AasGeneratorApiVersion,
    createVersionedAasGeneratorClients,
    initializeAasGeneratorApiDependencies,
    resolveTemplateApiVersion,
} from './aasGeneratorVersioning';
import { ResponseError as ResponseErrorV1 } from 'lib/api/mnestix-aas-generator/v1/runtime';
import { ResponseError as ResponseErrorV2 } from 'lib/api/mnestix-aas-generator/v2/runtime';
import { ApiResponseWrapper, wrapResponse, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { mapStatusToResult } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { encodeBase64 } from 'lib/util/Base64Util';
import { handleResponseError } from './apiHelper';

const isResponseError = (error: unknown): error is ResponseErrorV1 | ResponseErrorV2 =>
    error instanceof ResponseErrorV1 || error instanceof ResponseErrorV2;

const asV1ResponseError = (error: ResponseErrorV1 | ResponseErrorV2): ResponseErrorV1 =>
    error instanceof ResponseErrorV1 ? error : (error as unknown as ResponseErrorV1);

export async function createBlueprint(
    template: Submodel | typeof EmptyDefaultTemplate,
    apiVersion?: AasGeneratorApiVersion,
): Promise<ApiResponseWrapper<string>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            const createdId = await clients.v2.blueprintsApi.blueprintsCreateBlueprint({
                body: template,
            });
            return wrapSuccess<string>(createdId);
        } catch (error) {
            if (isResponseError(error)) {
                return handleResponseError<string>(asV1ResponseError(error));
            }
            throw error;
        }
    }

    try {
        const createdId = await clients.v1.templateClient.templateCreateCustomSubmodel({ body: template });
        return wrapSuccess<string>(createdId);
    } catch (error) {
        if (isResponseError(error)) {
            return handleResponseError<string>(asV1ResponseError(error));
        }
        throw error;
    }
}

export async function updateBlueprint(
    submodel: Submodel,
    submodelId: string,
    apiVersion?: AasGeneratorApiVersion,
): Promise<ApiResponseWrapper<void>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            await clients.v2.blueprintsApi.blueprintsUpdateBlueprint({
                submodelId,
                body: submodel,
            });
            return wrapSuccess<void>(undefined);
        } catch (error) {
            if (isResponseError(error)) {
                return handleResponseError<void>(asV1ResponseError(error));
            }
            throw error;
        }
    }

    try {
        await clients.v1.templateClient.templateUpdateCustomSubmodel({ submodelId, body: submodel });
        return wrapSuccess<void>(undefined);
    } catch (error) {
        if (isResponseError(error)) {
            return handleResponseError<void>(asV1ResponseError(error));
        }
        throw error;
    }
}

export async function getBlueprints(apiVersion?: AasGeneratorApiVersion): Promise<ApiResponseWrapper<Submodel[]>> {
    const version = resolveTemplateApiVersion(apiVersion);
    const clients = await createVersionedAasGeneratorClients();

    if (version === 'v2') {
        try {
            const response = await clients.v2.blueprintsApi.blueprintsGetAllBlueprintsRaw();
            return await wrapResponse<Submodel[]>(response.raw);
        } catch (error) {
            if (isResponseError(error)) {
                return handleResponseError<Submodel[]>(asV1ResponseError(error));
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
            if (isResponseError(error)) {
                return handleResponseError<Submodel>(asV1ResponseError(error));
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
            if (isResponseError(error)) {
                return handleResponseError<string | number>(asV1ResponseError(error));
            }
            throw error;
        }
    }

    return clients.v1.shellApi.deleteBlueprintById(id);
}

