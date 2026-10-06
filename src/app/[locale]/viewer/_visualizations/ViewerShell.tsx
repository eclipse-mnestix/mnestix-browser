'use client';

import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useParams } from 'next/navigation';
import { safeBase64Decode, stripBase64Padding } from 'lib/util/Base64Util';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';

export const viewerPageStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: 'center',
    marginBottom: '50px',
    marginTop: '20px',
} as const;

export const viewerContentStyles = {
    maxWidth: '1125px',
    width: '90%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
} as const;

/**
 * Shared scaffolding for AAS views. Centralizes the concerns every view repeated:
 * decode the `base64AasId` route param (showing {@link NoSearchResult} on failure),
 * gate on whether an AAS is present/loading, and apply the common page layout.
 * Views render only their body as `children`.
 */
export function ViewerShell({ children }: PropsWithChildren) {
    const { showError } = useShowError();
    const params = useParams<{ base64AasId: string }>();
    const base64AasId = stripBase64Padding(decodeURIComponent(params.base64AasId));
    const { aas, isLoadingAas } = useCurrentAasContext();

    try {
        safeBase64Decode(base64AasId);
    } catch (e) {
        showError(e);
        return (
            <Box sx={viewerPageStyles}>
                <NoSearchResult base64AasId={base64AasId} />
            </Box>
        );
    }

    return (
        <Box sx={viewerPageStyles}>
            {aas || isLoadingAas ? (
                <Box sx={viewerContentStyles}>{children}</Box>
            ) : (
                <NoSearchResult base64AasId={base64AasId} />
            )}
        </Box>
    );
}
