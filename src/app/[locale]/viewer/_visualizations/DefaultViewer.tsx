'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { SubmodelsOverviewCard } from '../_components/SubmodelsOverviewCard';
import { AASOverviewCard } from 'app/[locale]/viewer/_components/AASOverviewCard';
import { AasViewerActionBar } from 'app/[locale]/viewer/_components/AasViewerActionBar';
import { useLocale } from 'next-intl';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { ViewerShell } from './ViewerShell';

export function DefaultViewer() {
    const isMobile = useIsMobile();
    const locale = useLocale();

    const { aas, submodels, isLoadingAas, isLoadingSubmodels, aasOriginUrl, infrastructureName } =
        useCurrentAasContext();

    return (
        <ViewerShell>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="h2"
                        style={{
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            textAlign: 'left',
                        }}
                    >
                        {isLoadingAas ? (
                            <Skeleton width="40%" />
                        ) : aas?.displayName ? (
                            getTranslationText(aas?.displayName, locale)
                        ) : (
                            ''
                        )}
                    </Typography>
                </Box>
                <AasViewerActionBar />
            </Box>
            <AASOverviewCard
                aas={aas ?? null}
                productImage={aas?.assetInformation?.defaultThumbnail?.path}
                isLoading={isLoadingAas}
                isAccordion={isMobile}
                repositoryURL={aasOriginUrl}
                infrastructureName={infrastructureName}
            />
            <SubmodelsOverviewCard aas={aas} submodelIds={submodels} submodelsLoading={isLoadingSubmodels} />
        </ViewerShell>
    );
}
