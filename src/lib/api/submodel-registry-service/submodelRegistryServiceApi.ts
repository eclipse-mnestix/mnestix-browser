import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { Submodel } from 'lib/api/aas/models';
import path from 'node:path';
import ServiceReachable from 'test-utils/TestUtils';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { SubmodelRegistryServiceApiInMemory } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInMemory';

export class SubmodelRegistryServiceApi implements ISubmodelRegistryServiceApi {
    constructor(
        protected baseUrl: string = '',
        protected http: {
            fetch<T>(url: RequestInfo | URL, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        private readonly log: typeof logger = logger,
    ) {}

    static create(
        baseUrl: string,
        mnestixFetch: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        log?: typeof logger,
    ) {
        const registryLogger = log?.child({ service: 'SubmodelRegistryServiceApi' });
        return new SubmodelRegistryServiceApi(baseUrl, mnestixFetch, registryLogger);
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

        const response = await this.http.fetch<SubmodelDescriptor>(url.toString(), {
            method: 'GET',
            headers,
        });

        if (!response.isSuccess) {
            logResponseDebug(
                this.log,
                'getSubmodelDescriptorById',
                'Failed to get submodel descriptor by id',
                response,
            );
            return response;
        }
        logResponseDebug(this.log, 'getSubmodelDescriptorById', 'Successfully got submodel descriptor by id', response);
        return response;
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

        const response = await this.http.fetch<SubmodelDescriptor[]>(url.toString(), {
            method: 'GET',
            headers,
        });
        if (!response.isSuccess) {
            logResponseDebug(
                this.log,
                'getAllSubmodelDescriptors',
                'Failed to get submodel descriptors by id',
                response,
            );
            return response;
        }
        logResponseDebug(
            this.log,
            'getAllSubmodelDescriptors',
            'Successfully got submodel descriptors by id',
            response,
        );
        return response;
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
        const response = await this.http.fetch<Submodel>(endpoint.toString(), {
            method: 'GET',
        });
        if (!response.isSuccess) {
            logResponseDebug(this.log, 'getSubmodelFromEndpoint', 'Failed to get submodel from endpoint', response);
            return response;
        }
        logResponseDebug(this.log, 'getSubmodelFromEndpoint', 'Successfully got submodel from endpoint', response);
        return response;
    }
}
