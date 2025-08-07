import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { envs } from 'lib/env/MnestixEnv';
import { InfrastructureConnection } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { getInfrastructures } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';

export type RepoSearchResult<T> = {
    searchResult: T;
    location: string;
};

const noDefaultSubmodelRepository = <T>() =>
    wrapErrorCode<T>(ApiResultStatus.INTERNAL_SERVER_ERROR, 'No default Submodel repository configured');

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

    async getSubmodelFromDefaultRepo(submodelId: string): Promise<ApiResponseWrapper<Submodel>> {
        const client = this.getDefaultSubmodelRepositoryClient();
        if (!client) return noDefaultSubmodelRepository();
        const response = await client.getSubmodelById(submodelId);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getSubmodelFromDefaultRepo',
                'Querying Submodel from default repository',
                response,
                { Repository_Endpoint: client.getBaseUrl(), Submodel_ID: submodelId },
            );
            return response;
        }
        logResponseDebug(this.log, 'getSubmodelFromDefaultRepo', 'Submodel repository search unsuccessful', response, {
            Repository_Endpoint: client.getBaseUrl(),
            Submodel_ID: submodelId,
        });
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Submodel with id '${submodelId}' not found`,
            response.httpStatus,
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

    async getFirstSubmodelFromAllRepos(submodelId: string): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
        return this.getFirstFromAllRepos(
            await this.getSubmodelRepositories(),
            (basePath) => this.getSubmodelFromRepo(submodelId, basePath),
            `Could not find Submodel '${submodelId}' in any Repository`,
        );
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

    async getFirstAttachmentFromSubmodelElementFromAllRepos(
        submodelId: string,
        submodelElementPath: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<Blob>>> {
        return this.getFirstFromAllRepos(
            await this.getSubmodelRepositories(),
            (basePath) => this.getAttachmentFromSubmodelElementFromRepo(submodelId, submodelElementPath, basePath),
            `Attachment for Submodel with id ${submodelId} at path ${submodelElementPath} not found in any repository`,
        );
    }

    async getFirstFromAllRepos<T>(
        basePathUrls: string[],
        kernel: (url: string) => Promise<ApiResponseWrapper<T>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<T>>> {
        const promises = basePathUrls.map(async (url) =>
            kernel(url).then((response: ApiResponseWrapper<T>) => {
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

    private getDefaultSubmodelRepositoryClient() {
        const defaultUrl = envs.SUBMODEL_REPO_API_URL ?? envs.AAS_REPO_API_URL;
        if (!defaultUrl) return null;
        return this.getSubmodelRepositoryClient(defaultUrl);
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
