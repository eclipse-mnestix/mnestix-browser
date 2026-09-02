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
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

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

    try {
        await assertEgressAllowed(repository.url, repository.infrastructureName);
    } catch (error) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, (error as Error).message);
    }

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await securityHeadersForUrl(repository.url, infrastructure);

    const fileSearcher = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));
    const searchResponse = await fileSearcher.getAttachmentFromSubmodelElement(submodelId, submodelElementPath);
    if (!searchResponse.isSuccess) return wrapErrorCode(searchResponse.errorCode, searchResponse.message);
    return wrapFile(searchResponse.result);
}
