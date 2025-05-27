'use server';

import { Submodel } from 'lib/api/aas/models';
import { mnestixFetchLegacy } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { envs } from 'lib/env/MnestixEnv';

const templateApiClient = TemplateShellApi.create(
    envs.MNESTIX_BACKEND_API_URL ?? '',
    envs.AUTHENTICATION_FEATURE_FLAG,
    mnestixFetchLegacy(),
);

export async function getDefaultTemplates(): Promise<Submodel[]> {
    return templateApiClient.getDefaults();
}

export async function getCustomTemplates(): Promise<Submodel[]> {
    return templateApiClient.getCustoms();
}

export async function getCustomTemplateById(id: string): Promise<Submodel> {
    return templateApiClient.getCustom(id);
}

export async function deleteCustomTemplateById(id: string): Promise<string | number> {
    return templateApiClient.deleteCustomById(id);
}
