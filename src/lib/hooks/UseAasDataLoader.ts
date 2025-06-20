import { useEffect, useState } from 'react';
import { Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { useEnv } from 'app/EnvProvider';
import {
    getAasFromRepository,
    performFullAasSearch,
    performSubmodelFullSearch,
} from 'lib/services/search-actions/searchActions';
import { LocalizedError } from 'lib/util/LocalizedError';
import {
    SubmodelOrIdReference,
    useAasOriginSourceState,
    useAasState,
    useRegistryAasState,
    useSubmodelState,
} from 'components/contexts/CurrentAasContext';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useShowError } from 'lib/hooks/UseShowError';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';

/**
 * Hook to load AAS content and its submodels asynchronously.
 * @param base64AasId
 * @param repoUrl
 */
export function useAasLoader(base64AasId: string, repoUrl?: string) {
    const [isLoadingAas, setIsLoadingAas] = useState(false);
    const env = useEnv();
    const [aasOriginUrl, setAasOriginUrl] = useAasOriginSourceState();
    const [aasFromContext, setAasFromContext] = useAasState();
    const [submodels, setSubmodels] = useSubmodelState();
    const [isSubmodelsLoading, setIsSubmodelsLoading] = useState(true);
    const [registryAasData, setRegistryAasData] = useRegistryAasState();
    const { showError } = useShowError();
    const aasIdDecoded = safeBase64Decode(base64AasId);

    const submodelWhitelist: string[] = JSON.parse(env.SUBMODEL_WHITELIST || '[]');

    function whitelistContains(sm: Submodel) {
        const semanticIds = sm.semanticId?.keys.map((key) => key.value);
        return semanticIds?.some((id) => submodelWhitelist.includes(id));
    }

    async function fetchSingleSubmodel(
        reference: Reference,
        smDescriptor?: SubmodelDescriptor,
    ): Promise<SubmodelOrIdReference> {
        const submodelResponse = await performSubmodelFullSearch(reference, smDescriptor);
        if (!submodelResponse.isSuccess) {
            return { id: reference.keys[0].value, error: submodelResponse.errorCode };
        }

        return {
            id: submodelResponse.result.submodel.id,
            submodel: submodelResponse.result.submodel,
            repositoryUrl: submodelResponse.result.submodelData.submodelRepositoryOrigin,
        };
    }

    async function fetchSubmodels() {
        setIsSubmodelsLoading(true);
        if (aasFromContext?.submodels) {
            await Promise.all(
                aasFromContext.submodels.map(async (smRef, i) => {
                    const newSm = await fetchSingleSubmodel(smRef, registryAasData?.submodelDescriptors?.[i]);
                    setSubmodels((submodels) => {
                        const exists = submodels.some((sm) => sm.id === newSm.id);
                        if (exists) return submodels;
                        if (env.WHITELIST_FEATURE_FLAG && newSm.submodel && !whitelistContains(newSm.submodel))
                            return submodels;
                        return [...submodels, newSm];
                    });
                }),
            );
        }
        setIsSubmodelsLoading(false);
    }

    async function loadAasContent() {
        if (repoUrl) {
            const response = await getAasFromRepository(aasIdDecoded, repoUrl);
            if (response.isSuccess) {
                setAasOriginUrl(repoUrl);
                setAasFromContext(response.result);
                return { success: true };
            }
        }

        const { isSuccess, result } = await performFullAasSearch(aasIdDecoded);
        if (!isSuccess) {
            showError(new LocalizedError('navigation.errors.urlNotFound'));
            return { success: false };
        }

        if (result.aas) {
            setAasOriginUrl(result.aasData?.aasRepositoryOrigin ?? null);
            setRegistryAasData(result.aasData);
            setAasFromContext(result.aas);
            return { success: true };
        }

        return { success: false, redirectUrl: result.redirectUrl };
    }

    useEffect(() => {
        return () => {
            setSubmodels(new Array<SubmodelOrIdReference>());
        };
    }, []);

    useAsyncEffect(async () => {
        await fetchSubmodels();
    }, [aasFromContext]);

    useAsyncEffect(async () => {
        if (aasFromContext) return;
        setIsLoadingAas(true);
        await loadAasContent();
        setIsLoadingAas(false);
    }, [base64AasId, env]);

    return {
        aasFromContext,
        isLoadingAas,
        aasOriginUrl,
        submodels,
        isSubmodelsLoading,
    };
}
