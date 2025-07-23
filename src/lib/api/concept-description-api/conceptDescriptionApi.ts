import { encodeBase64 } from 'lib/util/Base64Util';
import { FetchAPI } from 'lib/api/basyx-v3/api';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ConceptDescription } from 'lib/api/aas/models';
import path from 'node:path';
import ServiceReachable from 'test-utils/TestUtils';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { IConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApiInterface';

export class ConceptDescriptionApi implements IConceptDescriptionApi {
    constructor(
        private baseUrl: string,
        private http: FetchAPI,
        private readonly log: typeof logger = logger,
    ) {}

    static create(baseUrl: string, mnestixFetch: FetchAPI, log?: typeof logger) {
        const cDLogger = log?.child({ service: 'SubmodelRegistryServiceApi' });
        return new ConceptDescriptionApi(baseUrl, mnestixFetch, cDLogger);
    }

    static createNull(
        baseUrl: string,
        conceptDescriptions: ConceptDescription[],
        _reachable: ServiceReachable = ServiceReachable.Yes,
    ) {}

    getBasePath(): string {
        return this.baseUrl;
    }

    async getConceptDescriptionById(conceptDescriptionId: string): Promise<ApiResponseWrapper<ConceptDescription>> {
        const b64_submodelId = encodeBase64(conceptDescriptionId);

        const headers = {
            Accept: 'application/json',
        };

        const url = new URL(path.posix.join(this.baseUrl, 'concept-descriptions', b64_submodelId));

        const response = await this.http.fetch<ConceptDescription>(url.toString(), {
            method: 'GET',
            headers,
        });

        if (!response.isSuccess) {
            logResponseDebug(
                this.log,
                'getConceptDescriptionById',
                'Failed to get concept description by id',
                response,
            );
            return response;
        }
        logResponseDebug(this.log, 'getConceptDescriptionById', 'Successfully got concept description by id', response);
        return response;
    }
}
