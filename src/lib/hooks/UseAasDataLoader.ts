import { useEffect } from 'react';
import { Reference, Submodel } from 'lib/api/aas/models';
import { useEnv } from 'app/EnvProvider';
import { LocalizedError } from 'lib/util/LocalizedError';
import { CurrentAasContextType, SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { useShowError } from 'lib/hooks/UseShowError';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useAasStore } from 'stores/AasStore';
import {
    performFullAasSearch,
    performSubmodelSearch,
    searchAasInInfrastructure,
} from 'lib/services/infrastructure-search-service/infrastructureSearchActions';
import { AasSearchResult } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { getAasFromRepository } from 'lib/services/aas-repository-service/aasRepositoryActions';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

/**
 * Hook to load AAS content and its submodels asynchronously.
 * @param context
 * @param aasIdToLoad
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
    const [infrastructureName, setInfrastructureName] = context.infrastructureName;
    const { showError } = useShowError();
    const aasStore = useAasStore();

    const submodelWhitelist: string[] = JSON.parse(env.SUBMODEL_WHITELIST || '[]');

    function whitelistContains(sm: Submodel) {
        const semanticIds = sm.semanticId?.keys.map((key) => key.value);
        return semanticIds?.some((id) => submodelWhitelist.includes(id));
    }

    async function fetchSingleSubmodel(
        reference: Reference,
        infrastructureName: string,
        smDescriptor?: SubmodelDescriptor,
    ): Promise<SubmodelOrIdReference> {
        const submodelResponse = await performSubmodelSearch(reference, infrastructureName, smDescriptor);
        if (!submodelResponse.isSuccess) {
            return { id: reference.keys[0].value, error: submodelResponse.errorCode };
        }

        return {
            id: submodelResponse.result.searchResult.id,
            submodel: submodelResponse.result.searchResult,
            repositoryUrl: submodelResponse.result.location,
        };
    }

    async function fetchSubmodels(infrastructureName: string) {
        setIsLoadingSubmodels(true);
        if (aasFromContext?.submodels) {
            await Promise.all(
                aasFromContext.submodels.map(async (smRef, i) => {
                    const newSm = await fetchSingleSubmodel(
                        smRef,
                        infrastructureName,
                        registryAasData?.submodelDescriptors?.[i],
                    );
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
        if (repoUrl && infrastructureName) {
            const infrastructure = { infrastructureName: infrastructureName, url: repoUrl };
            const response = await getAasFromRepository(encodeBase64(aasIdToLoad), infrastructure);
            if (response.isSuccess) {
                setAasOriginUrl(repoUrl);
                setAasFromContext(response.result);
                setInfrastructureName(infrastructureName);
                return { success: true };
            }
        }

        let response: ApiResponseWrapper<AasSearchResult> | undefined = undefined;

        if (infrastructureName) {
            response = await searchAasInInfrastructure(aasIdToLoad, infrastructureName);
        } else {
            response = await performFullAasSearch(aasIdToLoad);
        }

        const { isSuccess, result } = response;

        if (!isSuccess) {
            showError(new LocalizedError('navigation.errors.urlNotFound'));
            return { success: false };
        }

        if (result.aas) {
            setAasOriginUrl(result.aasData?.aasRepositoryOrigin);
            setRegistryAasData(result.aasData ?? undefined);
            setAasFromContext(result.aas);
            setInfrastructureName(result.aasData?.infrastructureName ?? undefined);
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
        if (!infrastructureName) {
            setIsLoadingSubmodels(false);
            return;
        }
        await fetchSubmodels(infrastructureName);
    }, [aasFromContext]);

    useAsyncEffect(async () => {
        if (aasFromContext?.id === aasIdToLoad) return;
        const aasFromStore = aasStore.getAasData(aasIdToLoad);
        if (aasFromStore) {
            setAasFromContext(aasFromStore.aas);
            setAasOriginUrl(aasFromStore.aasData?.aasRepositoryOrigin);
            setRegistryAasData(aasFromStore.aasData);
            setInfrastructureName(aasFromStore.aasData?.infrastructureName || undefined);
            setIsLoadingAas(false); // initialized as true, so we need to set it to false here
            return;
        }
        setIsLoadingAas(true);
        await loadAasContent();
        setIsLoadingAas(false);
    }, [aasIdToLoad, env, repoUrl]);
}
