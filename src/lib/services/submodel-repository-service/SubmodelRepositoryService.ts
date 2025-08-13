import { Submodel } from 'lib/api/aas/models';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositorySearchService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { InfrastructureConnection } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';

export class SubmodelRepositoryService {
    private constructor(
        protected readonly getSubmodelRepositoryClient: (basePath: string) => ISubmodelRepositoryApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): SubmodelRepositoryService {
        const submodelLogger = log?.child({ Service: 'SubmodelSearcher' });
        return new SubmodelRepositoryService(
            (baseUrl) => SubmodelRepositoryApi.create(baseUrl, mnestixFetch()),
            submodelLogger,
        );
    }

    static createNull(submodelsInRepositories: RepoSearchResult<Submodel>[] = []): SubmodelRepositoryService {
        return new SubmodelRepositoryService((baseUrl) =>
            SubmodelRepositoryApi.createNull(
                baseUrl,
                submodelsInRepositories.filter((value) => value.location == baseUrl).map((value) => value.searchResult),
            ),
        );
    }

    private async getSubmodelFromRepo(submodelId: string, repoUrl: string): Promise<ApiResponseWrapper<Submodel>> {
        const client = this.getSubmodelRepositoryClient(repoUrl);
        const response = await client.getSubmodelById(submodelId);
        if (response.isSuccess) {
            logResponseDebug(this.log, 'getSubmodelFromRepo', 'Querying Submodel from repository', response, {
                Repository_Endpoint: client.getBaseUrl(),
                Submodel_ID: submodelId,
            });
            return response;
        }
        logResponseDebug(this.log, 'getSubmodelFromRepo', 'Submodel repository search unsuccessful', response, {
            Repository_Endpoint: client.getBaseUrl(),
            Submodel_ID: submodelId,
        });
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Submodel with id '${submodelId}' not found in repository '${repoUrl}'`,
            response.httpStatus,
        );
    }

    async getFirstSubmodelFromAllRepos(
        submodelId: string,
        infrastructure: InfrastructureConnection,
    ): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
        return this.getFirstFromAllRepos(
            infrastructure.submodelRepositoryUrls,
            (basePath) => this.getSubmodelFromRepo(submodelId, basePath),
            `Could not find Submodel '${submodelId}' in any Repository`,
        );
    }

    async getFirstFromAllRepos<Submodel>(
        basePathUrls: string[],
        kernel: (url: string) => Promise<ApiResponseWrapper<Submodel>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
        const promises = basePathUrls.map(async (url) =>
            kernel(url).then((response: ApiResponseWrapper<Submodel>) => {
                if (!response.isSuccess) return Promise.reject('Fetch call was not successful');
                return { searchResult: response.result, location: url };
            }),
        );

        try {
            const firstResult = await Promise.any(promises);
            return wrapSuccess(firstResult);
        } catch {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, errorMsg);
        }
    }

    private async getAttachmentFromSubmodelElementFromRepo(
        submodelId: string,
        submodelElementPath: string,
        repoUrl: string,
    ) {
        const client = this.getSubmodelRepositoryClient(repoUrl);
        const response = await client.getAttachmentFromSubmodelElement(submodelId, submodelElementPath);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getAttachmentFromSubmodelElementFromRepo',
                'Querying Attachment from repository',
                response,
                {
                    Repository_Endpoint: client.getBaseUrl(),
                    Submodel_ID: submodelId,
                    Submodel_Element_Path: submodelElementPath,
                },
            );
            return response;
        }
        logResponseDebug(
            this.log,
            'getAttachmentFromSubmodelElementFromRepo',
            'Querying Attachment from repository unsuccessful',
            response,
            {
                Repository_Endpoint: client.getBaseUrl(),
                Submodel_ID: submodelId,
                Submodel_Element_Path: submodelElementPath,
            },
        );
        return Promise.reject(
            `Unable to fetch Attachment '${submodelElementPath}' in submodel '${submodelId}' from '${repoUrl}'`,
        );
    }
}
