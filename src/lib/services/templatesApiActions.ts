'use server';

import { mnestixFetch, mnestixFetchRaw } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { ApiResponseWrapper, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { getDefaultInfrastructure } from './database/infrastructureDatabaseActions';
import { TemplatesApi } from 'lib/api/mnestix-aas-generator/v2/apis/TemplatesApi';
import { Configuration } from 'lib/api/mnestix-aas-generator/v2';

export async function getTemplates(apiVersion: string): Promise<ApiResponseWrapper<Submodel[]>> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const fetchClient = mnestixFetchRaw(securityHeaders);

    const apiConfig = new Configuration({
        basePath: envs.MNESTIX_AAS_GENERATOR_API_URL,
        fetchApi: (input: RequestInfo | URL, init?: RequestInit) => fetchClient.fetch(input, init),
    });

    if (apiVersion === 'v2') {
        const templateApiClient = new TemplatesApi(apiConfig);
        const result = await templateApiClient.templatesGetAllTemplates();
        return wrapSuccess<Submodel[]>(result as unknown as Submodel[]);
    } else {
        const templateApiClient = TemplateShellApi.create(
            envs.MNESTIX_AAS_GENERATOR_API_URL ?? '',
            envs.AUTHENTICATION_FEATURE_FLAG,
            mnestixFetch(securityHeaders),
        );
        return templateApiClient.getTemplates();
    }
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
