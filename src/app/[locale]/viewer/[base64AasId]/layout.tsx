'use client';

import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useParams, useSearchParams } from 'next/navigation';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { useShowError } from 'lib/hooks/UseShowError';
import { AasViewSwitcher } from 'app/[locale]/viewer/_components/AasViewSwitcher';

/**
 * Shared layout for a single AAS. Hoists {@link CurrentAasContextProvider} so
 * AAS + submodel data is fetched once and preserved across view switches under
 * the `[view]` segment, and renders the {@link AasViewSwitcher} above the view.
 */
export default function AasViewerLayout({ children }: PropsWithChildren) {
    const { showError } = useShowError();
    const params = useParams<{ base64AasId: string }>();
    const base64AasId = decodeURIComponent(params.base64AasId).replace(/(=|%3D)+$/i, '');
    const encodedRepoUrl = useSearchParams().get('repoUrl');
    const repoUrl = encodedRepoUrl ? decodeURI(encodedRepoUrl) : undefined;
    const infrastructureName = useSearchParams().get('infrastructure') || undefined;

    let aasIdDecoded: string;
    try {
        aasIdDecoded = safeBase64Decode(base64AasId);
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

    return (
        <CurrentAasContextProvider aasId={aasIdDecoded} repoUrl={repoUrl} infrastructureName={infrastructureName}>
            <AasViewSwitcher />
            {children}
        </CurrentAasContextProvider>
    );
}
