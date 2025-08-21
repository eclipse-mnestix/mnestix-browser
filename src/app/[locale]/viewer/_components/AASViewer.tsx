'use client';

import { Box, Button, Skeleton, Typography } from '@mui/material';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { useParams, useRouter } from 'next/navigation';
import { SubmodelsOverviewCard } from '../_components/SubmodelsOverviewCard';
import { AASOverviewCard } from 'app/[locale]/viewer/_components/AASOverviewCard';
import { useEnv } from 'app/EnvProvider';
import { TransferButton } from 'app/[locale]/viewer/_components/transfer/TransferButton';
import { useLocale, useTranslations } from 'next-intl';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useShowError } from 'lib/hooks/UseShowError';

export function AASViewer() {
    const navigate = useRouter();
    const isMobile = useIsMobile();
    const locale = useLocale();
    const env = useEnv();
    const t = useTranslations('pages.aasViewer');

    const { aas, submodels, isLoadingAas, isLoadingSubmodels, aasOriginUrl, infrastructureName } =
        useCurrentAasContext();

    const params = useParams<{ base64AasId: string }>();
    const base64AasId = decodeURIComponent(params.base64AasId).replace(/=+$|[%3D]+$/, '');
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
    try {
        const aasIdDecoded = safeBase64Decode(base64AasId);

        const startComparison = () => {
            navigate.push(`/compare?aasId=${encodeURIComponent(aasIdDecoded)}`);
        };

        const goToProductView = () => {
            navigate.push(`/product/${params.base64AasId}`);
        };

        return (
            <Box sx={pageStyles}>
                {aas || isLoadingAas ? (
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
                                ) : aas?.displayName ? (
                                    getTranslationText(aas?.displayName, locale)
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
                            {env.PRODUCT_VIEW_FEATURE_FLAG && (
                                <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={goToProductView}>
                                    {t('actions.toProductView')}
                                </Button>
                            )}
                        </Box>
                        <AASOverviewCard
                            aas={aas ?? null}
                            productImage={aas?.assetInformation?.defaultThumbnail?.path}
                            isLoading={isLoadingAas}
                            isAccordion={isMobile}
                            repositoryURL={aasOriginUrl}
                            infrastructureName={infrastructureName}
                        />
                        <SubmodelsOverviewCard
                            aas={aas}
                            submodelIds={submodels}
                            submodelsLoading={isLoadingSubmodels}
                        />
                    </Box>
                ) : (
                    <Box sx={pageStyles}>
                        <NoSearchResult base64AasId={base64AasId} />
                    </Box>
                )}
            </Box>
        );
    } catch (e) {
        const { showError } = useShowError();
        showError(e);
        return (
            <Box sx={pageStyles}>
                <NoSearchResult base64AasId={base64AasId} />
            </Box>
        );
    }
}
