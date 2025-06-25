import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { DataRow } from 'components/basics/DataRow';
import { AssetAdministrationShell, SpecificAssetId } from '@aas-core-works/aas-core3.0-typescript/types';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { ShellIcon } from 'components/custom-icons/ShellIcon';
import { isValidUrl } from 'lib/util/UrlUtil';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useProductImageUrl } from 'lib/hooks/UseProductImageUrl';
import { MobileAccordion } from 'components/basics/detailViewBasics/MobileAccordion';
import { useAasStore } from 'stores/AasStore';

type AASOverviewCardProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly productImage?: string;
    readonly isLoading?: boolean;
    readonly isAccordion: boolean;
    readonly imageLinksToDetail?: boolean;
    readonly repositoryURL?: string;
};

export function AASOverviewCard(props: AASOverviewCardProps) {
    const isAccordion = props.isAccordion;
    const specificAssetIds = props.aas?.assetInformation?.specificAssetIds as SpecificAssetId[];
    const navigate = useRouter();
    const { addAasData } = useAasStore();
    const t = useTranslations('pages.aasViewer');
    const productImageUrl = useProductImageUrl(props.aas, props.repositoryURL, props.productImage);

    const infoBoxStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        flexGrow: '1',
        flexBasis: '0',
    };

    const titleStyle = {
        marginBottom: '15px',
    };

    const cardContentStyle = {
        display: 'flex',
        alignItems: isAccordion ? 'center' : 'unset',
        gap: isAccordion ? '10px' : '40px',
        flexDirection: isAccordion ? 'column' : 'row',
    };

    const navigateToAas = () => {
        if (props.imageLinksToDetail && props.aas) {
            addAasData({
                aas: props.aas,
                aasData: {
                    aasRepositoryOrigin: props.repositoryURL,
                    submodelDescriptors: undefined,
                },
            });
            const url = `/viewer/${encodeBase64(props.aas.id)}`;
            navigate.push(url);
        }
    };

    const aasInfo = (
        <Box sx={infoBoxStyle} data-testid="aas-data">
            {!isAccordion && (
                <Box display="flex">
                    <IconCircleWrapper sx={{ mr: 1 }}>
                        <ShellIcon fontSize="small" color="primary" />
                    </IconCircleWrapper>
                    <Typography sx={titleStyle} variant="h3">
                        {t('assetAdministrationShell')}
                    </Typography>
                </Box>
            )}
            <DataRow title="id" value={props.aas?.id} testId="datarow-aas-id" withBase64={true} />
            <DataRow title="idShort" value={props.aas?.idShort ?? '-'} />
            <DataRow title="repositoryURL" value={props.repositoryURL ?? '-'} />
            {props.aas?.derivedFrom?.keys?.[0] && (
                <DataRow
                    title="derivedFrom"
                    value={props.aas.derivedFrom?.keys?.[0]?.value}
                    isLink={isValidUrl(props.aas.derivedFrom?.keys?.[0]?.value)}
                />
            )}
        </Box>
    );

    const assetInfo = (
        <Box sx={infoBoxStyle} data-testid="asset-data">
            {!isAccordion && (
                <Box display="flex">
                    <IconCircleWrapper sx={{ mr: 1 }}>
                        <AssetIcon fontSize="small" color="primary" />
                    </IconCircleWrapper>
                    <Typography sx={titleStyle} variant="h3">
                        {t('asset')}
                    </Typography>
                </Box>
            )}
            <DataRow
                title="globalAssetId"
                value={props.aas?.assetInformation?.globalAssetId ?? '-'}
                testId="datarow-asset-id"
                withBase64={true}
            />
            {props.aas?.assetInformation?.assetType && (
                <DataRow title="assetType" value={props.aas?.assetInformation?.assetType ?? '-'} />
            )}
            {specificAssetIds && (
                <>
                    {specificAssetIds.map((id, index) => {
                        return <DataRow key={index} title={id.name ?? '-'} value={id.value ?? '-'} />;
                    })}
                </>
            )}
        </Box>
    );

    return (
        <Card>
            <CardContent sx={cardContentStyle}>
                {props.isLoading && !props.aas ? (
                    <>
                        <Skeleton
                            variant="rectangular"
                            sx={{ height: '300px', maxWidth: '300px', width: '100%' }}
                            data-testid="aas-loading-skeleton"
                        ></Skeleton>
                        <Box width="100%">
                            {isAccordion ? (
                                <Box sx={{ m: 1 }}>
                                    <Skeleton width="100%" />
                                    <Skeleton width="100%" sx={{ mt: 1 }} />
                                </Box>
                            ) : (
                                <>
                                    <Skeleton width="90%" />
                                    <Skeleton width="50%" />
                                    <Skeleton width="75%" sx={{ mt: 2 }} />
                                    <Skeleton width="50%" />
                                </>
                            )}
                        </Box>
                    </>
                ) : (
                    <>
                        {props.isLoading ? (
                            <Skeleton
                                variant="rectangular"
                                sx={{ height: '300px', maxWidth: '300px', width: '100%' }}
                            ></Skeleton>
                        ) : (
                            <ImageWithFallback
                                src={productImageUrl}
                                alt={'Thumbnail'}
                                onClickHandler={props.imageLinksToDetail ? navigateToAas : undefined}
                                size={300}
                            />
                        )}
                        {isAccordion ? (
                            <>
                                <MobileAccordion
                                    content={aasInfo}
                                    title={t('assetAdministrationShell')}
                                    icon={<ShellIcon fontSize="small" color="primary" />}
                                />
                                <MobileAccordion
                                    content={assetInfo}
                                    title={t('asset')}
                                    icon={<AssetIcon fontSize="small" color="primary" />}
                                />
                            </>
                        ) : (
                            <>
                                {aasInfo} {assetInfo}
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
