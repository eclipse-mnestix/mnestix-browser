'use server';

import { Submodel } from 'lib/api/aas/models';
import {
    ApiResponseWrapper,
    wrapErrorCode,
    wrapResponse,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus, httpStatusMessage } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { ResponseError } from 'lib/api/mnestix-aas-generator/v2/runtime';
import { encodeBase64 } from 'lib/util/Base64Util';
import {
    AasGeneratorApiVersion,
    resolveTemplateApiVersion,
    createVersionedAasGeneratorClients,
} from './aasGeneratorVersioning';

const mapStatusToResult = (status: number): ApiResultStatus => {
    if (httpStatusMessage[status]) {
        return httpStatusMessage[status];
    }

    if (status >= 500) {
        return ApiResultStatus.INTERNAL_SERVER_ERROR;
    }

    if (status >= 400) {
        return ApiResultStatus.UNKNOWN_ERROR;
    }

    return ApiResultStatus.SUCCESS;
};

const handleResponseError = async <T>(error: ResponseError): Promise<ApiResponseWrapper<T>> => {
    let parsedBody: T | undefined;

    try {
        const clone = error.response.clone();
        const contentType = clone.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
            parsedBody = (await clone.json()) as T;
        }
    } catch {
        // ignore json parsing errors, we'll return without body information
    }

    return wrapErrorCode(
        mapStatusToResult(error.response.status),
        error.response.statusText,
        error.response.status,
        parsedBody,
    );
};

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
    apiVersion?: AasGeneratorApiVersion,
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
    apiVersion?: AasGeneratorApiVersion,
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
