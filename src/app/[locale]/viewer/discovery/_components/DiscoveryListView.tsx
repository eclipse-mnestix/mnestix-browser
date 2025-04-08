'use client';

import { useSearchParams } from 'next/navigation';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import { performDiscoveryAasSearch, performRegistryAasSearch } from 'lib/services/search-actions/searchActions';
import { performSearchAasFromAllRepositories } from 'lib/services/repository-access/repositorySearchActions';
import { useTranslations } from 'next-intl';
import { LocalizedError } from 'lib/util/LocalizedError';
import { AasListEntry } from 'lib/types/AasListEntry';
import { GenericListDataWrapper } from 'app/[locale]/viewer/discovery/_components/GenericListDataWrapper';

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
export function DiscoveryListView() {
    const searchParams = useSearchParams();
    const encodedAssetId = searchParams.get('assetId');
    const assetId = encodedAssetId ? decodeURI(encodedAssetId) : undefined;

    const t = useTranslations('pages.discoveryList');

    async function loadContent() {
        if (!assetId) {
            throw new LocalizedError('pages.discoveryList.errors.noAssetId');
        }

        const response = await performDiscoveryAasSearch(assetId);

        if (!response.isSuccess) {
            throw new LocalizedError('pages.discoveryList.errors.searchFailed');
        }

        if (response.result.length === 0) {
            throw new LocalizedError('pages.discoveryList.errors.noAasFound');
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
            throw new LocalizedError('pages.discoveryList.errors.noAasFound');
        }

        return entryList;
    }

    if (!assetId) {
        return <AssetNotFound />;
    }

    return (
        <>
            <ListHeader header={t('title')} subHeader={t('subtitle')} optionalID={assetId} />
            <GenericListDataWrapper loadContent={loadContent}>
                <AssetNotFound id={assetId} />
            </GenericListDataWrapper>
        </>
    );
}
