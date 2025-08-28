import { Submodel } from 'lib/api/aas/models';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositoryService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export class SubmodelRepositoryService {
    private constructor(
        protected readonly getSubmodelRepositoryClient: (
            basePath: string,
            securityHeader: Record<string, string> | null,
        ) => ISubmodelRepositoryApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): SubmodelRepositoryService {
        const submodelLogger = log?.child({ Service: 'SubmodelSearcher' });
        return new SubmodelRepositoryService(
            (baseUrl, securityHeader) => SubmodelRepositoryApi.create(baseUrl, mnestixFetch(securityHeader)),
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

    private async getSubmodelFromRepo(
        submodelId: string,
        repoUrl: string,
        infrastructure: InfrastructureConnection,
    ): Promise<ApiResponseWrapper<Submodel>> {
        const securityHeader = await createSecurityHeaders(infrastructure);
        const client = this.getSubmodelRepositoryClient(repoUrl, securityHeader);
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
            infrastructure,
            (basePath, infrastructure) => this.getSubmodelFromRepo(submodelId, basePath, infrastructure),
            `Could not find Submodel '${submodelId}' in any Repository`,
        );
    }

    async getFirstFromAllRepos(
        infrastructure: InfrastructureConnection,
        kernel: (url: string, infrastructure: InfrastructureConnection) => Promise<ApiResponseWrapper<Submodel>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
        const promises = infrastructure.submodelRepositoryUrls.map(async (url) =>
            kernel(url, infrastructure).then((response: ApiResponseWrapper<Submodel>) => {
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

    async getAttachmentFromSubmodelElement() {}
}
