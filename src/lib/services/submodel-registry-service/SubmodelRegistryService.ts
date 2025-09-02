import { SubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApi';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { Submodel } from 'lib/api/aas/models';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export class SubmodelRegistryService {
    private constructor(
        protected readonly getSubmodelRegistryClient: (
            basePath: string,
            securityHeader: Record<string, string> | null,
        ) => ISubmodelRegistryServiceApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): SubmodelRegistryService {
        const submodelLogger = log?.child({ Service: 'SubmodelSearcher' });
        return new SubmodelRegistryService(
            (baseUrl, securityHeader) => SubmodelRegistryServiceApi.create(baseUrl, mnestixFetch(securityHeader)),
            submodelLogger,
        );
    }

    static createNull(submodelRegistryDescriptors: SubmodelDescriptor[]) {
        return new SubmodelRegistryService((baseUrl) =>
            SubmodelRegistryServiceApi.createNull(baseUrl, submodelRegistryDescriptors),
        );
    }

    public async searchInMultipleSubmodelRegistries(
        submodelId: string,
        infrastructure: InfrastructureConnection,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const registrySearchResult = await this.getFromMultipleSubmodelRegistries(
            [infrastructure],
            (basePath) => this.searchInSingleSubmodelRegistry(submodelId, basePath, infrastructure),
            `Could not find Submodel with id '${submodelId}' in any of the Submodel registries`,
        );

        if (!registrySearchResult.isSuccess) {
            logResponseDebug(
                this.log,
                'searchInMultipleSubmodelRegistries',
                'Searching Submodel in multiple registries unsuccessful',
                registrySearchResult,
                { Submodel_ID: submodelId },
            );
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, registrySearchResult.message);
        }

        const firstResult = registrySearchResult.result[0];
        if (!firstResult.endpoints || !Array.isArray(firstResult.endpoints) || firstResult.endpoints.length === 0) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, `No endpoints found for AAS '${submodelId}'`);
        }
        return wrapSuccess(firstResult);
    }

    async searchInSingleSubmodelRegistry(
        submodelId: string,
        url: string,
        infrastructure?: InfrastructureConnection,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const securityHeader = await createSecurityHeaders(infrastructure);
        const response = await this.getSubmodelRegistryClient(url, securityHeader).getSubmodelDescriptorById(
            submodelId,
        );
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getSubmodelDescriptorById',
                'Querying Submodel Descriptor from registry successful',
                response,
            );
            return response;
        } else {
            if (response.errorCode === ApiResultStatus.UNKNOWN_ERROR) {
                logResponseDebug(
                    this.log,
                    'getSubmodelDescriptorById',
                    'Querying Submodel Descriptor from registry unsuccessful',
                    response,
                );
            }
            if (response.errorCode === ApiResultStatus.NOT_FOUND) {
                logResponseDebug(
                    this.log,
                    'getSubmodelDescriptorById',
                    'Querying Submodel Descriptor from registry unsuccessful',
                    response,
                );
            }
            return wrapErrorCode<SubmodelDescriptor>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
        }
    }

    async getSubmodelFromEndpoint(endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.getSubmodelRegistryClient('', null).getSubmodelFromEndpoint(endpoint);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getSubmodelFromEndpoint',
                'Querying Submodel from registry endpoint successful',
                response,
                { Endpoint: endpoint },
            );
            return response;
        }
        logResponseDebug(
            this.log,
            'getSubmodelFromEndpoint',
            'Querying Submodel from registry endpoint unsuccessful',
            response,
            { Endpoint: endpoint },
        );
        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, `Submodel not found at endpoint '${endpoint}'`);
    }

    async getFromMultipleSubmodelRegistries(
        infrastructures: InfrastructureConnection[],
        kernel: (url: string) => Promise<ApiResponseWrapper<SubmodelDescriptor>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<SubmodelDescriptor[]>> {
        const requests = infrastructures.flatMap((infra) =>
            infra.submodelRegistryUrls.map((url) => ({
                url,
                infrastructure: infra,
            })),
        );

        return fetchFromMultipleEndpoints(requests, kernel, errorMsg, (result) => ({
            ...result.result,
        }));
    }
}
