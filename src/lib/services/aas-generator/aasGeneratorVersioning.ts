import { mnestixFetch, mnestixFetchRaw, MnestixFetch, MnestixFetchRaw } from 'lib/api/infrastructure';
import { TemplateShellApi } from 'lib/api/template-shell-api/templateShellApi';
import { TemplatesApi } from 'lib/api/mnestix-aas-generator/v2/apis/TemplatesApi';
import { BlueprintsApi } from 'lib/api/mnestix-aas-generator/v2/apis/BlueprintsApi';
import { Configuration as ConfigurationV1 } from 'lib/api/mnestix-aas-generator/v1';
import { Configuration as ConfigurationV2 } from 'lib/api/mnestix-aas-generator/v2';
import { envs } from 'lib/env/MnestixEnv';
import { getDefaultInfrastructure } from '../database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { TemplateApi } from 'lib/api/mnestix-aas-generator/v1';

// Re-exported for existing server-side importers. Client Components must import these from
// './aasGeneratorApiVersion' directly — importing them from here pulls this whole server module,
// and everything it reaches (`infrastructure.ts` → `serverFetch.ts`), into the client graph.
export {
    AasGeneratorApiVersion,
    DEFAULT_TEMPLATE_API_VERSION,
    resolveTemplateApiVersion,
} from './aasGeneratorApiVersion';

type ApiDependencies = {
    fetchWrapped: MnestixFetch;
    fetchRaw: MnestixFetchRaw;
    configurationV1: ConfigurationV1;
    configurationV2: ConfigurationV2;
    generatorBaseUrl: string;
};

export async function initializeAasGeneratorApiDependencies(): Promise<ApiDependencies> {
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeaders = await createSecurityHeaders(defaultInfrastructure);
    const fetchWrapped = mnestixFetch(securityHeaders);
    const fetchRaw = mnestixFetchRaw(securityHeaders);
    const generatorBaseUrl = envs.MNESTIX_AAS_GENERATOR_API_URL ?? '';

    const configurationV1 = new ConfigurationV1({
        basePath: envs.MNESTIX_AAS_GENERATOR_API_URL,
        fetchApi: (input: RequestInfo | URL, init?: RequestInit) => fetchRaw.fetch(input, init),
        // The generated client's spec paths (e.g. /api/Template/...) are unversioned; the proxy now serves
        // them under /api/v1/... and only 308-redirects the old path for compatibility. Server-side fetches
        // refuse redirects (SSRF hardening), so we rewrite the path here instead of relying on the redirect.
        middleware: [
            {
                pre: async (context) => ({
                    url: context.url.replace(/\/api\//, '/api/v1/'),
                    init: context.init,
                }),
            },
        ],
    });

    const configurationV2 = new ConfigurationV2({
        basePath: envs.MNESTIX_AAS_GENERATOR_API_URL,
        fetchApi: (input: RequestInfo | URL, init?: RequestInit) => fetchRaw.fetch(input, init),
    });

    return {
        fetchWrapped,
        fetchRaw,
        configurationV1,
        configurationV2,
        generatorBaseUrl,
    };
}

export type VersionedAasGeneratorClients = {
    v1: {
        shellApi: TemplateShellApi;
        templateClient: TemplateApi;
    };
    v2: {
        templatesApi: TemplatesApi;
        blueprintsApi: BlueprintsApi;
    };
};

export async function createVersionedAasGeneratorClients(): Promise<VersionedAasGeneratorClients> {
    const { fetchWrapped, configurationV1, configurationV2, generatorBaseUrl } =
        await initializeAasGeneratorApiDependencies();

    return {
        v1: {
            shellApi: TemplateShellApi.create(generatorBaseUrl, fetchWrapped),
            templateClient: new TemplateApi(configurationV1),
        },
        v2: {
            templatesApi: new TemplatesApi(configurationV2),
            blueprintsApi: new BlueprintsApi(configurationV2),
        },
    };
}
