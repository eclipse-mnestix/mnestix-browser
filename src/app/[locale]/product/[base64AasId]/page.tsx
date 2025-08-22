'use client';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useParams, useSearchParams } from 'next/navigation';
import { ProductViewer } from '../_components/ProductViewer';
import { useShowError } from 'lib/hooks/UseShowError';
import { Box } from '@mui/material';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';

export default function () {
    const { showError } = useShowError();
    const params = useParams<{ base64AasId: string }>();
    const base64AasId = (params.base64AasId || '').replace(/=+$|[%3D]+$/, '');
    const searchParams = useSearchParams();
    const encodedRepoUrl = searchParams.get('repoUrl');
    const repoUrl = encodedRepoUrl ? decodeURI(encodedRepoUrl) : undefined;

    try {
        const aasIdDecoded = safeBase64Decode(base64AasId);

        return (
            <CurrentAasContextProvider aasId={aasIdDecoded} repoUrl={repoUrl}>
                <ProductViewer />
            </CurrentAasContextProvider>
        );
    } catch (e) {
        showError(e);
        return (
            <Box sx={{ padding: 2 }}>
                <NoSearchResult base64AasId={base64AasId} />
            </Box>
        );
    }
}
