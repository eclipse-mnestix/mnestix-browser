'use client';

import { Box, Button, Skeleton, Typography } from '@mui/material';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import {
    checkIfSubmodelHasIdShortOrSemanticId,
    findSubmodelByIdOrSemanticId,
    getTranslationText,
} from 'lib/util/SubmodelResolverUtil';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SubmodelsOverviewCard } from 'app/[locale]/viewer/_components/SubmodelsOverviewCard';
import { ProductOverviewCard } from '../_components/ProductOverviewCard';
import { useEnv } from 'app/EnvProvider';
import { TransferButton } from 'app/[locale]/viewer/_components/transfer/TransferButton';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { useAasLoader } from 'lib/hooks/UseAasDataLoader';
import { useLocale } from 'next-intl';
import { useTranslations } from 'use-intl';
import { useEffect, useState } from 'react';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';

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
    const [filteredSubmodels, setFilteredSubmodels] = useState<SubmodelOrIdReference[]>([]);
    // TODO refactor translation strings here
    const t = useTranslations('pages.aasViewer');
    const tp = useTranslations('pages.productViewer');

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

    const goToAASView = () => {
        navigate.push(`/viewer/${searchParams.base64AasId}`);
    };

    useEffect(() => {
        if (submodels) {
            const filtered = submodels.filter(
                (submodel) =>
                    !(checkIfSubmodelHasIdShortOrSemanticId(submodel, undefined, 'AasDesignerChangelog') ||
                    checkIfSubmodelHasIdShortOrSemanticId(submodel,  SubmodelSemanticIdEnum.NameplateV2, 'Nameplate'))
            );
            setFilteredSubmodels(filtered);
        }

    }, [submodels]);

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
                            <Button variant="contained" sx={{ whiteSpace: 'nowrap' }} onClick={goToAASView}>
                                {tp('actions.toAasView')}
                            </Button>
                        }
                    </Box>
                    <ProductOverviewCard
                        aas={aasFromContext}
                        submodels={submodels}
                        productImage={aasFromContext?.assetInformation?.defaultThumbnail?.path}
                        isLoading={isLoadingAas}
                        isAccordion={isMobile}
                        repositoryURL={aasOriginUrl}
                    />
                    {aasFromContext?.submodels && aasFromContext.submodels.length > 0 && (
                        <SubmodelsOverviewCard submodelIds={filteredSubmodels} submodelsLoading={isSubmodelsLoading} firstSubmodelIdShort="TechnicalData" />
                    )}
                </Box>
            ) : (
                <NoSearchResult base64AasId={safeBase64Decode(base64AasId)} />
            )}
        </Box>
    );
}
