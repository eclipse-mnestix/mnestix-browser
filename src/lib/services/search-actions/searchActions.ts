'use server';

import { AasSearcher, AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { mnestixFetch } from 'lib/api/infrastructure';
import { SubmodelSearcher } from 'lib/services/searchUtilActions/SubmodelSearcher';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { headers } from 'next/headers';
import { createRequestLogger, getCorrelationId, logInfo } from 'lib/util/Logger';

export async function performFullAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createRequestLogger(correlationId);
    logInfo(logger, performFullAasSearch.name, 'Initiating AAS/AssetId request', { Requested_ID: searchInput });
    const searcher = AasSearcher.create(logger);
    return searcher.performFullSearch(searchInput);
}

export async function getAasFromRepository(
    aasId: string,
    repositoryUrl: string,
): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createRequestLogger(correlationId);
    logInfo(logger, getAasFromRepository.name, 'Requested AAS/AssetID', {
        requestedId: aasId,
        repositoryUrl: repositoryUrl,
    });
    const api = AssetAdministrationShellRepositoryApi.create(repositoryUrl, mnestixFetch());
    return api.getAssetAdministrationShellById(aasId);
}

export async function performRegistryAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createRequestLogger(correlationId);
    logInfo(logger, performRegistryAasSearch.name, 'Requested AAS', { requestedId: searchInput });
    const searcher = AasSearcher.create(logger);
    return searcher.performRegistrySearch(searchInput);
}

export async function performDiscoveryAasSearch(searchInput: string): Promise<ApiResponseWrapper<string[]>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createRequestLogger(correlationId);
    logInfo(logger, performDiscoveryAasSearch.name, 'Requested AssetId', { requestedId: searchInput });
    const searcher = AasSearcher.create(logger);
    return searcher.performAasDiscoverySearch(searchInput);
}

export async function getSubmodelFromSubmodelDescriptor(url: string): Promise<ApiResponseWrapper<Submodel>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createRequestLogger(correlationId);
    logInfo(logger, getSubmodelFromSubmodelDescriptor.name, 'Requested Submodel', { submodelDescriptor: url });
    const localFetch = mnestixFetch();
    return localFetch.fetch<Submodel>(url, {
        method: 'GET',
    });
}

export async function performSubmodelFullSearch(
    submodelReference: Reference,
    submodelDescriptor?: SubmodelDescriptor,
): Promise<ApiResponseWrapper<Submodel>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createRequestLogger(correlationId);
    logInfo(logger, performSubmodelFullSearch.name, 'Requested SubmodelReference', {
        referenceId: submodelReference.keys,
    });
    const searcher = SubmodelSearcher.create(logger);
    return searcher.performSubmodelFullSearch(submodelReference, submodelDescriptor);
}

export async function checkFileExists(url: string): Promise<ApiResponseWrapper<boolean>> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return wrapSuccess(response.ok);
    } catch {
        return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Exception during network fetch');
    }
}
