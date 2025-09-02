'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { getDefaultInfrastructure } from './database/infrastructureDatabaseActions';

export async function getDefaultTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_BACKEND_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.getDefaults();
}

export async function getCustomTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_BACKEND_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.getCustoms();
}

export async function getCustomTemplateById(id: string): Promise<ApiResponseWrapper<Submodel>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_BACKEND_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.getCustom(id);
}

export async function deleteCustomTemplateById(id: string): Promise<ApiResponseWrapper<string | number>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_BACKEND_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.deleteCustomById(id);
}
