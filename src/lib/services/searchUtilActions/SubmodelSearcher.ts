import { Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { SubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApi';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import Logger, { logResponseInfo } from 'lib/util/Logger';

export class SubmodelSearcher {
    private constructor(
        protected readonly getSubmodelRegistryClient: (basePath: string) => ISubmodelRegistryServiceApi,
        protected readonly multipleDataSource: RepositorySearchService,
        private readonly logger?: typeof Logger,
    ) {}

    static create(logger?: typeof Logger): SubmodelSearcher {
        const getRegistryClient = (baseUrl: string) => SubmodelRegistryServiceApi.create(baseUrl, mnestixFetch());
        const multipleDataSource = RepositorySearchService.create(logger);
        const submodelLogger = logger?.child({ Service: SubmodelSearcher.name });
        return new SubmodelSearcher(getRegistryClient, multipleDataSource, submodelLogger);
    }

    async performSubmodelFullSearch(
        submodelReference: Reference,
        submodelDescriptor?: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<Submodel>> {
        const submodelId = submodelReference.keys[0].value;

        const descriptorById = await this.getSubmodelDescriptorById(submodelId);
        const descriptor =
            submodelDescriptor ||
            (process.env.SUBMODEL_REGISTRY_API_URL && descriptorById.isSuccess ? descriptorById.result : null);
        const endpoint = descriptor?.endpoints[0].protocolInformation.href;

        if (endpoint) {
            return await this.getSubmodelFromEndpoint(endpoint);
        }

        const submodelFromDefaultRepo = await this.multipleDataSource.getSubmodelFromDefaultRepo(submodelId);
        if (submodelFromDefaultRepo.isSuccess) {
            return submodelFromDefaultRepo;
        }

        const submodelFromAllRepos = await this.multipleDataSource.getFirstSubmodelFromAllRepos(submodelId);
        if (submodelFromAllRepos.isSuccess) {
            return wrapSuccess(submodelFromAllRepos.result.searchResult);
        }
        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
    }

    async getSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const defaultUrl = process.env.SUBMODEL_REGISTRY_API_URL;
        if (!defaultUrl) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'No default Submodel registry defined');
        }
        const response = await this.getSubmodelRegistryClient(defaultUrl).getSubmodelDescriptorById(submodelId);
        if (response.isSuccess) {
            logResponseInfo(
                this.logger ?? Logger,
                this.getSubmodelDescriptorById.name,
                'Querying Submodel Descriptor from registry successful',
                response,
            );
            return response;
        } else {
            if (response.errorCode === ApiResultStatus.UNKNOWN_ERROR) {
                logResponseInfo(
                    this.logger ?? Logger,
                    this.getSubmodelDescriptorById.name,
                    'Querying Submodel Descriptor from registry unsuccessful',
                    response,
                );
            }
            if (response.errorCode === ApiResultStatus.NOT_FOUND) {
                logResponseInfo(
                    this.logger ?? Logger,
                    this.getSubmodelDescriptorById.name,
                    'Querying Submodel Descriptor from registry unsuccessful',
                    response,
                );
            }
            return wrapErrorCode<SubmodelDescriptor>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
        }
    }

    async getSubmodelFromAllRepos(submodelId: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.multipleDataSource.getFirstSubmodelFromAllRepos(submodelId);
        if (response.isSuccess) {
            logResponseInfo(
                this.logger ?? Logger,
                this.getSubmodelFromAllRepos.name,
                'Querying Submodel from repositories successful',
                response,
            );
            return wrapSuccess(response.result.searchResult);
        }
        if (response.errorCode === ApiResultStatus.NOT_FOUND) {
            logResponseInfo(
                this.logger ?? Logger,
                this.getSubmodelFromAllRepos.name,
                'Querying Submodel from repositories unsuccessful',
                response,
            );
        }
        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
    }

    async getSubmodelFromEndpoint(endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.getSubmodelRegistryClient('').getSubmodelFromEndpoint(endpoint);
        if (response.isSuccess) {
            logResponseInfo(
                this.logger ?? Logger,
                this.getSubmodelFromEndpoint.name,
                'Querying Submodel from registry endpoint successful',
                response,
            );
            return response;
        }
        logResponseInfo(
            this.logger ?? Logger,
            this.getSubmodelFromEndpoint.name,
            'Querying Submodel from registry endpoint unsuccessful',
            response,
        );
        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, `Submodel not found at endpoint '${endpoint}'`);
    }
}
