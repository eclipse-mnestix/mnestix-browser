/**
 * AAS-generator API version constants, deliberately kept in a leaf module with no imports.
 *
 * `aasGeneratorVersioning.ts` reaches `serverFetch` via `infrastructure.ts`, so a Client Component importing
 * the version enum from there drags the whole server module into the client graph — which is how
 * `templates/[id]/page.tsx` came to reference it. While `serverFetch` still carried a `'use server'` directive
 * that edge published its unvalidated, arbitrary-URL fetch primitives to the browser as callable Server
 * Actions. Client-shared constants belong here; anything touching the network stays in `aasGeneratorVersioning`.
 */
export enum AasGeneratorApiVersion {
    V1 = 'v1',
    V2 = 'v2',
}

export const DEFAULT_TEMPLATE_API_VERSION: AasGeneratorApiVersion = AasGeneratorApiVersion.V1;

export function resolveTemplateApiVersion(version?: AasGeneratorApiVersion): AasGeneratorApiVersion {
    return version ?? DEFAULT_TEMPLATE_API_VERSION;
}
