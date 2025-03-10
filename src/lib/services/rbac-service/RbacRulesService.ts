import { ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { SecuritySmRepoClient } from './SecuritySmRepoClient';

import { z, ZodError } from 'zod';

const SEC_SUB_ID = 'SecuritySubmodel';

/**
 * Service for interacting with BaSyx Dynamic RBAC rules
 */
export class RbacRulesService {
    private constructor(private readonly submodelRepositoryClient: ISubmodelRepositoryApi) {}

    static create(): RbacRulesService {
        return new RbacRulesService(SecuritySmRepoClient(process.env.SEC_SM_API_URL!));
    }

    /**
     * Get all rbac rules
     */
    async getRules(): Promise<
        { isSuccess: false; error: string } | { isSuccess: true; result: BaSyxRbacRule[]; warnings: string[][] }
    > {
        const { isSuccess, result: secSM } = await this.submodelRepositoryClient.getSubmodelByIdValueOnly(SEC_SUB_ID);
        if (!isSuccess) {
            return { isSuccess: false, error: 'Failed to get RBAC' };
        }
        if (!secSM || typeof secSM !== 'object') {
            return { isSuccess: false, error: 'Submodel in wrong Format' };
        }

        const parsedRoles = Object.entries(secSM).map(([_key, roleElement]) => {
            try {
                return roleSpec.parse(roleElement);
            } catch (err) {
                if (err instanceof ZodError) {
                    return { error: err.errors.map((e) => e.message) };
                }
                throw err;
            }
        });
        const roles = parsedRoles.filter((r): r is BaSyxRbacRule => !('error' in r));
        const warnings = parsedRoles.filter((r): r is { error: string[] } => 'error' in r).map((e) => e.error);

        return { isSuccess: true, result: roles, warnings: warnings };
    }
}

const strOrArray = z.union([z.string(), z.array(z.string())]);
const actions = z.union([
    z.literal('READ'),
    z.literal('CREATE'),
    z.literal('UPDATE'),
    z.literal('DELETE'),
    z.literal('EXECUTE'),
]);
const roleSpec = z.object({
    targetInformation: z.discriminatedUnion('@type', [
        z
            .object({
                '@type': z.literal('aas-environment'),
                aasIds: strOrArray,
                submodelIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('aas'),
                aasIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('submodel'),
                submodelIds: strOrArray,
                submodelElementIdShortPaths: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('concept-description'),
                conceptDescriptionIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('aas-registry'),
                aasIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('submodel-registry'),
                submodelIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('aas-discovery-service'),
                aasIds: strOrArray,
                assetIds: strOrArray,
            })
            .strict(),
    ]),
    role: z.string(),
    action: z.union([actions, z.array(actions)]),
});

export type BaSyxRbacRule = z.infer<typeof roleSpec>;
