'use client';

import { FormattedMessage, useIntl } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useState } from 'react';
import DiscoveryList from 'app/[locale]/viewer/discovery/_components/DiscoveryList';
import { useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { IDiscoveryListEntry } from 'lib/types/DiscoveryListEntry';
import AssetNotFound from 'components/basics/AssetNotFound';
import { encodeBase64 } from 'lib/util/Base64Util';
import ListHeader from 'components/basics/ListHeader';
import { performDiscoveryAasSearch, performRegistryAasSearch } from 'lib/services/search-actions/searchActions';
import { performSearchAasFromAllRepositories } from 'lib/services/repository-access/repositorySearchActions';
import { RepoSearchResult } from 'lib/services/repository-access/RepositorySearchService';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/types';

async function getRepositoryUrl(aasId: string): Promise<string | undefined> {
    const registrySearchResult = await performRegistryAasSearch(aasId);
    if (registrySearchResult.isSuccess) return registrySearchResult?.result.aasData?.aasRepositoryOrigin;

    const allRepositorySearchResult = await performSearchAasFromAllRepositories(encodeBase64(aasId));
    if (allRepositorySearchResult.isSuccess) return allRepositorySearchResult.result[0].location;

    console.warn('Did not find the URL of the AAS');
    return undefined;
}

export const DiscoveryListView = () => {
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [discoveryListEntries, setDiscoveryListEntries] = useState<IDiscoveryListEntry[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const intl = useIntl();
    const searchParams = useSearchParams();
    const encodedAssetId = searchParams.get('assetId');
    const assetId = encodedAssetId ? decodeURI(encodedAssetId) : undefined;
    const encodedAasId = searchParams.get('aasId');
    const aasId = encodedAasId ? decodeURI(encodedAasId) : undefined;

    useAsyncEffect(async () => {
        setIsLoadingList(true);
        const entryList: IDiscoveryListEntry[] = [];

        if (assetId) {
            const response = await performDiscoveryAasSearch(assetId);

            if (!response.isSuccess || response.result.length === 0) {
                setIsLoadingList(false);
                return;
            }
            const aasIds = response.result!;
            await Promise.all(
                aasIds.map(async (aasId) => {
                    const repositoryUrl = await getRepositoryUrl(aasId);
                    entryList.push({
                        aasId: aasId,
                        repositoryUrl: repositoryUrl,
                    });
                }),
            );
        } else if (aasId) {
            const response = await performSearchAasFromAllRepositories(encodeBase64(aasId));
            let searchResults: RepoSearchResult<AssetAdministrationShell>[] = [];
            if (response.isSuccess) searchResults = response.result;
            else setIsError(true);
            for (const searchResult of searchResults) {
                entryList.push({
                    aasId: searchResult.searchResult.id,
                    repositoryUrl: searchResult.location,
                });
            }
        }

        if (entryList.length < 1) {
            setIsError(true);
        } else {
            setDiscoveryListEntries(entryList);
        }

        setIsLoadingList(false);
    }, []);

    const tableHeaders = [
        { label: intl.formatMessage(messages.mnestix.discoveryList.picture) },
        { label: intl.formatMessage(messages.mnestix.discoveryList.aasIdHeading) },
        { label: intl.formatMessage(messages.mnestix.discoveryList.repositoryUrl) },
    ];

    return (
        <>
            <ListHeader namespace={'discoveryList'} header={'header'} optionalID={assetId ?? aasId} />
            {isLoadingList && <CenteredLoadingSpinner sx={{ mt: 10 }} />}
            {!isLoadingList && !isError && (
                <>
                    <Typography marginBottom={3}>
                        <FormattedMessage {...messages.mnestix.discoveryList.subtitle} />
                    </Typography>
                    <DiscoveryList tableHeaders={tableHeaders} data={discoveryListEntries} />
                </>
            )}
            {isError && <AssetNotFound id={assetId ?? aasId} />}
        </>
    );
};
