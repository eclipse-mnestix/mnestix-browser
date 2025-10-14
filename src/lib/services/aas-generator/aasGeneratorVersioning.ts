import { mnestixFetch, mnestixFetchRaw, MnestixFetch, MnestixFetchRaw } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { TemplateClient } from 'lib/api/generated-api/clients.g';
import { TemplatesApi } from 'lib/api/mnestix-aas-generator/v2/apis/TemplatesApi';
import { BlueprintsApi } from 'lib/api/mnestix-aas-generator/v2/apis/BlueprintsApi';
import { Configuration } from 'lib/api/mnestix-aas-generator/v2';
import { envs } from 'lib/env/MnestixEnv';
import { getDefaultInfrastructure } from '../database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

export type AasGeneratorApiVersion = 'v1' | 'v2';

export const DEFAULT_TEMPLATE_API_VERSION: AasGeneratorApiVersion = 'v1';

export function resolveTemplateApiVersion(version?: AasGeneratorApiVersion): AasGeneratorApiVersion {
    return version ?? DEFAULT_TEMPLATE_API_VERSION;
}

type ApiDependencies = {
    fetchWrapped: MnestixFetch;
    fetchRaw: MnestixFetchRaw;
    configuration: Configuration;
    generatorBaseUrl: string;
};

export async function initializeAasGeneratorApiDependencies(): Promise<ApiDependencies> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const fetchWrapped = mnestixFetch(securityHeaders);
    const fetchRaw = mnestixFetchRaw(securityHeaders);
    const generatorBaseUrl = envs.MNESTIX_AAS_GENERATOR_API_URL ?? '';

    const configuration = new Configuration({
        basePath: envs.MNESTIX_AAS_GENERATOR_API_URL,
        fetchApi: (input: RequestInfo | URL, init?: RequestInit) => fetchRaw.fetch(input, init),
    });

    return {
        fetchWrapped,
        fetchRaw,
        configuration,
        generatorBaseUrl,
    };
}

export type VersionedAasGeneratorClients = {
    v1: {
        shellApi: TemplateShellApi;
        templateClient: TemplateClient;
    };
    v2: {
        templatesApi: TemplatesApi;
        blueprintsApi: BlueprintsApi;
    };
};

export async function createVersionedAasGeneratorClients(): Promise<VersionedAasGeneratorClients> {
    const { fetchWrapped, configuration, generatorBaseUrl } = await initializeAasGeneratorApiDependencies();

    return {
        v1: {
            shellApi: TemplateShellApi.create(generatorBaseUrl, fetchWrapped),
            templateClient: TemplateClient.create(generatorBaseUrl, fetchWrapped),
        },
        v2: {
            templatesApi: new TemplatesApi(configuration),
            blueprintsApi: new BlueprintsApi(configuration),
        },
    };
}
