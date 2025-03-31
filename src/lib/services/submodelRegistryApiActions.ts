'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { SubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApi';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { envs } from 'lib/env/MnestixEnv';

const submodelRegistryServiceClient = SubmodelRegistryServiceApi.create(
    envs.SUBMODEL_REGISTRY_API_URL ?? '',
    mnestixFetch(),
);

export async function getSubmodelDescriptorsById(submodelId: string): Promise<ApiResponseWrapper<SubmodelDescriptor>> {
    if (envs.SUBMODEL_REGISTRY_API_URL === undefined) {
        return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Submodel Registry API URL is not defined');
    }

    return submodelRegistryServiceClient.getSubmodelDescriptorById(submodelId);
}
