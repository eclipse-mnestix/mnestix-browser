'use client';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { encodeBase64 } from 'lib/util/Base64Util';
import { Box } from '@mui/material';
import { NotFoundError } from 'lib/errors/NotFoundError';
import { useState } from 'react';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import AssetNotFound from 'components/basics/AssetNotFound';
import { performDiscoveryAasSearch } from 'lib/services/search-actions/searchActions';
import { wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { LocalizedError } from 'lib/util/LocalizedError';
import { useShowError } from 'lib/hooks/UseShowError';

export const RedirectToViewer = () => {
    const navigate = useRouter();
    const searchParams = useSearchParams();
    const assetIdParam = searchParams.get('assetId')?.toString();
    const aasIdParam = searchParams.get('aasId')?.toString();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { showError } = useShowError();

    useAsyncEffect(async () => {
        try {
            setIsLoading(true);
            if (assetIdParam) {
                // if assetId is present navigate to the viewer of the asset
                await navigateToViewerOfAsset(decodeURIComponent(assetIdParam ?? ''));
            } else if (aasIdParam) {
                // if instead the aasId is present we dont need to search
                const targetUrl = determineViewerTargetUrl([aasIdParam]);
                // Navigate directly to the viewer
                navigate.replace(targetUrl);
            } else {
                // If neither assetId nor aasId is present, we cannot proceed
                throw new NotFoundError();
            }
        } catch (e) {
            setIsLoading(false);
            setIsError(true);
            showError(e);
        }
    }, []);

    async function navigateToViewerOfAsset(assetId: string | undefined): Promise<void> {
        const { isSuccess, result: aasIds } = await getAasIdsOfAsset(assetId);

        if (!isSuccess) throw new LocalizedError('navigation.errors.urlNotFound');

        assertAtLeastOneAasIdExists(aasIds);
        const targetUrl = determineViewerTargetUrl(aasIds);
        navigate.replace(targetUrl);
    }

    async function getAasIdsOfAsset(assetId: string | undefined) {
        if (!assetId) {
            throw new NotFoundError();
        }
        const response = await performDiscoveryAasSearch(assetId);
        if (response.isSuccess) return response;
        return wrapSuccess([]);
    }

    function assertAtLeastOneAasIdExists(aasIds: string[]) {
        if (aasIds.length === 0) {
            throw new NotFoundError();
        }
    }

    function determineViewerTargetUrl(aasIds: string[]) {
        const encodedAasId = encodeBase64(aasIds[0]);
        return '/viewer/' + encodedAasId;
    }

    return (
        <Box sx={{ p: 2, m: 'auto' }}>
            {isLoading && <CenteredLoadingSpinner />}
            {isError && <AssetNotFound id={assetIdParam ? assetIdParam : aasIdParam} />}
        </Box>
    );
};
