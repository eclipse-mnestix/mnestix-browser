'use client';

import { useSearchParams } from 'next/navigation';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import {
    searchAasInAllRepositories,
    getThumbnailFromShell,
} from 'lib/services/aas-repository-service/aasRepositoryActions';
import { useTranslations } from 'next-intl';
import { LocalizedError } from 'lib/util/LocalizedError';
import { AasListEntry } from 'lib/types/AasListEntry';
import { GenericListDataWrapper } from 'components/basics/listBasics/GenericListDataWrapper';
import { searchInAllDiscoveries } from 'lib/services/discovery-service/discoveryActions';
import { searchAASInAllAasRegistries } from 'lib/services/aas-registry-service/aasRegistryActions';
import { Card } from '@mui/material';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { isValidUrl } from 'lib/util/UrlUtil';

type DiscoveryListEntryToFetch = {
    thumbnailUrl?: string;
    repositoryUrl?: string;
};

/**
 * This doesn't work with multiple discoveries having same entries -> it always shows the first result as repositoryUrl
 * BUT as AasId is unique, this should not be a problem in practice.
 * @param aasId
 */
async function getRepositoryUrlAndThumbnail(aasId: string): Promise<DiscoveryListEntryToFetch | undefined> {
    const registrySearchResult = await searchAASInAllAasRegistries(aasId);
    if (registrySearchResult.isSuccess)
        return { repositoryUrl: registrySearchResult.result[0].aasData?.aasRepositoryOrigin };

    const allRepositorySearchResult = await searchAasInAllRepositories(encodeBase64(aasId));
    if (allRepositorySearchResult.isSuccess) {
        const defaultThumbnailPath =
            allRepositorySearchResult.result[0].searchResult.assetInformation.defaultThumbnail?.path;

        let thumbnailUrl: string | undefined;

        if (defaultThumbnailPath && isValidUrl(defaultThumbnailPath)) {
            thumbnailUrl = defaultThumbnailPath;
        } else {
            const thumbnailResponse = await getThumbnailFromShell(allRepositorySearchResult.result[0].searchResult.id, {
                url: allRepositorySearchResult.result[0].location,
                infrastructureName: allRepositorySearchResult.result[0].infrastructureName ?? '',
            });

            if (thumbnailResponse.isSuccess) {
                const blob = mapFileDtoToBlob(thumbnailResponse.result);
                const blobUrl = URL.createObjectURL(blob);
                thumbnailUrl = blobUrl;
            }
        }

        return {
            repositoryUrl: allRepositorySearchResult.result[0].location,
            thumbnailUrl: thumbnailUrl,
        };
    }

    console.warn('Did not find the URL of the AAS');
    return undefined;
}

/**
 * This component is responsible for displaying the list of AAS entries based on a given assetId.
 * This may occur, when multiple AAS are registered to the same assetId.
 * The user can then choose which AAS to view based on AasId and repositoryUrl.
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

        const response = await searchInAllDiscoveries(assetId);

        if (!response.isSuccess) {
            throw new LocalizedError('pages.discoveryList.errors.searchFailed');
        }

        if (response.result.length === 0) {
            throw new LocalizedError('pages.discoveryList.errors.noAasFound');
        }

        const entryList: AasListEntry[] = [];

        await Promise.all(
            response.result.map(async (discoverySearchResult) => {
                const repoUrlAndThumbnail = await getRepositoryUrlAndThumbnail(discoverySearchResult.aasId);
                entryList.push({
                    aasId: discoverySearchResult.aasId,
                    repositoryUrl: repoUrlAndThumbnail?.repositoryUrl,
                    discoveryUrl: discoverySearchResult.location,
                    thumbnailUrl: repoUrlAndThumbnail?.thumbnailUrl,
                    infrastructureName: discoverySearchResult?.infrastructureName,
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
            <Card>
                <GenericListDataWrapper
                    loadContent={loadContent}
                    showThumbnail
                    showAasId
                    showRepositoryUrl
                    showInfrastructureName
                    showDiscoveryUrl
                >
                    <AssetNotFound id={assetId} />
                </GenericListDataWrapper>
            </Card>
        </>
    );
}
