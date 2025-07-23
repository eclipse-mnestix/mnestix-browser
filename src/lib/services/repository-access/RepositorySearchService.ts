import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Submodel, Reference } from 'lib/api/aas/models';
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import {
    ApiResponseWrapper,
    ApiResponseWrapperSuccess,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { PaginationData } from 'lib/api/basyx-v3/types';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { envs } from 'lib/env/MnestixEnv';

export type RepoSearchResult<T> = {
    searchResult: T;
    location: string;
};

const noDefaultAasRepository = <T>() =>
    wrapErrorCode<T>(ApiResultStatus.INTERNAL_SERVER_ERROR, 'No default AAS repository configured');
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

    //TODO (MNES-1608): Split this file into multiple files, refactor its methods and add tests
    async getAasRepositories() {
        const defaultRepositoryClient = envs.AAS_REPO_API_URL;
        let repositories: string[] = [];
        try {
            repositories = await this.prismaConnector.getConnectionDataByTypeAction({
                id: '0',
                typeName: 'AAS_REPOSITORY',
            });
        } catch (error) {
            this.log?.warn('Failed to get AAS repositories', error);
        }
        return defaultRepositoryClient ? [defaultRepositoryClient, ...repositories] : repositories;
    }

    async getSubmodelRepositories() {
        return this.prismaConnector.getConnectionDataByTypeAction({
            id: '2',
            typeName: 'SUBMODEL_REPOSITORY',
        });
    }

    async getAasFromDefaultRepo(aasId: string): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const client = this.getDefaultAasRepositoryClient();
        if (!client) return noDefaultAasRepository();

        const response = await client.getAssetAdministrationShellById(aasId);
        if (response.isSuccess) {
            logResponseDebug(this.log, 'getAasFromDefaultRepo', 'Querying AAS from default repository', response, {
                Repository_Endpoint: client.getBaseUrl(),
                AAS_ID_Base64_Encoded: aasId,
            });
            return response;
        }
        logResponseDebug(this.log, 'getAasFromDefaultRepo', 'AAS repository search unsuccessful', response, {
            Repository_Endpoint: client.getBaseUrl(),
            AAS_ID_Base64_Encoded: aasId,
        });
        return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'AAS not found', response.httpStatus);
    }

    async getAasFromAllRepos(aasId: string): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
        return this.getFromAllRepos(
            await this.getAasRepositories(),
            (basePath) => this.getAasFromRepo(aasId, basePath),
            `Could not find AAS ${aasId} in any Repository`,
        );
    }

    async getFirstAasFromAllRepos(
        aasId: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>>> {
        return this.getFirstFromAllRepos(
            await this.getAasRepositories(),
            (basePath) => this.getAasFromRepo(aasId, basePath),
            `Could not find AAS ${aasId} in any Repository`,
        );
    }

    async getSubmodelFromAllRepos(submodelId: string): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>[]>> {
        return this.getFromAllRepos(
            await this.getSubmodelRepositories(),
            (basePath) => this.getSubmodelFromRepo(submodelId, basePath),
            `Could not find Submodel '${submodelId}' in any Repository`,
        );
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

    async getAttachmentFromSubmodelElementFromAllRepos(
        submodelId: string,
        submodelElementPath: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<Blob>[]>> {
        return this.getFromAllRepos(
            await this.getSubmodelRepositories(),
            (basePath) => this.getAttachmentFromSubmodelElementFromRepo(submodelId, submodelElementPath, basePath),
            `Attachment for Submodel with id ${submodelId} at path ${submodelElementPath} not found in any repository`,
        );
    }

    async getAttachmentFromSubmodelElementFromDefaultRepo(
        submodelId: string,
        submodelElementPath: string,
    ): Promise<ApiResponseWrapper<Blob>> {
        const client = this.getDefaultSubmodelRepositoryClient();
        if (!client) return noDefaultSubmodelRepository();
        const response = await client.getAttachmentFromSubmodelElement(submodelId, submodelElementPath);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getAttachmentFromSubmodelElementFromDefaultRepo',
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
            'getAttachmentFromSubmodelElementFromDefaultRepo',
            'Querying Attachment from repository unsuccessful',
            response,
            {
                Repository_Endpoint: client.getBaseUrl(),
                Submodel_ID: submodelId,
                Submodel_Element_Path: submodelElementPath,
            },
        );
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Attachment for Submodel with id '${submodelId}' at path '${submodelElementPath}' not found in repository '${client.getBaseUrl()}'`,
            response.httpStatus,
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

    async getSubmodelReferencesFromShellFromAllRepos(aasId: string) {
        return this.getFromAllRepos(
            await this.getAasRepositories(),
            (basePath) => this.getSubmodelReferencesFromShellFromRepo(aasId, basePath),
            `Submodel references for '${aasId}' not found in any repository`,
        );
    }

    async getSubmodelReferencesFromShellFromDefaultRepo(
        aasId: string,
    ): Promise<ApiResponseWrapper<PaginationData<Reference[]>>> {
        const client = this.getDefaultAasRepositoryClient();
        if (!client) return noDefaultAasRepository();
        const response = await client.getSubmodelReferencesFromShell(aasId);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getSubmodelReferencesFromShellFromDefaultRepo',
                'Querying Submodel Reference from repository',
                response,
                {
                    Repository_Endpoint: client.getBaseUrl(),
                    AAS_ID: aasId,
                },
            );
            return response;
        }
        logResponseDebug(
            this.log,
            'getSubmodelReferencesFromShellFromDefaultRepo',
            'Querying Submodel Reference from repository unsuccessful',
            response,
            {
                Repository_Endpoint: client.getBaseUrl(),
                AAS_ID: aasId,
            },
        );
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Submodel references for '${aasId}' not found in default repository`,
            response.httpStatus,
        );
    }

    private async getSubmodelReferencesFromShellFromRepo(aasId: string, repoUrl: string) {
        const client = this.getAasRepositoryClient(repoUrl);
        const response = await client.getSubmodelReferencesFromShell(aasId);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getSubmodelReferencesFromShellFromRepo',
                'Querying Submodel Reference from repository unsuccessful',
                response,
                {
                    Repository_Endpoint: client.getBaseUrl(),
                    AAS_ID: aasId,
                },
            );
            return response;
        }
        logResponseDebug(
            this.log,
            'getSubmodelReferencesFromShellFromRepo',
            'Querying Submodel Reference from repository unsuccessful',
            response,
            {
                Repository_Endpoint: client.getBaseUrl(),
                AAS_ID: aasId,
            },
        );
        return Promise.reject(`Unable to fetch submodel references for AAS '${aasId}' from '${repoUrl}'`);
    }

    async getFirstSubmodelReferencesFromShellFromAllRepos(aasId: string) {
        return this.getFirstFromAllRepos(
            await this.getAasRepositories(),
            (basePath) => this.getSubmodelReferencesFromShellFromRepo(aasId, basePath),
            `Submodel references for '${aasId}' not found in any repository`,
        );
    }

    async getAasThumbnailFromAllRepos(aasId: string): Promise<ApiResponseWrapper<RepoSearchResult<Blob>[]>> {
        return this.getFromAllRepos(
            await this.getAasRepositories(),
            (basePath) => this.getAasThumbnailFromRepo(aasId, basePath),
            `Thumbnail for '${aasId}' not found in any repository`,
        );
    }

    async getAasThumbnailFromDefaultRepo(aasId: string): Promise<ApiResponseWrapper<Blob>> {
        const client = this.getDefaultAasRepositoryClient();
        if (!client) return noDefaultAasRepository();
        const response = await client.getThumbnailFromShell(aasId);
        if (response.isSuccess) {
            logResponseDebug(
                this.log,
                'getAasThumbnailFromDefaultRepo',
                'Querying Thumbnail from repository unsuccessful',
                response,
                {
                    Repository_Endpoint: client.getBaseUrl(),
                    AAS_ID: aasId,
                },
            );
            return response;
        }
        logResponseDebug(
            this.log,
            'getAasThumbnailFromDefaultRepo',
            'Querying Thumbnail from repository unsuccessful',
            response,
            {
                Repository_Endpoint: client.getBaseUrl(),
                AAS_ID: aasId,
            },
        );
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Thumbnail for '${aasId}' not found in default repository`,
            response.httpStatus,
        );
    }

    private async getAasThumbnailFromRepo(aasId: string, repoUrl: string): Promise<ApiResponseWrapper<Blob>> {
        const client = this.getAasRepositoryClient(repoUrl);
        const response = await client.getThumbnailFromShell(aasId);
        if (!response.isSuccess) {
            logResponseDebug(
                this.log,
                'getAasThumbnailFromRepo',
                'Querying Thumbnail from repository unsuccessful',
                response,
                {
                    Repository_Endpoint: client.getBaseUrl(),
                    AAS_ID: aasId,
                },
            );
            return Promise.reject(`Unable to fetch thumbnail for AAS '${aasId}' from '${repoUrl}'`);
        }
        if (response.result instanceof Blob && response.result.size === 0) {
            logResponseDebug(
                this.log,
                'getAasThumbnailFromRepo',
                'Querying Thumbnail from repository unsuccessful',
                response,
                {
                    Repository_Endpoint: client.getBaseUrl(),
                    AAS_ID: aasId,
                },
            );
            return Promise.reject(`Empty thumbnail image in AAS '${aasId}' from '${repoUrl}'`);
        }
        logResponseDebug(
            this.log,
            'getAasThumbnailFromRepo',
            'Querying Thumbnail from repository successful',
            response,
            {
                Repository_Endpoint: client.getBaseUrl(),
                AAS_ID: aasId,
            },
        );
        return response;
    }

    async getFirstAasThumbnailFromAllRepos(aasId: string): Promise<ApiResponseWrapper<RepoSearchResult<Blob>>> {
        return this.getFirstFromAllRepos(
            await this.getAasRepositories(),
            (basePath) => this.getAasThumbnailFromRepo(aasId, basePath),
            `Thumbnail for '${aasId}' not found in any repository`,
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

    private getDefaultAasRepositoryClient() {
        const defaultUrl = envs.AAS_REPO_API_URL;
        if (!defaultUrl) return null;
        return this.getAasRepositoryClient(defaultUrl);
    }

    private getDefaultSubmodelRepositoryClient() {
        const defaultUrl = envs.SUBMODEL_REPO_API_URL ?? envs.AAS_REPO_API_URL;
        if (!defaultUrl) return null;
        return this.getSubmodelRepositoryClient(defaultUrl);
    }

    async getFromAllRepos<T>(
        basePathUrls: string[],
        kernel: (url: string) => Promise<ApiResponseWrapper<T>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<T>[]>> {
        const promises = basePathUrls.map(async (url) =>
            kernel(url).then((response: ApiResponseWrapper<T>) => {
                return { searchResult: response, location: url };
            }),
        );

        const responses = await Promise.allSettled(promises);
        const fulfilledResponses = responses.filter(
            (result) => result.status === 'fulfilled' && result.value.searchResult.isSuccess,
        );

        if (fulfilledResponses.length <= 0) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, errorMsg);
        }

        return wrapSuccess<RepoSearchResult<T>[]>(
            fulfilledResponses.map(
                (
                    result: PromiseFulfilledResult<{
                        searchResult: ApiResponseWrapperSuccess<T>;
                        location: string;
                    }>,
                ) => ({
                    searchResult: result.value.searchResult.result,
                    location: result.value.location,
                    httpStatus: result.value.searchResult.httpStatus,
                    httpText: result.value.searchResult.httpText,
                }),
            ),
        );
    }

    private async getAasFromRepo(
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
