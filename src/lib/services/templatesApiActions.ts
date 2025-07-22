'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { Submodel } from 'lib/api/aas/models';;
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';


export async function getDefaultTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
const templateApiClient = TemplateShellApi.create(
    envs.MNESTIX_BACKEND_API_URL ?? '',
    envs.AUTHENTICATION_FEATURE_FLAG,
    mnestixFetch(),
);
    return templateApiClient.getDefaults();
}

export async function getCustomTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
const templateApiClient = TemplateShellApi.create(
    envs.MNESTIX_BACKEND_API_URL ?? '',
    envs.AUTHENTICATION_FEATURE_FLAG,
    mnestixFetch(),
);
    return templateApiClient.getCustoms();
}

export async function getCustomTemplateById(id: string): Promise<ApiResponseWrapper<Submodel>> {
const templateApiClient = TemplateShellApi.create(
    envs.MNESTIX_BACKEND_API_URL ?? '',
    envs.AUTHENTICATION_FEATURE_FLAG,
    mnestixFetch(),
);
    return templateApiClient.getCustom(id);
}

export async function deleteCustomTemplateById(id: string): Promise<ApiResponseWrapper<string | number>> {
const templateApiClient = TemplateShellApi.create(
    envs.MNESTIX_BACKEND_API_URL ?? '',
    envs.AUTHENTICATION_FEATURE_FLAG,
    mnestixFetch(),
);
    return templateApiClient.deleteCustomById(id);
}
