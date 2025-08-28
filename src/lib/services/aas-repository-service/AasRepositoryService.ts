import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IAssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import {
    getInfrastructureByUrl,
    getInfrastructuresIncludingDefault,
} from 'lib/services/database/infrastructureDatabaseActions';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export type RepoSearchResult<T> = {
    searchResult: T;
    location: string;
    infrastructureName?: string;
};

export class AasRepositoryService {
    private constructor(
        protected readonly getAasRepositoryClient: (
            basePath: string,
            securityHeader: Record<string, string> | null,
        ) => IAssetAdministrationShellRepositoryApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): AasRepositoryService {
        const searcherLogger = log?.child({ Service: 'RepositorySearchService' });
        return new AasRepositoryService(
            (baseUrl, securityHeader) =>
                AssetAdministrationShellRepositoryApi.create(baseUrl, mnestixFetch(securityHeader)),
            searcherLogger,
        );
    }

    static createNull(shellsInRepositories: RepoSearchResult<AssetAdministrationShell>[] = []): AasRepositoryService {
        return new AasRepositoryService((baseUrl) =>
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
            (basePath, infrastructure) => this.getAasFromSingleRepo(aasId, basePath, infrastructure),
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
        kernel: (
            url: string,
            infrastructure?: InfrastructureConnection,
        ) => Promise<ApiResponseWrapper<AssetAdministrationShell>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
        const urls = infrastructures.flatMap((infra) =>
            infra.aasRepositoryUrls.map((url) => ({
                url,
                infrastructure: infra,
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

    async getAasFromRepository(
        aasId: string,
        repositoryUrl: string,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const infrastructure = await getInfrastructureByUrl(repositoryUrl);
        const securityHeader = await createSecurityHeaders(infrastructure || undefined);
        const client = this.getAasRepositoryClient(repositoryUrl, securityHeader);
        return client.getAssetAdministrationShellById(aasId);
    }

    async getThumbnailFromShell(aasId: string, baseRepositoryUrl: string): Promise<ApiResponseWrapper<ApiFileDto>> {
        const infrastructure = await getInfrastructureByUrl(baseRepositoryUrl);
        const securityHeader = await createSecurityHeaders(infrastructure || undefined);
        const client = this.getAasRepositoryClient(baseRepositoryUrl, securityHeader);
        const searchResponse = await client.getThumbnailFromShell(aasId);
        if (!searchResponse.isSuccess) return wrapErrorCode(searchResponse.errorCode, searchResponse.message);
        return wrapFile(searchResponse.result);
    }

    async downloadAasFromRepo(
        aasId: string | string[],
        submodelIds: string[],
        baseRepositoryUrl: string,
        includeConceptDescriptions = true,
    ): Promise<ApiResponseWrapper<Blob>> {
        const infrastructure = await getInfrastructureByUrl(baseRepositoryUrl);
        const securityHeader = await createSecurityHeaders(infrastructure || undefined);
        const client = this.getAasRepositoryClient(baseRepositoryUrl, securityHeader);
        const response = await client.downloadAAS(aasId, submodelIds, includeConceptDescriptions);
        if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
        return response;
    }

    private async getAasFromSingleRepo(
        aasId: string,
        repoUrl: string,
        infrastructure?: InfrastructureConnection,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const securityHeader = await createSecurityHeaders(infrastructure);
        const client = this.getAasRepositoryClient(repoUrl, securityHeader);
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
