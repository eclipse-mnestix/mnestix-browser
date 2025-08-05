import { useEffect } from 'react';
import { Reference, Submodel } from 'lib/api/aas/models';
import { useEnv } from 'app/EnvProvider';
import { getAasFromRepository, performSubmodelFullSearch } from 'lib/services/search-actions/searchActions';
import { LocalizedError } from 'lib/util/LocalizedError';
import { CurrentAasContextType, SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { useShowError } from 'lib/hooks/UseShowError';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useAasStore } from 'stores/AasStore';
import { performFullAasSearch } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';

/**
 * Hook to load AAS content and its submodels asynchronously.
 * @param base64AasId
 * @param repoUrl
 */
export function useAasLoader(context: CurrentAasContextType, aasIdToLoad: string, repoUrl: string | undefined) {
    const env = useEnv();
    const setIsLoadingAas = context.isLoadingAas[1];
    const setIsLoadingSubmodels = context.isLoadingSubmodels[1];
    const setAasOriginUrl = context.aasOriginUrl[1];
    const setSubmodels = context.submodelState[1];
    const [aasFromContext, setAasFromContext] = context.aasState;
    const [registryAasData, setRegistryAasData] = context.registryAasData;
    const { showError } = useShowError();
    const aasStore = useAasStore();

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
        setIsLoadingSubmodels(true);
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
        setIsLoadingSubmodels(false);
    }

    async function loadAasContent() {
        if (repoUrl) {
            const response = await getAasFromRepository(aasIdToLoad, repoUrl);
            if (response.isSuccess) {
                setAasOriginUrl(repoUrl);
                setAasFromContext(response.result);
                return { success: true };
            }
        }

        const { isSuccess, result } = await performFullAasSearch(aasIdToLoad);
        if (!isSuccess) {
            showError(new LocalizedError('navigation.errors.urlNotFound'));
            return { success: false };
        }

        if (result.aas) {
            setAasOriginUrl(result.aasData?.aasRepositoryOrigin);
            setRegistryAasData(result.aasData ?? undefined);
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
        if (aasFromContext?.id === aasIdToLoad) return;
        const aasFromStore = aasStore.getAasData(aasIdToLoad);
        if (aasFromStore) {
            setAasFromContext(aasFromStore.aas);
            setAasOriginUrl(aasFromStore.aasData?.aasRepositoryOrigin);
            setRegistryAasData(aasFromStore.aasData);
            setIsLoadingAas(false); // initialized as true, so we need to set it to false here
            return;
        }
        setIsLoadingAas(true);
        await loadAasContent();
        setIsLoadingAas(false);
    }, [aasIdToLoad, env, repoUrl]);
}
