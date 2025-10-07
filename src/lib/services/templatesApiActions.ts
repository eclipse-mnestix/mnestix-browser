'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { getDefaultInfrastructure } from './database/infrastructureDatabaseActions';

export async function getTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.getTemplates();
}

export async function getBlueprints(): Promise<ApiResponseWrapper<Submodel[]>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.getBlueprints();
}

export async function getBlueprintById(id: string): Promise<ApiResponseWrapper<Submodel>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.getBlueprint(id);
}

export async function deleteBlueprintById(id: string): Promise<ApiResponseWrapper<string | number>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const templateApiClient = TemplateShellApi.create(
        envs.MNESTIX_AAS_GENERATOR_API_URL ?? '',
        envs.AUTHENTICATION_FEATURE_FLAG,
        mnestixFetch(securityHeaders),
    );
    return templateApiClient.deleteBlueprintById(id);
}
