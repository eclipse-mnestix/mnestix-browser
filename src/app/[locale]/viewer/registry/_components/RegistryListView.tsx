'use client';

import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useState } from 'react';
import GenericAasList from 'app/[locale]/viewer/discovery/_components/GenericAasList';
import { useSearchParams } from 'next/navigation';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import { performSearchAasFromAllRepositories } from 'lib/services/repository-access/repositorySearchActions';
import { useTranslations } from 'next-intl';
import { LocalizedError } from 'lib/util/LocalizedError';
import { AasListEntry } from 'lib/types/AasListEntry';
import { useShowError } from 'lib/hooks/UseShowError';

/**
 * This component is responsible for displaying the list of AAS entries based on a given aasId.
 * This may occur, when multiple AAS are registered with the same aasId.
 * The user can then choose which AAS to view based on assetId and repositoryUrl.
 * // TODO MNES-904: show registryUrl
 */
export const RegistryListView = () => {
    const [registryListEntries, setRegistryListEntries] = useState<AasListEntry[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isError, setIsError] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const encodedAasId = searchParams.get('aasId');
    const aasId = encodedAasId ? decodeURI(encodedAasId) : undefined;

    const t = useTranslations('registryList');
    const { showError } = useShowError();

    async function loadContent(aasId: string) {
        const response = await performSearchAasFromAllRepositories(encodeBase64(aasId));

        if (!response.isSuccess) {
            throw new LocalizedError('registryList.errors.searchFailed');
        }

        if (response.result.length === 0) {
            throw new LocalizedError('registryList.errors.noAasFound');
        }

        const entryList: AasListEntry[] = response.result.map((aasSearchResult) => {
            return {
                aasId: aasSearchResult.searchResult.id,
                assetId: aasSearchResult.searchResult.assetInformation.globalAssetId ?? undefined,
                repositoryUrl: aasSearchResult.location,
            };
        });

        return entryList;
    }

    useAsyncEffect(async () => {
        setIsLoadingList(true);

        if (aasId) {
            try {
                const newListEntries = await loadContent(aasId);
                setRegistryListEntries(newListEntries);
            } catch (error) {
                showError(error);
                console.error('Error while loading content:', error.toString());
                setIsError(true);
            }
        }

        setIsLoadingList(false);
    }, []);

    if (!aasId) {
        return <AssetNotFound />;
    }

    return (
        <>
            <ListHeader header={t('title')} subHeader={t('subtitle')} optionalID={aasId} />
            {isLoadingList && <CenteredLoadingSpinner sx={{ mt: 10 }} />}
            {isError ? (
                <AssetNotFound id={aasId} />
            ) : (
                <GenericAasList data={registryListEntries} showAssetId showRepositoryUrl />
            )}
        </>
    );
};
