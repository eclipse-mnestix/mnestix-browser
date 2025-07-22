'use server';

import { ConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

const configurationShellApi = ConfigurationShellApi.create(
    envs.MNESTIX_BACKEND_API_URL,
    envs.AUTHENTICATION_FEATURE_FLAG,
    mnestixFetch(),
);

export async function getIdGenerationSettings(): Promise<ApiResponseWrapper<Submodel>> {
    return configurationShellApi.getIdGenerationSettings();
}

export async function putSingleIdGenerationSetting(
    idShort: string,
    values: {
        prefix: string;
        dynamicPart: string;
    },
): Promise<ApiResponseWrapper<void>> {
    return configurationShellApi.putSingleIdGenerationSetting(idShort, values);
}
