import {
    ApiResponseWrapper,
    ApiResponseWrapperSuccess,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { InfrastructureConnection } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { IDiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApiInterface';
import { mnestixFetch } from 'lib/api/infrastructure';
import { DiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApi';
import { getInfrastructures } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';

export type DiscoverySearchResult = {
    aasId: string;
    infrastructureName: string;
    location: string;
};

export class DiscoveryService {
    private constructor(
        protected readonly getDiscoveryApiClient: (basePath: string) => IDiscoveryServiceApi | null,
        private readonly log: typeof logger = logger,
    ) {}
    static create(log?: typeof logger): DiscoveryService {
        const discoveryLogger = log?.child({ Service: 'DiscoverySearchService' });
        return new DiscoveryService(
            (baseUrl) => DiscoveryServiceApi.create(baseUrl, mnestixFetch(), log),
            discoveryLogger,
        );
    }

    static createNull(discoveryEntries: any[] = []): DiscoveryService {
        return new DiscoveryService(
            () => (DiscoveryServiceApi.createNull('', discoveryEntries) as unknown as IDiscoveryServiceApi),
            logger,
        );
    }

    public async searchAasIdInMultipleDiscoveries(
        searchInput: string,
        infrastructureConnection: InfrastructureConnection[],
    ): Promise<ApiResponseWrapper<DiscoverySearchResult[]>> {
        const response = await this.getFromMultipleDiscoveries(
            infrastructureConnection,
            (basePath) => this.searchAasIdInSingleDiscovery(searchInput, basePath),
            'Could not find in any Discovery',
        );

        if (response.isSuccess) {
            return wrapSuccess(response.result);
        }
        return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'Could not find in any Discovery');
    }

    public async searchAASInAllDiscoveries(searchInput: string): Promise<ApiResponseWrapper<DiscoverySearchResult[]>> {
        // Search in all discovery services in all infrastructures
        const infrastructures = await getInfrastructures();
        this.log.info('searchAASInAllDiscoveries', 'Searching AAS in all infrastructures', infrastructures);

        return this.searchAasIdInMultipleDiscoveries(searchInput, infrastructures);
    }

    public async searchAasIdInSingleDiscovery(
        searchAssetId: string,
        url: string,
    ): Promise<ApiResponseWrapper<string[]>> {
        const client = this.getDiscoveryApiClient(url);
        const response = await client?.getAasIdsByAssetId(searchAssetId);
        if (!response) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Discovery service client is not defined');
        }

        if (response?.isSuccess) {
            logResponseDebug(this.log, 'performAasDiscoverySearch', 'Executing AAS discovery search', response, {
                Requested_Asset_ID: searchAssetId,
            });
            return wrapSuccess(response.result);
        }
        logResponseDebug(this.log, 'performAasDiscoverySearch', 'AAS discovery search unsuccessful', response, {
            Requested_Asset_ID: searchAssetId,
        });
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Could not find the asset '${searchAssetId}' in the discovery service`,
        );
    }

    async getFromMultipleDiscoveries<T>(
        infrastructures: InfrastructureConnection[],
        kernel: (url: string) => Promise<ApiResponseWrapper<T>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<DiscoverySearchResult[]>> {
        const promises = infrastructures.flatMap((infrastructure) =>
            infrastructure.discoveryUrls.map((url) => {
                return kernel(url).then((response: ApiResponseWrapper<T>) => {
                    return { searchResult: response, location: url, infrastructureName: infrastructure.name };
                });
            }),
        );

        const responses = await Promise.allSettled(promises);
        const fulfilledResponses = responses.filter(
            (result) => result.status === 'fulfilled' && result.value.searchResult.isSuccess,
        );

        if (fulfilledResponses.length <= 0) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, errorMsg);
        }

        return wrapSuccess<DiscoverySearchResult[]>(
            fulfilledResponses.map(
                (
                    result: PromiseFulfilledResult<{
                        searchResult: ApiResponseWrapperSuccess<T>;
                        location: string;
                        infrastructureName: string;
                    }>,
                ) => {
                    return {
                        aasId: result.value.searchResult.result as string,
                        infrastructureName: result.value.infrastructureName,
                        location: result.value.location,
                    };
                },
            ),
        );
    }
}
