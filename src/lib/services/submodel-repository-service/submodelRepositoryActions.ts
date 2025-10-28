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

