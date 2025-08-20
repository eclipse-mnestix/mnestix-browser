import logger, { logInfo, logResponseDebug } from 'lib/util/Logger';
import { ConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { ApiResponseWrapper, wrapErrorCode } from '../../util/apiResponseWrapper/apiResponseWrapper';
import { getInfrastructureByName, getInfrastructuresIncludingDefault } from '../database/connectionServerActions';
import { ConceptDescription } from 'lib/api/aas/models';
import { IConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApiInterface';
import { RepoSearchResult } from '../aas-repository-service/AasRepositorySearchService';

export class ConceptDescriptionRepositoryService {
    private constructor(
        protected readonly getConceptDescriptionRepositoryClient: (basePath: string) => IConceptDescriptionApi,
        private readonly log: typeof logger = logger
    ) { }

    static create(log?: typeof logger): ConceptDescriptionRepositoryService {
        const svcLogger = log?.child({ Service: 'ConceptDescriptionSearchService' });
        return new ConceptDescriptionRepositoryService(
            (baseUrl) => ConceptDescriptionApi.create(baseUrl, mnestixFetch()),
            svcLogger ?? logger,
        );
    }

    static createNull(conceptDescriptionsInRepositories: RepoSearchResult<ConceptDescription>[] = []): ConceptDescriptionRepositoryService {
        return new ConceptDescriptionRepositoryService((baseUrl) =>
            ConceptDescriptionApi.createNull(
                baseUrl,
                conceptDescriptionsInRepositories.filter((value) => value.location == baseUrl).map((value) => value.searchResult),
            ),
        );
    }

    async getConceptDescriptionByIdFromRepositories(conceptDescriptionId: string, infrastructureName: string | undefined = undefined): Promise<ApiResponseWrapper<ConceptDescription>> {
        let conceptRepositoryUrlList: string[];
        if (infrastructureName === undefined) {
            const infrastructures = await getInfrastructuresIncludingDefault();
            conceptRepositoryUrlList = infrastructures.flatMap((infra) => infra.conceptDescriptionRepositoryUrls);
        } else {
            const infrastructure = await getInfrastructureByName(infrastructureName);
            conceptRepositoryUrlList = infrastructure.conceptDescriptionRepositoryUrls;
        }
        if (conceptRepositoryUrlList.length === 0) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, `No Concept Description repositories found for ${infrastructureName}`);
        }

        const conceptRepositoryUrls = new Set(conceptRepositoryUrlList);
        for (const url of conceptRepositoryUrls) {
            const conceptDescriptionApi = this.getConceptDescriptionRepositoryClient(url);
            try {
                const response = await conceptDescriptionApi.getConceptDescriptionById(conceptDescriptionId);
                console.error(response);
                if (response.isSuccess) {
                    return response;
                } else {
                    logResponseDebug(logger, 'getConceptDescriptionById', `Couldn't find Concept Description ${conceptDescriptionId} in ${url}`, response);
                }
            } catch (error) {
                logInfo(logger, 'getConceptDescriptionById', `Failed to fetch Concept Description from ${url}`, error);
            }
        }
        return wrapErrorCode(ApiResultStatus.NOT_FOUND, `Couldn't find Concept Description in provided infrastructures: ${[...conceptRepositoryUrls].join(', ')}`);
    }
}