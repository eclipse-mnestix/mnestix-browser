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
import {
    checkIfInfrastructureHasSerializationEndpoints,
    serializeAasFromInfrastructure,
} from 'lib/services/serialization-service/serializationActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';

export function AASViewer() {
    const navigate = useRouter();
    const isMobile = useIsMobile();
    const locale = useLocale();
    const env = useEnv();
    const t = useTranslations('pages.aasViewer');
    const { showError } = useShowError();
    const { spawn } = useNotificationSpawner();
    const [showDownloadButton, setShowDownloadButton] = useState(false);

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

    async function downloadAAS() {
        if (!aas?.id || !infrastructureName) {
            showError(t('errors.downloadError'));
            return;
        }
        const submodelIds = Array.isArray(submodels) ? submodels.map((s) => s.id) : [];
        try {
            const response = await serializeAasFromInfrastructure(aas?.id, submodelIds, infrastructureName);
            if (response.isSuccess && response.result) {
                const { blob, endpointUrl, infrastructureName: infra } = response.result;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${aas?.idShort}.aasx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Show success message with endpoint information
                spawn({
                    title: t('actions.download'),
                    message: t('messages.downloadSuccess', {
                        endpoint: endpointUrl,
                        infrastructure: infra,
                    }),
                    severity: 'success',
                });
            } else if (!response.isSuccess) {
                showError(response.message);
            }
        } catch {
            showError(t('errors.downloadError'));
        }
    }

    useAsyncEffect(async () => {
        if (infrastructureName) {
            const serializationEndpointAvailable =
                await checkIfInfrastructureHasSerializationEndpoints(infrastructureName);
            setShowDownloadButton(serializationEndpointAvailable.isSuccess);
        }
    }, []);

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
                            {env.PRODUCT_VIEW_FEATURE_FLAG && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto',
                                        padding: '6px 16px',
                                    }}
                                    onClick={goToProductView}
                                >
                                    {t('actions.toProductView')}
                                </Button>
                            )}
                            {env.TRANSFER_FEATURE_FLAG && <TransferButton />}
                            {showDownloadButton && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        ml: 2,
                                        minWidth: 'auto',
                                        padding: '6px 16px',
                                    }}
                                    onClick={downloadAAS}
                                >
                                    {t('actions.download')}
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
        showError(e);
        return (
            <Box sx={pageStyles}>
                <NoSearchResult base64AasId={base64AasId} />
            </Box>
        );
    }
}
