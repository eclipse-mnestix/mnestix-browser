import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { InfrastructureConnection } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { getInfrastructures } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';

export type RepoSearchResult<T> = {
    searchResult: T;
    location: string;
    infrastructureName?: string;
};

export class RepositorySearchService {
    private constructor(
        protected readonly prismaConnector: IPrismaConnector,
        protected readonly getAasRepositoryClient: (basePath: string) => IAssetAdministrationShellRepositoryApi,
        protected readonly getSubmodelRepositoryClient: (basePath: string) => ISubmodelRepositoryApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): RepositorySearchService {
        const prismaConnector = PrismaConnector.create();
        const searcherLogger = log?.child({ Service: 'RepositorySearchService' });
        return new RepositorySearchService(
            prismaConnector,
            (baseUrl) => AssetAdministrationShellRepositoryApi.create(baseUrl, mnestixFetch()),
            (baseUrl) => SubmodelRepositoryApi.create(baseUrl, mnestixFetch()),
            searcherLogger,
        );
    }

    static createNull(
        shellsInRepositories: RepoSearchResult<AssetAdministrationShell>[] = [],
        submodelsInRepositories: RepoSearchResult<Submodel>[] = [],
    ): RepositorySearchService {
        const shellUrls = new Set(shellsInRepositories.map((value) => value.location));
        const submodelUrls = new Set(submodelsInRepositories.map((value) => value.location));
        return new RepositorySearchService(
            PrismaConnector.createNull([...shellUrls], [...submodelUrls]),
            (baseUrl) =>
                AssetAdministrationShellRepositoryApi.createNull(
                    baseUrl,
                    shellsInRepositories
                        .filter((value) => value.location == baseUrl)
                        .map((value) => value.searchResult),
                ),
            (baseUrl) =>
                SubmodelRepositoryApi.createNull(
                    baseUrl,
                    submodelsInRepositories
                        .filter((value) => value.location == baseUrl)
                        .map((value) => value.searchResult),
                ),
        );
    }

    // TODO delete
    async getSubmodelRepositories() {
        return this.prismaConnector.getConnectionDataByTypeAction({
            id: '2',
            typeName: 'SUBMODEL_REPOSITORY',
        });
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
        const infrastructures = await getInfrastructures();
        return this.searchAASInMultipleRepositories(aasId, infrastructures);
    }

    async getFromAllAasRepos<T>(
        infrastructures: InfrastructureConnection[],
        kernel: (url: string) => Promise<ApiResponseWrapper<T>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<T>[]>> {
        const urls = infrastructures.flatMap((infra) =>
            infra.aasRepositoryUrls.map((url) => ({
                url,
                infrastructureName: infra.name,
            })),
        );

        return fetchFromMultipleEndpoints<T, RepoSearchResult<T>>(
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
