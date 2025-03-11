'use server';

import { ConfigurationShellApi } from 'lib/api/configuration-shell-api/configurationShellApi';
import { mnestixFetchLegacy } from 'lib/api/infrastructure';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';

const configurationShellApi = ConfigurationShellApi.create(
    process.env.MNESTIX_BACKEND_API_URL,
    process.env.AUTHENTICATION_FEATURE_FLAG?.toLowerCase().trim() === 'true' || false,
    mnestixFetchLegacy(),
);

export async function getIdGenerationSettings(): Promise<Submodel> {
    return configurationShellApi.getIdGenerationSettings();
}

export async function putSingleIdGenerationSetting(
    idShort: string,
    values: {
        prefix: string;
        dynamicPart: string;
    },
): Promise<void> {
    return configurationShellApi.putSingleIdGenerationSetting(idShort, values);
}
