import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import {
    ApiResponseWrapper,
    wrapErrorCode,
    wrapResponse,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import ServiceReachable from 'test-utils/TestUtils';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { PaginationData } from 'lib/api/basyx-v3/types';

export type AasRegistryEndpointEntryInMemory = {
    endpoint: URL | string;
    aas: AssetAdministrationShell;
};

const options = {
    headers: { 'Content-type': 'application/json; charset=utf-8' },
};

export class RegistryServiceApiInMemory implements IRegistryServiceApi {
    constructor(
        readonly baseUrl: string,
        readonly registryShellDescriptors: AssetAdministrationShellDescriptor[],
        readonly registryShellEndpoints: AasRegistryEndpointEntryInMemory[],
        readonly reachable: ServiceReachable = ServiceReachable.Yes,
    ) {}

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async getAllAssetAdministrationShellDescriptors(
        limit?: number,
        cursor?: string,
    ): Promise<ApiResponseWrapper<PaginationData<AssetAdministrationShellDescriptor[]>>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');

        const startIndex = cursor ? parseInt(cursor, 10) : 0;
        const endIndex = limit ? startIndex + limit : this.registryShellDescriptors.length;
        const descriptors = this.registryShellDescriptors.slice(startIndex, endIndex);
        const nextCursor = endIndex < this.registryShellDescriptors.length ? endIndex.toString() : '';

        const paginationData: PaginationData<AssetAdministrationShellDescriptor[]> = {
            result: descriptors,
            paging_metadata: {
                cursor: nextCursor,
            },
        };

        const response = new Response(JSON.stringify(paginationData), options);
        const value = await wrapResponse<PaginationData<AssetAdministrationShellDescriptor[]>>(response);
        return Promise.resolve(value);
    }

    async postAssetAdministrationShellDescriptor(
        shellDescriptor: AssetAdministrationShellDescriptor,
    ): Promise<ApiResponseWrapper<void>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        if (this.registryShellDescriptors.find((descriptor) => descriptor.id === shellDescriptor.id))
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Shell Descriptor for AAS '${shellDescriptor.id}' already registered at '${this.getBaseUrl()}'`,
            );
        this.registryShellDescriptors.push(shellDescriptor);
        return wrapSuccess(undefined);
    }

    async getAssetAdministrationShellDescriptorById(
        aasId: string,
    ): Promise<ApiResponseWrapper<AssetAdministrationShellDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundDescriptor = this.registryShellDescriptors.find((shellDescriptor) => shellDescriptor.id === aasId);
        if (!foundDescriptor) {
            return Promise.resolve(
                wrapErrorCode(
                    ApiResultStatus.NOT_FOUND,
                    `no shell descriptor for aasId '${aasId}' found in registry '${this.baseUrl}'`,
                ),
            );
        }

        const response = new Response(JSON.stringify(foundDescriptor), options);
        const value = await wrapResponse<AssetAdministrationShellDescriptor>(response);
        return Promise.resolve(value);
    }

    async getAssetAdministrationShellFromEndpoint(
        endpoint: URL,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundEndpoint = this.registryShellEndpoints.find(
            (shellEndpoint) => shellEndpoint.endpoint.toString() === endpoint.toString(),
        );
        if (!foundEndpoint) {
            return Promise.resolve(
                wrapErrorCode(
                    ApiResultStatus.NOT_FOUND,
                    `no shell for endpoint '${endpoint}' found in registry '${this.getBaseUrl()}`,
                ),
            );
        }

        const response = new Response(JSON.stringify(foundEndpoint.aas), options);
        const value = await wrapResponse<AssetAdministrationShell>(response);
        return Promise.resolve(value);
    }

    async putAssetAdministrationShellDescriptorById(
        _aasId: string,
        _shellDescriptor: AssetAdministrationShellDescriptor,
    ): Promise<ApiResponseWrapper<AssetAdministrationShellDescriptor>> {
        throw new Error('Method not implemented.');
    }
}
