'use server';

import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { headers } from 'next/headers';
import { createRequestLogger, logInfo } from 'lib/util/Logger';

export async function getAasFromRepository(
    aasId: string,
    repositoryUrl: string,
): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getAasFromRepository', 'Requested AAS/AssetID', {
        requestedId: aasId,
        repositoryUrl: repositoryUrl,
    });
    const api = AssetAdministrationShellRepositoryApi.create(repositoryUrl, mnestixFetch());
    return api.getAssetAdministrationShellById(aasId);
}

export async function getSubmodelFromSubmodelDescriptor(url: string): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getSubmodelFromSubmodelDescriptor', 'Requested Submodel', { submodelDescriptor: url });
    const localFetch = mnestixFetch();
    return localFetch.fetch<Submodel>(url, {
        method: 'GET',
    });
}
