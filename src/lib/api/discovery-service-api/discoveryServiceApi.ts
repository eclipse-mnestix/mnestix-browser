import { encodeBase64 } from 'lib/util/Base64Util';
import { DiscoveryEntry, IDiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApiInterface';
import { DiscoveryServiceApiInMemory } from 'lib/api/discovery-service-api/discoveryServiceApiInMemory';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { SpecificAssetId } from '@aas-core-works/aas-core3.0-typescript/types';
import * as path from 'node:path';
import ServiceReachable from 'test-utils/TestUtils';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

type DiscoveryEntryResponse = {
    paging_metadata: object;
    result: string[];
};

export class DiscoveryServiceApi implements IDiscoveryServiceApi {
    private constructor(
        protected baseUrl: string,
        protected http: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        private readonly log: typeof logger = logger,
    ) {}

    static create(
        baseUrl: string,
        http: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        log?: typeof logger,
    ): DiscoveryServiceApi {
        const discoveryLogger = log?.child({ Service: DiscoveryServiceApi.name });

        return new DiscoveryServiceApi(baseUrl, http, discoveryLogger ?? logger);
    }

    static createNull(
        baseUrl: string,
        discoveryEntries: { assetId: string; aasId: string }[],
        reachable: ServiceReachable = ServiceReachable.Yes,
    ): DiscoveryServiceApiInMemory {
        return new DiscoveryServiceApiInMemory(baseUrl, discoveryEntries, reachable);
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async linkAasIdAndAssetId(
        aasId: string,
        assetId: string,
        apikey?: string,
    ): Promise<ApiResponseWrapper<DiscoveryEntry>> {
        const assetLink = {
            name: 'globalAssetId',
            value: assetId,
        } as SpecificAssetId;
        const options = apikey ? { ApiKey: apikey } : undefined;
        const response = await this.postAllAssetLinksById(aasId, assetLink, options);
        if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
        return wrapSuccess({
            aasId: aasId,
            asset: response.result,
        });
    }

    async getAasIdsByAssetId(assetId: string) {
        return this.getAllAssetAdministrationShellIdsByAssetLink([
            {
                name: 'globalAssetId',
                value: assetId,
            } as SpecificAssetId,
        ]);
    }

    async getAllAssetAdministrationShellIdsByAssetLink(
        assetIds: SpecificAssetId[],
        options?: object,
    ): Promise<ApiResponseWrapper<string[]>> {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options,
        };

        const url = new URL(path.posix.join(this.baseUrl, 'lookup/shells'));

        assetIds.forEach((obj) => {
            url.searchParams.append('assetIds', encodeBase64(JSON.stringify(obj)));
        });

        const response = await this.http.fetch<DiscoveryEntryResponse>(url.toString(), {
            method: 'GET',
            headers,
        });

        if (!response.isSuccess) {
            logResponseDebug(
                this.log,
                this.getAllAssetAdministrationShellIdsByAssetLink.name,
                'AAS discovery search unsuccessful',
                response,
                { message: response.message },
            );
            return wrapErrorCode(response.errorCode, response.message, response.httpStatus, response.httpText);
        }

        if (response.result.result.length === 0) {
            logResponseDebug(
                this.log,
                this.getAllAssetAdministrationShellIdsByAssetLink.name,
                'Discovery search returned no results',
                response,
                {
                    Discovered_AAS_IDs: response.result.result,
                    Message: 'No matching Asset Administration Shells found',
                },
            );
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                'No AAS found for assetIds',
                response.httpStatus,
                response.httpText,
            );
        }
        logResponseDebug(
            this.log,
            this.getAllAssetAdministrationShellIdsByAssetLink.name,
            'Discovery search completed successfully',
            response,
            { Discovery_Aas_IDs: response.result.result },
        );
        return wrapSuccess(response.result.result, response.httpStatus, response.httpText);
    }

    async getAllAssetLinksById(aasId: string, options?: object): Promise<ApiResponseWrapper<SpecificAssetId[]>> {
        const b64_aasId = encodeBase64(aasId);

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options,
        };

        const url = path.posix.join(this.baseUrl, 'lookup/shells', b64_aasId);
        return this.http.fetch<SpecificAssetId[]>(url, {
            method: 'GET',
            headers,
        });
    }

    async postAllAssetLinksById(
        aasId: string,
        assetLinks: SpecificAssetId, // this is NOT a list in the specification
        options?: object,
    ): Promise<ApiResponseWrapper<SpecificAssetId>> {
        const b64_aasId = encodeBase64(aasId);

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options,
        };

        const url = path.posix.join(this.baseUrl, 'lookup/shells', b64_aasId);
        return this.http.fetch<SpecificAssetId>(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(assetLinks),
        });
    }

    async deleteAllAssetLinksById(aasId: string, options?: object): Promise<ApiResponseWrapper<void>> {
        const b64_aasId = encodeBase64(aasId);

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options,
        };

        const url = path.posix.join(this.baseUrl, 'lookup/shells', b64_aasId);
        return this.http.fetch(url, {
            method: 'DELETE',
            headers,
        });
    }
}
