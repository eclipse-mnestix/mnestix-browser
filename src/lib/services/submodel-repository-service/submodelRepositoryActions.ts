'use server';

import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { getInfrastructureByName } from '../database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { JsonPatchOperation } from 'lib/api/basyx-v3/apiInterface';
import { AttachmentDetails } from 'lib/types/TransferServiceData';

/**
 * Fetches an attachment from a submodel element in a submodel repository.
 * @param submodelId
 * @param submodelElementPath
 * @param submodelRepositoryUrl
 */
export async function getAttachmentFromSubmodelElement(
    submodelId: string,
    submodelElementPath: string,
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<ApiFileDto>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, getAttachmentFromSubmodelElement.name, 'Requested Attachment', {
        submodelId: submodelId,
        submodelElementPath: submodelElementPath,
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const fileSearcher = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const searchResponse = await fileSearcher.getAttachmentFromSubmodelElement(submodelId, submodelElementPath);
    if (!searchResponse.isSuccess) return wrapErrorCode(searchResponse.errorCode, searchResponse.message);
    return wrapFile(searchResponse.result);
}

/**
 * Patches a submodel using JSON Patch operations (RFC 6902).
 * @param submodelId The unique identifier of the submodel
 * @param patchOperations Array of JSON Patch operations
 * @param repository Repository with infrastructure information
 * @deprecated This method is not part of the AAS specification. Use putSubmodelElementByPath instead.
 */
export async function patchSubmodelByJsonPatch(
    submodelId: string,
    patchOperations: JsonPatchOperation[],
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Response>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, patchSubmodelByJsonPatch.name, 'Patching submodel', {
        submodelId: submodelId,
        operationCount: patchOperations.length,
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const submodelApi = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const patchResponse = await submodelApi.patchSubmodelByJsonPatch(submodelId, patchOperations);

    if (!patchResponse.isSuccess) {
        return wrapErrorCode(patchResponse.errorCode, patchResponse.message);
    }

    return patchResponse;
}

/**
 * Replaces a submodel element at a specified path using PUT (AAS Spec: PutSubmodelElementByPath).
 * @param submodelId The unique identifier of the submodel
 * @param idShortPath The path to the submodel element (e.g., "Document.DocumentVersion.Title")
 * @param submodelElement The complete submodel element object to replace
 * @param repository Repository with infrastructure information
 */
export async function putSubmodelElementByPath(
    submodelId: string,
    idShortPath: string,
    submodelElement: object,
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Response>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, putSubmodelElementByPath.name, 'Replacing submodel element', {
        submodelId: submodelId,
        idShortPath: idShortPath,
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const submodelApi = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const putResponse = await submodelApi.putSubmodelElementByPath(submodelId, idShortPath, submodelElement);

    if (!putResponse.isSuccess) {
        return wrapErrorCode(putResponse.errorCode, putResponse.message);
    }

    return putResponse;
}

/**
 * Uploads an attachment to a specific submodel element.
 * @param submodelId The unique identifier of the submodel
 * @param attachmentData The attachment data (file, idShortPath, fileName)
 * @param repository Repository with infrastructure information
 */
export async function putAttachmentToSubmodelElement(
    submodelId: string,
    attachmentData: AttachmentDetails,
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Response>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, putAttachmentToSubmodelElement.name, 'Uploading attachment', {
        submodelId: submodelId,
        fileName: attachmentData.fileName,
        idShortPath: attachmentData.idShortPath,
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const submodelApi = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const uploadResponse = await submodelApi.putAttachmentToSubmodelElement(submodelId, attachmentData);

    if (!uploadResponse.isSuccess) {
        return wrapErrorCode(uploadResponse.errorCode, uploadResponse.message);
    }

    return uploadResponse;
}

/**
 * Posts a new submodel element to the submodel.
 * @param submodelId The unique identifier of the submodel
 * @param submodelElement The complete submodel element object to add
 * @param repository Repository with infrastructure information
 */
export async function postSubmodelElement(
    submodelId: string,
    submodelElement: object,
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Response>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, postSubmodelElement.name, 'Adding submodel element', {
        submodelId: submodelId,
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const submodelApi = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const postResponse = await submodelApi.postSubmodelElement(submodelId, submodelElement);

    if (!postResponse.isSuccess) {
        return wrapErrorCode(postResponse.errorCode, postResponse.message);
    }

    return postResponse;
}

/**
 * Posts a new submodel element to a specific path within the submodel.
 * @param submodelId The unique identifier of the submodel
 * @param idShortPath The path where the element should be added (e.g., "Documents")
 * @param submodelElement The complete submodel element object to add
 * @param repository Repository with infrastructure information
 */
export async function postSubmodelElementByPath(
    submodelId: string,
    idShortPath: string,
    submodelElement: object,
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Response>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, postSubmodelElementByPath.name, 'Adding submodel element at path', {
        submodelId: submodelId,
        idShortPath: idShortPath,
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const submodelApi = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const postResponse = await submodelApi.postSubmodelElementByPath(submodelId, idShortPath, submodelElement);

    if (!postResponse.isSuccess) {
        return wrapErrorCode(postResponse.errorCode, postResponse.message);
    }

    return postResponse;
}
