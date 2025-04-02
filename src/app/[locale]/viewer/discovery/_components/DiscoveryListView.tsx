'use client';

import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useState } from 'react';
import GenericAasList from 'app/[locale]/viewer/discovery/_components/GenericAasList';
import { useSearchParams } from 'next/navigation';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import { performDiscoveryAasSearch, performRegistryAasSearch } from 'lib/services/search-actions/searchActions';
import { performSearchAasFromAllRepositories } from 'lib/services/repository-access/repositorySearchActions';
import { useTranslations } from 'next-intl';
import { LocalizedError } from 'lib/util/LocalizedError';
import { AasListEntry } from 'lib/types/AasListEntry';

async function getRepositoryUrl(aasId: string): Promise<string | undefined> {
    const registrySearchResult = await performRegistryAasSearch(aasId);
    if (registrySearchResult.isSuccess) return registrySearchResult.result.aasData?.aasRepositoryOrigin;

    const allRepositorySearchResult = await performSearchAasFromAllRepositories(encodeBase64(aasId));
    if (allRepositorySearchResult.isSuccess) return allRepositorySearchResult.result[0].location;

    console.warn('Did not find the URL of the AAS');
    return undefined;
}

/**
 * This component is responsible for displaying the list of AAS entries based on a given assetId.
 * This may occur, when multiple AAS are registered to the same assetId.
 * The user can then choose which AAS to view based on AasId and repositoryUrl.
 * // TODO MNES-906: show discoveryUrl
 */
export const DiscoveryListView = () => {
    const [discoveryListEntries, setDiscoveryListEntries] = useState<AasListEntry[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isError, setIsError] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const encodedAssetId = searchParams.get('assetId');
    const assetId = encodedAssetId ? decodeURI(encodedAssetId) : undefined;

    const t = useTranslations('discoveryList');

    async function loadContent(assetId: string) {
        const response = await performDiscoveryAasSearch(assetId);

        if (!response.isSuccess) {
            throw new LocalizedError('discoveryList.errors.searchFailed');
        }

        if (response.result.length === 0) {
            throw new LocalizedError('discoveryList.errors.noAasFound');
        }

        const entryList: AasListEntry[] = [];

        await Promise.all(
            response.result.map(async (aasId) => {
                const repositoryUrl = await getRepositoryUrl(aasId);
                entryList.push({
                    aasId: aasId,
                    repositoryUrl: repositoryUrl,
                });
            }),
        );

        if (entryList.length === 0) {
            throw new LocalizedError('discoveryList.errors.noAasFound');
        }

        return entryList;
    }

    useAsyncEffect(async () => {
        setIsLoadingList(true);

        if (assetId) {
            try {
                const newListEntries = await loadContent(assetId);
                setDiscoveryListEntries(newListEntries);
            } catch (error) {
                if (error instanceof LocalizedError) {
                    console.error(error.message);
                }
                console.error('Error while loading content:', error);
                setIsError(true);
            }
        }

        setIsLoadingList(false);
    }, []);

    if (!assetId) {
        return <AssetNotFound />;
    }

    return (
        <>
            <ListHeader header={t('title')} subHeader={t('subtitle')} optionalID={assetId} />
            {isLoadingList && <CenteredLoadingSpinner sx={{ mt: 10 }} />}
            {isError ? (
                <AssetNotFound id={assetId} />
            ) : (
                <GenericAasList data={discoveryListEntries} showAasId showRepositoryUrl />
            )}
        </>
    );
};
