'use server';

import { ConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { IConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApiInterface';
import { ConfigurationShellApiV2 } from 'lib/api/configuration-shell-api/configurationShellApiV2';
import { getDefaultInfrastructure } from './database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export async function getIdGenerationSettings(): Promise<ApiResponseWrapper<Submodel>> {
    const configurationShellApi = await getConfigurationApi();
    return configurationShellApi.getIdGenerationSettings();
}

export async function putSingleIdGenerationSetting(
    idShort: string,
    values: {
        prefix: string;
        dynamicPart: string;
    },
): Promise<ApiResponseWrapper<void>> {
    const configurationShellApi = await getConfigurationApi();
    return configurationShellApi.putSingleIdGenerationSetting(idShort, values);
}

async function getConfigurationApi(): Promise<IConfigurationShellApi> {
    const isMnestixApiV2Enabled = envs.MNESTIX_V2_ENABLED;
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    if (isMnestixApiV2Enabled) {
        return ConfigurationShellApiV2.create(
            envs.MNESTIX_AAS_GENERATOR_API_URL,
            envs.AUTHENTICATION_FEATURE_FLAG,
            mnestixFetch(securityHeaders),
        );
    }
    return ConfigurationShellApi.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL,
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
}
