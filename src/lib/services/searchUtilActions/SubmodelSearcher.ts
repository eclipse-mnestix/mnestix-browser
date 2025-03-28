import { Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { SubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApi';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

export class SubmodelSearcher {
    private constructor(
        protected readonly getSubmodelRegistryClient: (basePath: string) => ISubmodelRegistryServiceApi,
        protected readonly multipleDataSource: RepositorySearchService,
    ) {}

    static create(): SubmodelSearcher {
        const getRegistryClient = (baseUrl: string) => SubmodelRegistryServiceApi.create(baseUrl, mnestixFetch());
        const multipleDataSource = RepositorySearchService.create();

        return new SubmodelSearcher(getRegistryClient, multipleDataSource);
    }

    private readonly failureMessage = 'Submodel not found';

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

        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, this.failureMessage);
    }

    async getSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const defaultUrl = process.env.SUBMODEL_REGISTRY_API_URL;
        if (!defaultUrl) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'No default Submodel registry defined');
        }
        const response = await this.getSubmodelRegistryClient(defaultUrl).getSubmodelDescriptorById(submodelId);
        if (response.isSuccess) return response;
        else {
            if (response.errorCode === ApiResultStatus.UNKNOWN_ERROR) {
                console.error(
                    `Configuration Error: Default Submodel registry ${process.env.SUBMODEL_REGISTRY_API_URL} is not reachable.`,
                );
            }
            if (response.errorCode === ApiResultStatus.NOT_FOUND) {
                console.warn(response.message);
            }
            return wrapErrorCode<SubmodelDescriptor>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
        }
    }

    async getSubmodelFromAllRepos(submodelId: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.multipleDataSource.getFirstSubmodelFromAllRepos(submodelId);
        if (response.isSuccess) return wrapSuccess(response.result.searchResult);
        if (response.errorCode === ApiResultStatus.NOT_FOUND) {
            console.error(response.message);
        }
        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
    }

    async getSubmodelFromEndpoint(endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.getSubmodelRegistryClient('').getSubmodelFromEndpoint(endpoint);
        if (response.isSuccess) return response;
        if (response.errorCode === ApiResultStatus.NOT_FOUND) {
            console.error(response.message);
        }
        return wrapErrorCode<Submodel>(ApiResultStatus.NOT_FOUND, `Submodel not found at endpoint '${endpoint}'`);
    }
}
