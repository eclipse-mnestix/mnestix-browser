import { DiscoveryEntry, IDiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApiInterface';
import {
    ApiResponseWrapper,
    ApiResultStatus,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { SpecificAssetId } from '@aas-core-works/aas-core3.0-typescript/types';
import { isEqual } from 'lodash';
import ServiceReachable from 'test-utils/TestUtils';

export class DiscoveryServiceApiInMemory implements IDiscoveryServiceApi {
    constructor(
        protected baseUrl: string,
        protected discoveryEntries: { assetId: string; aasId: string }[],
        protected reachable: ServiceReachable = ServiceReachable.Yes,
    ) {}

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async linkAasIdAndAssetId(
        aasId: string,
        assetId: string,
        _apikey?: string,
    ): Promise<ApiResponseWrapper<DiscoveryEntry>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const newEntry = {
            aasId: aasId,
            assetId: assetId,
        };
        if (this.discoveryEntries.find((value) => isEqual(value, newEntry))) {
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Link for AAS '${aasId}' and asset '${assetId}' already in Discovery '${this.baseUrl}'`,
            );
        }
        this.discoveryEntries.push(newEntry);
        const discoveryEntry = {
            aasId: aasId,
            asset: {
                name: 'globalAssetId',
                value: assetId,
            },
        } as DiscoveryEntry;
        return wrapSuccess(discoveryEntry);
    }

    async getAasIdsByAssetId(assetId: string): Promise<ApiResponseWrapper<string[]>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundEntries = this.discoveryEntries.filter((entry) => entry.assetId === assetId);
        if (foundEntries.length <= 0) {
            return Promise.resolve(
                wrapErrorCode(
                    ApiResultStatus.NOT_FOUND,
                    `No AAS with ID '${assetId}' found in Discovery '${this.baseUrl}'`,
                ),
            );
        }

        return Promise.resolve(wrapSuccess(foundEntries.map((entry) => entry.aasId)));
    }

    async deleteAllAssetLinksById(_aasId: string): Promise<ApiResponseWrapper<void>> {
        throw new Error('Method not implemented.');
    }

    async getAllAssetAdministrationShellIdsByAssetLink(
        assetIds: SpecificAssetId[],
    ): Promise<ApiResponseWrapper<string[]>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const ids = assetIds.map((id) => id.value);
        const foundEntries = this.discoveryEntries.filter((entry) => ids.includes(entry.assetId));
        if (foundEntries.length <= 0) {
            return Promise.resolve(
                wrapErrorCode(
                    ApiResultStatus.NOT_FOUND,
                    `No AAS with given specific asset IDs found in Discovery '${this.baseUrl}'`,
                ),
            );
        }

        return wrapSuccess(foundEntries.map((entry) => entry.aasId));
    }

    async getAllAssetLinksById(_aasId: string): Promise<ApiResponseWrapper<SpecificAssetId[]>> {
        throw new Error('Method not implemented.');
    }

    async postAllAssetLinksById(
        aasId: string,
        assetLinks: SpecificAssetId,
    ): Promise<ApiResponseWrapper<SpecificAssetId>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const newEntry = {
            aasId: aasId,
            assetId: assetLinks.value,
        };
        if (this.discoveryEntries.includes(newEntry)) {
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Link for AAS '${aasId}' and asset '${assetLinks.value}' already in Discovery '${this.baseUrl}'`,
            );
        }
        this.discoveryEntries.push(newEntry);
        return wrapSuccess(assetLinks);
    }
}
