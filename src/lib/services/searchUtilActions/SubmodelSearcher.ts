import { Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { SubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApi';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { RepoSearchResult, RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { envs } from 'lib/env/MnestixEnv';

export type SubmodelData = {
    submodelRepositoryOrigin: string;
};

export type SubmodelSearchResult = {
    submodel: Submodel;
    submodelData: SubmodelData;
};

export class SubmodelSearcher {
    private constructor(
        protected readonly getSubmodelRegistryClient: (basePath: string) => ISubmodelRegistryServiceApi,
        protected readonly multipleDataSource: RepositorySearchService,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): SubmodelSearcher {
        const getRegistryClient = (baseUrl: string) => SubmodelRegistryServiceApi.create(baseUrl, mnestixFetch());
        const multipleDataSource = RepositorySearchService.create(log);
        const submodelLogger = log?.child({ Service: 'SubmodelSearcher' });
        return new SubmodelSearcher(getRegistryClient, multipleDataSource, submodelLogger);
    }

    async performSubmodelFullSearch(
        submodelReference: Reference,
        submodelDescriptor?: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<SubmodelSearchResult>> {
        const submodelId = submodelReference.keys[0].value;

        const descriptorById = await this.getSubmodelDescriptorById(submodelId);
        const descriptor =
            submodelDescriptor ||
            (envs.SUBMODEL_REGISTRY_API_URL && descriptorById.isSuccess ? descriptorById.result : null);
        const endpoint = descriptor?.endpoints[0].protocolInformation.href;

        if (endpoint) {
            const submodelSearchResult = await this.getSubmodelFromEndpoint(endpoint);
            if (!submodelSearchResult.isSuccess) {
                return wrapErrorCode(submodelSearchResult.errorCode, submodelSearchResult.message);
            }
        }

        const submodelFromDefaultRepo = await this.multipleDataSource.getSubmodelFromDefaultRepo(submodelId);
        if (submodelFromDefaultRepo.isSuccess) {
            const submodelData: SubmodelData = {
                submodelRepositoryOrigin: envs.SUBMODEL_REPO_API_URL || envs.AAS_REPO_API_URL || '',
            };
            return wrapSuccess({ submodel: submodelFromDefaultRepo.result, submodelData });
        }

        const submodelFromAllRepos = await this.multipleDataSource.getFirstSubmodelFromAllRepos(submodelId);
        if (submodelFromAllRepos.isSuccess) {
            const submodelData: SubmodelData = {
                submodelRepositoryOrigin: envs.SUBMODEL_REPO_API_URL || envs.AAS_REPO_API_URL || '',
            };
            return wrapSuccess({ submodel: submodelFromAllRepos.result.searchResult, submodelData });
        }
        return wrapErrorCode<SubmodelSearchResult>(ApiResultStatus.NOT_FOUND, 'Submodel not found');
    }

    async getSubmodelDescriptorById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
        const defaultUrl = envs.SUBMODEL_REGISTRY_API_URL;
        if (!defaultUrl) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'No default Submodel registry defined');
        }
        const response = await this.getSubmodelRegistryClient(defaultUrl).getSubmodelDescriptorById(submodelId);
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

    async getSubmodelFromAllRepos(submodelId: string): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
        const response = await this.multipleDataSource.getFirstSubmodelFromAllRepos(submodelId);
        logResponseDebug(
            this.log,
            'getSubmodelFromAllRepos',
            response.isSuccess
                ? 'Querying Submodel from repositories successful'
                : 'Querying Submodel from repositories unsuccessful',
            response,
        );
        return response;
    }

    async getSubmodelFromEndpoint(endpoint: string): Promise<ApiResponseWrapper<Submodel>> {
        const response = await this.getSubmodelRegistryClient('').getSubmodelFromEndpoint(endpoint);
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
}
