'use client';

import { Box } from '@mui/material';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useParams, useSearchParams } from 'next/navigation';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';
import { ProductViewer } from '../_components/ProductViewer';

export default function Page() {
    const { showError } = useShowError();
    const params = useParams<{ base64AasId: string }>();
    const base64AasId = decodeURIComponent(params.base64AasId).replace(/=+$|[%3D]+$/, '');
    const encodedRepoUrl = useSearchParams().get('repoUrl');
    const repoUrl = encodedRepoUrl ? decodeURI(encodedRepoUrl) : undefined;
    const infrastructureName = useSearchParams().get('infrastructure') || undefined;
    try {
        const aasIdDecoded = safeBase64Decode(base64AasId);

        return (
            <CurrentAasContextProvider aasId={aasIdDecoded} repoUrl={repoUrl} infrastructureName={infrastructureName}>
                <ProductViewer />
            </CurrentAasContextProvider>
        );
    } catch (e) {
        showError(e);
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                    alignItems: 'center',
                    width: '100vw',
                    marginBottom: '50px',
                    marginTop: '20px',
                }}
            >
                <NoSearchResult base64AasId={base64AasId} />
            </Box>
        );
    }
}
