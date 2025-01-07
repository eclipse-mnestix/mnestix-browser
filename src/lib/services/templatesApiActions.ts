'use server';

import { mnestixFetchLegacy } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';

const templateApiClient = TemplateShellApi.create(
    process.env.MNESTIX_BACKEND_API_URL ? process.env.MNESTIX_BACKEND_API_URL : '',
    process.env.AUTHENTICATION_FEATURE_FLAG?.toLowerCase().trim() === 'true' ?? false,
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
