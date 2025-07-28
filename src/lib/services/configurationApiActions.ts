'use server';

import { ConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApiInterface';
import { ConfigurationShellApiV2 } from 'lib/api/configuration-shell-api/configurationShellApiV2';

export async function getIdGenerationSettings(): Promise<ApiResponseWrapper<Submodel>> {
    const configurationShellApi = getConfigurationApi();
    return configurationShellApi.getIdGenerationSettings();
}

export async function putSingleIdGenerationSetting(
    idShort: string,
    values: {
        prefix: string;
        dynamicPart: string;
    },
): Promise<ApiResponseWrapper<void>> {
    const configurationShellApi = getConfigurationApi();
    return configurationShellApi.putSingleIdGenerationSetting(idShort, values);
}

function getConfigurationApi(): IConfigurationShellApi {
    const isMnestixApiV2Enabled = envs.MNESTIX_V2_ENABLED;
    if (isMnestixApiV2Enabled) {
        return ConfigurationShellApiV2.create(
            envs.MNESTIX_BACKEND_API_URL,
            envs.AUTHENTICATION_FEATURE_FLAG,
            mnestixFetch(),
        );
    }
    return ConfigurationShellApi.create(envs.MNESTIX_BACKEND_API_URL, envs.AUTHENTICATION_FEATURE_FLAG, mnestixFetch());
}
