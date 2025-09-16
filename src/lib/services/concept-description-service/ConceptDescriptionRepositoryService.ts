import logger, { logInfo, logResponseDebug } from 'lib/util/Logger';
import { ConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import {
    ApiResponseWrapper,
    ApiResponseWrapperSuccess,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { getInfrastructureByName, getInfrastructuresIncludingDefault } from '../database/infrastructureDatabaseActions';
import { ConceptDescription } from 'lib/api/aas/models';
import { IConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApiInterface';
import { RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositoryService';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export class ConceptDescriptionRepositoryService {
    private constructor(
        protected readonly getConceptDescriptionRepositoryClient: (
            basePath: string,
            securityHeaders: Record<string, string> | null,
        ) => IConceptDescriptionApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): ConceptDescriptionRepositoryService {
        const svcLogger = log?.child({ Service: 'ConceptDescriptionSearchService' });
        return new ConceptDescriptionRepositoryService(
            (baseUrl, securityHeaders) => ConceptDescriptionApi.create(baseUrl, mnestixFetch(securityHeaders)),
            svcLogger ?? logger,
        );
    }

    static createNull(
        conceptDescriptionsInRepositories: RepoSearchResult<ConceptDescription>[] = [],
    ): ConceptDescriptionRepositoryService {
        return new ConceptDescriptionRepositoryService((baseUrl) =>
            ConceptDescriptionApi.createNull(
                baseUrl,
                conceptDescriptionsInRepositories
                    .filter((value) => value.location == baseUrl)
                    .map((value) => value.searchResult),
            ),
        );
    }

    async getConceptDescriptionByIdFromSingleRepositoryUrl(
        conceptDescriptionId: string,
        repo: RepositoryWithInfrastructure,
    ): Promise<ApiResponseWrapper<ConceptDescription>> {
        const infrastructure = await getInfrastructureByName(repo.infrastructureName);
        const securityHeaders = await createSecurityHeaders(infrastructure);

        const conceptDescriptionApi = this.getConceptDescriptionRepositoryClient(repo.url, securityHeaders);
        try {
            const response = await conceptDescriptionApi.getConceptDescriptionById(conceptDescriptionId);
            if (!response.isSuccess) {
                logResponseDebug(
                    this.log,
                    'getConceptDescriptionByIdFromSingleRepository',
                    `Couldn't find Concept Description ${conceptDescriptionId} in ${repo.url}`,
                    response,
                );
            }
            return response;
        } catch (error) {
            logInfo(
                this.log,
                'getConceptDescriptionByIdFromSingleRepository',
                `Failed to fetch Concept Description from ${repo.url}`,
                error,
            );
            return wrapErrorCode(
                ApiResultStatus.BAD_REQUEST,
                `Failed to fetch Concept Description ${conceptDescriptionId} from ${repo.url}`,
            );
        }
    }

    async getConceptDescriptionByIdFromMultipleRepositoryUrls(
        conceptDescriptionId: string,
        repositories: RepositoryWithInfrastructure[],
    ): Promise<ApiResponseWrapper<ConceptDescription>> {
        const promises = repositories.flatMap((repo) => {
            return this.getConceptDescriptionByIdFromSingleRepositoryUrl(conceptDescriptionId, repo);
        });
        const responses = await Promise.allSettled(promises);
        const fulfilledResponses = responses.filter((result) => {
            return result.status == 'fulfilled' && result.value.isSuccess;
        });

        const allFoundConceptDescriptions = fulfilledResponses.flatMap(
            (result: PromiseFulfilledResult<ApiResponseWrapperSuccess<ConceptDescription>>) => {
                return result.value.result;
            },
        );
        if (fulfilledResponses.length < 1 || allFoundConceptDescriptions.length < 1) {
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `Failed to fetch Concept Description ${conceptDescriptionId}.`,
            );
        }

        return wrapSuccess(allFoundConceptDescriptions[0]);
    }

    async getConceptDescriptionByIdFromAllInfrastructure(
        conceptDescriptionId: string,
    ): Promise<ApiResponseWrapper<ConceptDescription>> {
        const infrastructures = await getInfrastructuresIncludingDefault();
        const conceptDescriptionRepoUrls: RepositoryWithInfrastructure[] = infrastructures.flatMap((infra) => {
            return infra.conceptDescriptionRepositoryUrls.flatMap((url) => {
                return {
                    url: url,
                    infrastructureName: infra.name,
                };
            });
        });
        return this.getConceptDescriptionByIdFromMultipleRepositoryUrls(
            conceptDescriptionId,
            conceptDescriptionRepoUrls,
        );
    }

    async getConceptDescriptionByIdFromInfrastructure(
        conceptDescriptionId: string,
        infrastructureName: string,
    ): Promise<ApiResponseWrapper<ConceptDescription>> {
        const infrastructure = await getInfrastructureByName(infrastructureName);

        if (!infrastructure) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, `Infrastructure with name ${infrastructureName} not found`);
        }

        const conceptRepositoryUrls = new Set(infrastructure.conceptDescriptionRepositoryUrls);

        if (conceptRepositoryUrls.size < 1) {
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `No Concept Description repositories found for ${infrastructureName !== undefined ? infrastructureName : 'unspecified infrastructure'}`,
            );
        }

        return this.getConceptDescriptionByIdFromMultipleRepositoryUrls(
            conceptDescriptionId,
            Array.from(conceptRepositoryUrls).flatMap((url) => {
                return {
                    url: url,
                    infrastructureName: infrastructure.name,
                };
            }),
        );
    }
}
