import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/infrastructureDatabaseActions';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';
import {
    AssetAdministrationShellRepositoryAPIApi, AssetAdministrationShellRepositoryAPIApiInterface
} from 'lib/api/aas/apis';
import {
    AssetAdministrationShellRegistryAPIApiInMemory
} from 'lib/api/aas/apis-in-memory/AssetAdministrationShellRepositoryAPIApiInMemory';

export type RepoSearchResult<T> = {
    searchResult: T;
    location: string;
    infrastructureName?: string;
};

export class AasRepositoryService {
    private constructor(
        protected readonly getAasRepositoryClient: (basePath: string) => AssetAdministrationShellRepositoryAPIApiInterface,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): AasRepositoryService {
        const searcherLogger = log?.child({ Service: 'RepositorySearchService' });
        return new AasRepositoryService(
            (baseUrl) => new AssetAdministrationShellRepositoryAPIApi({ basePath: baseUrl, fetchApi: mnestixFetch() }),
            searcherLogger,
        );
    }

    static createNull(shellsInRepositories: RepoSearchResult<AssetAdministrationShell>[] = []): AasRepositoryService {
        return new AasRepositoryService((baseUrl) =>{
                return new AssetAdministrationShellRegistryAPIApiInMemory(
                    baseUrl,
                    shellsInRepositories.filter((value) => value.location == baseUrl).map((value) => value.searchResult),
                );
            },
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
        // TODO: try catch block or find a way to use ApiResponseWrapper for generated apis...
        const response = await client.getAssetAdministrationShellById({aasIdentifier: aasId});
        if (response.isSuccess) {
            logResponseDebug(this.log, 'getAasFromRepo', 'Querying AAS from repository', response, {
                Repository_Endpoint: client.(),
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
