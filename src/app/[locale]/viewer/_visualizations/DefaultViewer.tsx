'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { SubmodelsOverviewCard } from '../_components/SubmodelsOverviewCard';
import { AASOverviewCard } from 'app/[locale]/viewer/_components/AASOverviewCard';
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
                    alignContent: 'flex-end',
                }}
            >
                <Typography
                    variant="h2"
                    style={{
                        width: '90%',
                        margin: '0 auto',
                        marginTop: '2px',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        display: 'inline-block',
                    }}
                >
                    {isLoadingAas ? (
                        <Skeleton width="40%" sx={{ margin: '0 auto' }} />
                    ) : aas?.displayName ? (
                        getTranslationText(aas?.displayName, locale)
                    ) : (
                        ''
                    )}
                </Typography>
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
