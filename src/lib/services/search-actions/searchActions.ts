'use server';

import { AasSearcher, AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { mnestixFetch } from 'lib/api/infrastructure';
import { SubmodelSearcher, SubmodelSearchResult } from 'lib/services/searchUtilActions/SubmodelSearcher';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { headers } from 'next/headers';
import { createRequestLogger, logInfo } from 'lib/util/Logger';

export async function performFullAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performFullAasSearch', 'Initiating AAS/AssetId request', { Requested_ID: searchInput });
    const searcher = AasSearcher.create(logger);
    return searcher.performFullSearch(searchInput);
}

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

export async function performRegistryAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performRegistryAasSearch', 'Requested AAS', { requestedId: searchInput });
    const searcher = AasSearcher.create(logger);
    return searcher.performRegistrySearch(searchInput);
}

export async function performDiscoveryAasSearch(searchInput: string): Promise<ApiResponseWrapper<string[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performDiscoveryAasSearch', 'Requested AssetId', { requestedId: searchInput });
    const searcher = AasSearcher.create(logger);
    return searcher.performAasDiscoverySearch(searchInput);
}

export async function getSubmodelFromSubmodelDescriptor(url: string): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getSubmodelFromSubmodelDescriptor', 'Requested Submodel', { submodelDescriptor: url });
    const localFetch = mnestixFetch();
    return localFetch.fetch<Submodel>(url, {
        method: 'GET',
    });
}

export async function performSubmodelFullSearch(
    submodelReference: Reference,
    submodelDescriptor?: SubmodelDescriptor,
): Promise<ApiResponseWrapper<SubmodelSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSubmodelFullSearch', 'Requested SubmodelReference', {
        referenceId: submodelReference.keys,
    });
    const searcher = SubmodelSearcher.create(logger);
    return searcher.performSubmodelFullSearch(submodelReference, submodelDescriptor);
}
