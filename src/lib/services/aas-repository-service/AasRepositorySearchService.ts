import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IAssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/infrastructureDatabaseActions';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';

export type RepoSearchResult<T> = {
    searchResult: T;
    location: string;
    infrastructureName?: string;
};

export class AasRepositorySearchService {
    private constructor(
        protected readonly getAasRepositoryClient: (basePath: string) => IAssetAdministrationShellRepositoryApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): AasRepositorySearchService {
        const searcherLogger = log?.child({ Service: 'RepositorySearchService' });
        return new AasRepositorySearchService(
            (baseUrl) => AssetAdministrationShellRepositoryApi.create(baseUrl, mnestixFetch()),
            searcherLogger,
        );
    }

    static createNull(
        shellsInRepositories: RepoSearchResult<AssetAdministrationShell>[] = [],
    ): AasRepositorySearchService {
        return new AasRepositorySearchService((baseUrl) =>
            AssetAdministrationShellRepositoryApi.createNull(
                baseUrl,
                shellsInRepositories.filter((value) => value.location == baseUrl).map((value) => value.searchResult),
            ),
        );
    }

    async searchAASInMultipleRepositories(
        aasId: string,
        infrastructureConnection: InfrastructureConnection[],
    ): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
        return this.getFromAllAasRepos(
            infrastructureConnection,
            (basePath) => this.getAasFromSingleRepo(aasId, basePath),
            `Could not find AAS ${aasId} in any Repository`,
        );
    }

    async searchInAllAasRepositories(
        aasId: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
        const infrastructures = await getInfrastructuresIncludingDefault();
        return this.searchAASInMultipleRepositories(aasId, infrastructures);
    }

    async getFromAllAasRepos(
        infrastructures: InfrastructureConnection[],
        kernel: (url: string) => Promise<ApiResponseWrapper<AssetAdministrationShell>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
        const urls = infrastructures.flatMap((infra) =>
            infra.aasRepositoryUrls.map((url) => ({
                url,
                infrastructureName: infra.name,
            })),
        );

        return fetchFromMultipleEndpoints<AssetAdministrationShell, RepoSearchResult<AssetAdministrationShell>>(
            urls,
            kernel,
            errorMsg,
            (result, url, infrastructureName) => ({
                searchResult: result.result,
                location: url,
                infrastructureName,
                httpStatus: result.httpStatus,
                httpText: result.httpText,
            }),
        );
    }

    private async getAasFromSingleRepo(
        aasId: string,
        repoUrl: string,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const client = this.getAasRepositoryClient(repoUrl);
        const response = await client.getAssetAdministrationShellById(aasId);
        if (response.isSuccess) {
            logResponseDebug(this.log, 'getAasFromRepo', 'Querying AAS from repository', response, {
                Repository_Endpoint: client.getBaseUrl(),
                AAS_ID: aasId,
            });
            return response;
        }
        logResponseDebug(this.log, 'getAasFromRepo', 'Querying AAS from repository unsuccessful', response, {
            Repository_Endpoint: client.getBaseUrl(),
            AAS_ID: aasId,
        });
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `AAS '${aasId}' not found in repository '${repoUrl}'`,
            response.httpStatus,
        );
    }
}
