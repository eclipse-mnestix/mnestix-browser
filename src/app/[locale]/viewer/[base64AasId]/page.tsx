'use client';

import { Box, Button, Skeleton, Typography } from '@mui/material';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SubmodelsOverviewCard } from '../_components/SubmodelsOverviewCard';
import { AASOverviewCard } from 'app/[locale]/viewer/_components/AASOverviewCard';
import { useEnv } from 'app/EnvProvider';
import { TransferButton } from 'app/[locale]/viewer/_components/transfer/TransferButton';
import { useLocale, useTranslations } from 'next-intl';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { useAasLoader } from 'lib/hooks/UseAasDataLoader';

export default function Page() {
    const navigate = useRouter();
    const searchParams = useParams<{ base64AasId: string }>();
    const base64AasId = decodeURIComponent(searchParams.base64AasId).replace(/=+$|[%3D]+$/, '');
    const aasIdDecoded = safeBase64Decode(base64AasId);
    const isMobile = useIsMobile();
    const locale = useLocale();
    const env = useEnv();
    const encodedRepoUrl = useSearchParams().get('repoUrl');
    const repoUrl = encodedRepoUrl ? decodeURI(encodedRepoUrl) : undefined;
    const t = useTranslations('pages.aasViewer');

    const {
        aasFromContext,
        isLoadingAas,
        aasOriginUrl,
        submodels,
        isSubmodelsLoading,
    } = useAasLoader(base64AasId, repoUrl);

    const startComparison = () => {
        navigate.push(`/compare?aasId=${encodeURIComponent(aasIdDecoded)}`);
    };

    const goToProductView = () => {
        navigate.push(`/product/${searchParams.base64AasId}`);
    };

    const pageStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        alignItems: 'center',
        width: '100vw',
        marginBottom: '50px',
        marginTop: '20px',
    };

    const viewerStyles = {
        maxWidth: '1125px',
        width: '90%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    return (
        <Box sx={pageStyles}>
            {aasFromContext || isLoadingAas ? (
                <Box sx={viewerStyles}>
                    <Box display="flex" flexDirection="row" alignContent="flex-end">
                        <Typography
                            variant="h2"
                            style={{
                                width: '90%',
                                margin: '0 auto',
                                marginTop: '10px',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                textAlign: 'center',
                                display: 'inline-block',
                            }}
                        >
                            {isLoadingAas ? (
                                <Skeleton width="40%" sx={{ margin: '0 auto' }} />
                            ) : aasFromContext?.displayName ? (
                                getTranslationText(aasFromContext?.displayName, locale)
                            ) : (
                                ''
                            )}
                        </Typography>
                        {env.COMPARISON_FEATURE_FLAG && !isMobile && (
                            <Button
                                sx={{ mr: 2 }}
                                variant="contained"
                                onClick={startComparison}
                                data-testid="detail-compare-button"
                            >
                                {t('actions.compareButton')}
                            </Button>
                        )}
                        {env.TRANSFER_FEATURE_FLAG && <TransferButton />}
                        {env.PRODUCT_VIEW_FEATURE_FLAG &&
                            <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={goToProductView}>
                                {t('actions.toProductView')}
                            </Button>
                        }
                    </Box>
                    <AASOverviewCard
                        aas={aasFromContext ?? null}
                        productImage={aasFromContext?.assetInformation?.defaultThumbnail?.path}
                        isLoading={isLoadingAas}
                        isAccordion={isMobile}
                        repositoryURL={aasOriginUrl}
                    />
                    {aasFromContext?.submodels && aasFromContext.submodels.length > 0 && (
                        <SubmodelsOverviewCard submodelIds={submodels} submodelsLoading={isSubmodelsLoading} />
                    )}
                </Box>
            ) : (
                <NoSearchResult base64AasId={safeBase64Decode(base64AasId)} />
            )}
        </Box>
    );
}
