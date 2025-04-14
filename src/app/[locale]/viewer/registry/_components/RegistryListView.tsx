'use client';

import { useSearchParams } from 'next/navigation';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import { performSearchAasFromAllRepositories } from 'lib/services/repository-access/repositorySearchActions';
import { useTranslations } from 'next-intl';
import { LocalizedError } from 'lib/util/LocalizedError';
import { AasListEntry } from 'lib/types/AasListEntry';
import { GenericListDataWrapper } from 'app/[locale]/list/_components/genericList/GenericListDataWrapper';

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

        const response = await performSearchAasFromAllRepositories(encodeBase64(aasId));

        if (!response.isSuccess) {
            throw new LocalizedError('pages.registryList.errors.searchFailed');
        }

        if (response.result.length === 0) {
            throw new LocalizedError('pages.registryList.errors.noAasFound');
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

    if (!aasId) {
        return <AssetNotFound />;
    }

    return (
        <>
            <ListHeader header={t('title')} subHeader={t('subtitle')} optionalID={aasId} />
            <GenericListDataWrapper loadContent={loadContent} showThumbnail showAssetId showRepositoryUrl>
                <AssetNotFound id={aasId} />
            </GenericListDataWrapper>
        </>
    );
};
