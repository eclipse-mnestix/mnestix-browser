import { encodeBase64 } from 'lib/util/Base64Util';
import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';
import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import {
    AasRegistryEndpointEntryInMemory,
    RegistryServiceApiInMemory,
} from 'lib/api/registry-service-api/registryServiceApiInMemory';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/types';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import path from 'node:path';
import ServiceReachable from 'test-utils/TestUtils';
import Logger, { logResponseInfo } from 'lib/util/Logger';

export class RegistryServiceApi implements IRegistryServiceApi {
    constructor(
        protected baseUrl: string = '',
        protected http: {
            fetch<T>(url: RequestInfo | URL, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        private readonly logger?: typeof Logger,
    ) {}

    static create(
        baseUrl: string,
        mnestixFetch: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        logger?: typeof Logger,
    ) {
        const registryLogger = logger?.child({ Service: RegistryServiceApi.name });
        return new RegistryServiceApi(baseUrl, mnestixFetch, registryLogger);
    }

    static createNull(
        baseUrl: string,
        registryShellDescriptors: AssetAdministrationShellDescriptor[],
        registryShellEndpoints: AasRegistryEndpointEntryInMemory[],
        reachable: ServiceReachable = ServiceReachable.Yes,
    ) {
        return new RegistryServiceApiInMemory(baseUrl, registryShellDescriptors, registryShellEndpoints, reachable);
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async getAssetAdministrationShellDescriptorById(
        aasId: string,
    ): Promise<ApiResponseWrapper<AssetAdministrationShellDescriptor>> {
        const b64_aasId = encodeBase64(aasId);

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'shell-descriptors', b64_aasId));

        const response = await this.http.fetch<AssetAdministrationShellDescriptor>(url, {
            method: 'GET',
            headers,
        });

        if (!response.isSuccess) {
            logResponseInfo(
                this.logger ?? Logger,
                this.getAssetAdministrationShellDescriptorById.name,
                'Registry search failed, no matching AAS entry found',
                response,
                { message: response.message },
            );
            return response;
        }
        logResponseInfo(
            this.logger ?? Logger,
            this.getAssetAdministrationShellDescriptorById.name,
            'Registry search successful, matching AAS entry found',
            response,
        );
        return response;
    }

    async postAssetAdministrationShellDescriptor(
        shellDescriptor: AssetAdministrationShellDescriptor,
    ): Promise<ApiResponseWrapper<void>> {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'shell-descriptors'));

        return await this.http.fetch(url.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify(shellDescriptor),
        });
    }

    async putAssetAdministrationShellDescriptorById(
        aasId: string,
        shellDescriptor: AssetAdministrationShellDescriptor,
    ): Promise<ApiResponseWrapper<AssetAdministrationShellDescriptor>> {
        const b64_aasId = encodeBase64(aasId);

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'shell-descriptors', b64_aasId));

        return this.http.fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(shellDescriptor),
        });
    }

    async getAssetAdministrationShellFromEndpoint(
        endpoint: URL,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const response = await this.http.fetch<AssetAdministrationShell>(endpoint.toString(), { method: 'GET' });
        if (!response.isSuccess) {
            logResponseInfo(
                this.logger ?? Logger,
                this.getAssetAdministrationShellFromEndpoint.name,
                'Registry search failed, no matching AAS entry found',
                response,
                { message: response.message },
            );
            return response;
        }
        logResponseInfo(
            this.logger ?? Logger,
            this.getAssetAdministrationShellFromEndpoint.name,
            'Registry search successful, matching AAS entry found',
            response,
        );
        return response;
    }
}
