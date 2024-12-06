import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { FetchAPI } from 'lib/api/basyx-v3/api';
import {
    ApiResponseWrapper,
    ApiResultStatus,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import path from 'node:path';
import ServiceReachable from 'test-utils/TestUtils';

export class SubmodelRegistryServiceApi implements ISubmodelRegistryServiceApi {
    constructor(
        private baseUrl: string,
        private http: FetchAPI,
    ) {}

    static create(baseUrl: string, mnestixFetch: FetchAPI) {
        return new SubmodelRegistryServiceApi(baseUrl, mnestixFetch);
    }

    static createNull(
        baseUrl: string,
        registrySubmodelDescriptors: SubmodelDescriptor[],
        reachable: ServiceReachable = ServiceReachable.Yes,
    ) {
        return new SubmodelRegistryServiceApiInMemory(baseUrl, registrySubmodelDescriptors, reachable);
    }

    getBasePath(): string {
        return this.baseUrl;
    }

    async getSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const b64_submodelId = encodeBase64(submodelId);

        const headers = {
            Accept: 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'submodel-descriptors', b64_submodelId));

        return await this.http.fetch(url.toString(), {
            method: 'GET',
            headers,
        });
    }

    async putSubmodelDescriptorById(
        submodelDescriptor: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const b64_submodelId = encodeBase64(submodelDescriptor.id);

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'submodel-descriptors', b64_submodelId));

        return await this.http.fetch(url.toString(), {
            method: 'PUT',
            headers,
            body: JSON.stringify(submodelDescriptor),
        });
    }

    async deleteSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<void>> {
        const b64_submodelId = encodeBase64(submodelId);

        const url = new URL(path.posix.join(this.baseUrl, 'submodel-descriptors', b64_submodelId));

        return await this.http.fetch(url.toString(), {
            method: 'DELETE',
        });
    }

    async getAllSubmodelDescriptors(): Promise<ApiResponseWrapper<SubmodelDescriptor[]>> {
        const headers = {
            Accept: 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'submodel-descriptors'));

        return await this.http.fetch(url.toString(), {
            method: 'GET',
            headers,
        });
    }

    async postSubmodelDescriptor(
        submodelDescriptor: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'submodel-descriptors'));

        return await this.http.fetch(url.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify(submodelDescriptor),
        });
    }

    async deleteAllSubmodelDescriptors(): Promise<ApiResponseWrapper<void>> {
        const url = new URL(path.posix.join(this.baseUrl, 'submodel-descriptors'));

        return this.http.fetch(url.toString(), {
            method: 'DELETE',
        });
    }

    async getSubmodelFromEndpoint(endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        return this.http.fetch<Submodel>(endpoint.toString(), {
            method: 'GET',
        });
    }
}

class SubmodelRegistryServiceApiInMemory implements ISubmodelRegistryServiceApi {
    readonly registrySubmodelDescriptors: Map<string, SubmodelDescriptor>;

    constructor(
        readonly baseUrl: string,
        registrySubmodelDescriptors: SubmodelDescriptor[],
        readonly reachable: ServiceReachable,
    ) {
        this.registrySubmodelDescriptors = new Map<string, SubmodelDescriptor>();
        registrySubmodelDescriptors.forEach((submodelDescriptor) => {
            this.registrySubmodelDescriptors.set(submodelDescriptor.id, submodelDescriptor);
        });
    }

    getBasePath(): string {
        return this.baseUrl;
    }

    async getSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundDescriptor = this.registrySubmodelDescriptors.get(submodelId);
        if (foundDescriptor) return wrapSuccess(foundDescriptor);
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `No Submodel descriptor for submodel id '${submodelId}' found in '${this.getBasePath()}'`,
        );
    }

    async putSubmodelDescriptorById(
        submodelDescriptor: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        this.registrySubmodelDescriptors.set(submodelDescriptor.id, submodelDescriptor);
        return wrapSuccess(submodelDescriptor);
    }

    async deleteSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<void>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        this.registrySubmodelDescriptors.delete(submodelId);
        return wrapSuccess(undefined);
    }

    async getAllSubmodelDescriptors(): Promise<ApiResponseWrapper<SubmodelDescriptor[]>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        return wrapSuccess([...this.registrySubmodelDescriptors.values()]);
    }

    async postSubmodelDescriptor(
        submodelDescriptor: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        if (this.registrySubmodelDescriptors.has(submodelDescriptor.id))
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Submodel registry '${this.getBasePath()}' already has a submodel descriptor for '${submodelDescriptor.id}'`,
            );
        this.registrySubmodelDescriptors.set(submodelDescriptor.id, submodelDescriptor);
        return wrapSuccess(submodelDescriptor);
    }

    async deleteAllSubmodelDescriptors(): Promise<ApiResponseWrapper<void>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        this.registrySubmodelDescriptors.clear();
        return wrapSuccess(undefined);
    }

    getSubmodelFromEndpoint(_endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        throw new Error('Method not implemented.');
    }
}
