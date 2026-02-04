'use client';

import { useSearchParams } from 'next/navigation';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import {
    getThumbnailFromShell,
    searchAasInAllRepositories,
} from 'lib/services/aas-repository-service/aasRepositoryActions';
import { useTranslations } from 'next-intl';
import { LocalizedError } from 'lib/util/LocalizedError';
import { AasListEntry } from 'lib/types/AasListEntry';
import { GenericListDataWrapper } from 'components/basics/listBasics/GenericListDataWrapper';
import { Card } from '@mui/material';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { isValidUrl } from 'lib/util/UrlUtil';

/**
 * This component is responsible for displaying the list of AAS entries based on a given aasId.
 * This may occur, when multiple AAS are registered with the same aasId.
 * The user can then choose which AAS to view based on assetId and repositoryUrl.
 * // TODO MNES-904: show registryUrl
 */
export const RegistryListView = () => {
    const searchParams = useSearchParams();
    const encodedAasId = searchParams.get('aasId');
    const aasId = encodedAasId ? decodeURI(encodedAasId) : undefined;

    const t = useTranslations('pages.registryList');

    async function loadContent() {
        if (!aasId) {
            throw new LocalizedError('pages.registryList.errors.noAasId');
        }

        const response = await searchAasInAllRepositories(encodeBase64(aasId));

        if (!response.isSuccess) {
            throw new LocalizedError('pages.registryList.errors.searchFailed');
        }

        if (response.result.length === 0) {
            throw new LocalizedError('pages.registryList.errors.noAasFound');
        }

        const entryList: AasListEntry[] = await Promise.all(
            response.result.map(async (aasSearchResult) => {
                const defaultThumbnailPath =
                    aasSearchResult.searchResult.assetInformation?.defaultThumbnail?.path ?? undefined;

                let thumbnailUrl: string | undefined;

                if (defaultThumbnailPath && isValidUrl(defaultThumbnailPath)) {
                    thumbnailUrl = defaultThumbnailPath;
                } else {
                    const thumbnailResponse = await getThumbnailFromShell(aasSearchResult.searchResult.id, {
                        url: aasSearchResult.location,
                        infrastructureName: aasSearchResult.infrastructureName ?? '',
                    });

                    if (thumbnailResponse.isSuccess) {
                        const blob = mapFileDtoToBlob(thumbnailResponse.result);
                        const blobUrl = URL.createObjectURL(blob);
                        thumbnailUrl = blobUrl;
                    }
                }

                return {
                    aasId: aasSearchResult.searchResult.id,
                    assetId: aasSearchResult.searchResult.assetInformation.globalAssetId ?? undefined,
                    repositoryUrl: aasSearchResult.location,
                    thumbnailUrl,
                    infrastructureName: aasSearchResult.infrastructureName ?? undefined,
                };
            }),
        );

        return entryList;
    }

    if (!aasId) {
        return <AssetNotFound />;
    }

    return (
        <>
            <ListHeader header={t('title')} subHeader={t('subtitle')} optionalID={aasId} />
            <Card>
                <GenericListDataWrapper
                    loadContent={loadContent}
                    showThumbnail
                    showAssetId
                    showRepositoryUrl
                    showInfrastructureName
                >
                    <AssetNotFound id={aasId} />
                </GenericListDataWrapper>
            </Card>
        </>
    );
};
