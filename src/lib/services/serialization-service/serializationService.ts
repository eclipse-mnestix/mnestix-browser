import { SerializationApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ISerializationApi } from 'lib/api/basyx-v3/apiInterface';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger from 'lib/util/Logger';
import {
    getInfrastructureByName,
    getInfrastructuresIncludingDefault,
} from 'lib/services/database/infrastructureDatabaseActions';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export type SerializationResult = {
    blob: Blob;
    endpointUrl: string;
    infrastructureName: string;
};

export class SerializationService {
    private constructor(
        protected readonly getSerializationClient: (
            basePath: string,
            securityHeader: Record<string, string> | null,
        ) => ISerializationApi,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): SerializationService {
        const serializationLogger = log?.child({ Service: 'SerializationService' });
        return new SerializationService(
            (baseUrl, securityHeader) => SerializationApi.create(baseUrl, mnestixFetch(securityHeader)),
            serializationLogger,
        );
    }

    /**
     * Finds serialization endpoints for a specific infrastructure by name
     */
    async getSerializationEndpointsFromInfrastructure(
        infrastructureName: string,
    ): Promise<ApiResponseWrapper<string[]>> {
        try {
            const infrastructures = await getInfrastructuresIncludingDefault();
            const infrastructure = infrastructures.find((infra) => infra.name === infrastructureName);

            if (!infrastructure) {
                return wrapErrorCode(ApiResultStatus.NOT_FOUND, `Infrastructure '${infrastructureName}' not found`);
            }

            if (!infrastructure.serializationEndpointUrls || infrastructure.serializationEndpointUrls.length === 0) {
                return wrapErrorCode(
                    ApiResultStatus.NOT_FOUND,
                    `No serialization endpoints found for infrastructure '${infrastructureName}'`,
                );
            }

            return {
                isSuccess: true,
                result: infrastructure.serializationEndpointUrls,
            };
        } catch (error) {
            this.log?.error('Error finding serialization endpoints', error);
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                `Failed to find serialization endpoints: ${error}`,
            );
        }
    }

    /**
     * Serializes AAS using a specific infrastructure's serialization endpoints
     */
    async serializeAasFromInfrastructure(
        aasId: string | string[],
        submodelIds: string[],
        infrastructureName: string,
        includeConceptDescriptions = true,
        outputFormat: 'xml' | 'json' | 'aasx' = 'aasx',
    ): Promise<ApiResponseWrapper<SerializationResult>> {
        const endpointsResponse = await this.getSerializationEndpointsFromInfrastructure(infrastructureName);

        if (!endpointsResponse.isSuccess) {
            return wrapErrorCode(endpointsResponse.errorCode, endpointsResponse.message);
        }

        const endpoints = endpointsResponse.result;

        // Try each endpoint until one succeeds
        for (const endpointUrl of endpoints) {
            try {
                const repository: RepositoryWithInfrastructure = {
                    url: endpointUrl,
                    infrastructureName,
                };

                this.log?.info(`Attempting serialization with endpoint: ${endpointUrl}`);
                const result = await this.serializeAas(
                    aasId,
                    submodelIds,
                    repository,
                    includeConceptDescriptions,
                    outputFormat,
                );

                if (result.isSuccess) {
                    this.log?.info(`Serialization successful with endpoint: ${endpointUrl}`);
                    return {
                        isSuccess: true,
                        result: {
                            blob: result.result,
                            endpointUrl,
                            infrastructureName,
                        },
                    };
                }

                this.log?.warn(`Serialization failed with endpoint: ${endpointUrl} - ${result.message}`);
            } catch (error) {
                this.log?.warn(`Exception during serialization with endpoint: ${endpointUrl}`, error);
                continue;
            }
        }

        return wrapErrorCode(
            ApiResultStatus.INTERNAL_SERVER_ERROR,
            `All serialization endpoints failed for infrastructure '${infrastructureName}'`,
        );
    }

    async serializeAas(
        aasId: string | string[],
        submodelIds: string[],
        repository: RepositoryWithInfrastructure,
        includeConceptDescriptions = true,
        outputFormat: 'xml' | 'json' | 'aasx' = 'aasx',
    ): Promise<ApiResponseWrapper<Blob>> {
        const infrastructure = await getInfrastructureByName(repository.infrastructureName);
        const securityHeader = await createSecurityHeaders(infrastructure || undefined);
        const client = this.getSerializationClient(repository.url, securityHeader);

        try {
            // Use the dedicated serialization API
            const response = await client.downloadAAS(aasId, submodelIds, includeConceptDescriptions, outputFormat);
            if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
            return response;
        } catch (error) {
            this.log?.error('Error during AAS serialization', error);
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, `Serialization failed: ${error}`);
        }
    }
}
