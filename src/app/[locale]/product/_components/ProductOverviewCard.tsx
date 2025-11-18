import { Box, Card, CardContent, Skeleton, Typography, Divider } from '@mui/material';
import React, { useMemo } from 'react';
import { DataRow } from 'components/basics/DataRow';
import { AssetAdministrationShell, SubmodelElementChoice, SubmodelElementCollection } from 'lib/api/aas/models';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useRouter } from 'next/navigation';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { useTranslations } from 'next-intl';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { findSubmodelByIdOrSemanticId, findSubmodelElementByIdShort } from 'lib/util/SubmodelResolverUtil';
import { MobileAccordion } from 'components/basics/detailViewBasics/MobileAccordion';
import { ProductClassificationInfoBox } from './ProductClassificationInfoBox';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { useProductImageUrl } from 'lib/hooks/UseProductImageUrl';
import { useFindValueByIdShort } from 'lib/hooks/useFindValueByIdShort';
import { MarkingsComponent } from 'app/[locale]/viewer/_components/submodel-elements/marking-components/MarkingsComponent';
import { ActionMenu } from './ProductActionMenu';
import { useAasStore } from 'stores/AasStore';

type ProductOverviewCardProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly submodels: SubmodelOrIdReference[] | null;
    readonly productImage?: string;
    readonly isLoading?: boolean;
    readonly isAccordion: boolean;
    readonly imageLinksToDetail?: boolean;
    readonly repositoryURL?: string;
    readonly displayName: string | null;
};

type ProductClassification = {
    ProductClassificationSystem?: string;
    ProductClassId?: string;
};

type OverviewData = {
    readonly manufacturerName?: string;
    readonly manufacturerProductDesignation?: string;
    readonly manufacturerProductRoot?: string;
    readonly manufacturerProductFamily?: string;
    readonly manufacturerProductType?: string;
    readonly manufacturerArticleNumber?: string;
    readonly manufacturerOrderCode?: string;
    readonly manufacturerLogo: SubmodelElementChoice | null;
    readonly companyLogo: SubmodelElementChoice | null;
    readonly markings?: SubmodelElementCollection;
    readonly productClassifications?: ProductClassification[];
};

export function ProductOverviewCard(props: ProductOverviewCardProps) {
    const isAccordion = props.isAccordion;
    const navigate = useRouter();
    const { addAasData } = useAasStore();
    const t = useTranslations('pages.productViewer');
    const findValue = useFindValueByIdShort();
    const productImageUrl = useProductImageUrl(props.aas, props.repositoryURL, props.productImage);

    const nameplateSubmodel = useMemo(() => {
        if (!props.submodels) return undefined;
        return findSubmodelByIdOrSemanticId(props.submodels, SubmodelSemanticIdEnum.NameplateV2, 'Nameplate');
    }, [props.submodels]);

    const overviewData: OverviewData | undefined = useMemo(() => {
        if (!props.submodels || props.submodels.length === 0) {
            return undefined;
        }

        let techData: Partial<OverviewData> = {};
        let nameplateData: Partial<OverviewData> = {};

        const technicalData = findSubmodelByIdOrSemanticId(
            props.submodels,
            SubmodelSemanticIdEnum.TechnicalDataV11,
            'TechnicalData',
        );

        if (technicalData?.submodelElements) {
            const technicalDataSubmodelElements = technicalData.submodelElements;
            const manufacturerName = findValue(
                technicalDataSubmodelElements,
                'ManufacturerName',
                SubmodelElementSemanticIdEnum.ManufacturerName,
            );
            const manufacturerProductDesignation = findValue(
                technicalDataSubmodelElements,
                'ManufacturerProductDesignation',
                SubmodelElementSemanticIdEnum.ManufacturerProductDesignation,
            );
            const manufacturerArticleNumber = findValue(
                technicalDataSubmodelElements,
                'ManufacturerArticleNumber',
                SubmodelElementSemanticIdEnum.ManufacturerArticleNumber,
            );
            const manufacturerOrderCode = findValue(
                technicalDataSubmodelElements,
                'ManufacturerOrderCode',
                SubmodelElementSemanticIdEnum.ManufacturerOrderCode,
            );
            const manufacturerLogo = findSubmodelElementByIdShort(
                technicalDataSubmodelElements,
                'ManufacturerLogo',
                SubmodelElementSemanticIdEnum.ManufacturerLogo,
            );
            const productClassifications = findSubmodelElementByIdShort(
                technicalDataSubmodelElements,
                'ProductClassifications',
                SubmodelElementSemanticIdEnum.ProductClassifications,
            ) as SubmodelElementCollection;
            const classifications: ProductClassification[] = [];
            productClassifications?.value?.forEach((productClassification) => {
                const submodelClassification = productClassification as SubmodelElementCollection;
                if (submodelClassification?.value) {
                    const classification = {
                        ProductClassificationSystem:
                            findValue(
                                submodelClassification.value,
                                'ProductClassificationSystem',
                                SubmodelElementSemanticIdEnum.ProductClassificationSystem,
                            ) || undefined,
                        ProductClassId:
                            findValue(
                                submodelClassification.value,
                                'ProductClassId',
                                SubmodelElementSemanticIdEnum.ProductClassId,
                            ) || undefined,
                    };
                    classifications.push(classification);
                }
            });

            techData = {
                manufacturerName: manufacturerName ?? '-',
                manufacturerProductDesignation: manufacturerProductDesignation ?? '-',
                productClassifications: classifications,
                manufacturerArticleNumber: manufacturerArticleNumber ?? '-',
                manufacturerOrderCode: manufacturerOrderCode ?? '-',
                manufacturerLogo: manufacturerLogo,
            };
        }

        if (nameplateSubmodel?.submodelElements) {
            const nameplateSubmodelElements = nameplateSubmodel.submodelElements;
            const manufacturerProductRoot = findValue(
                nameplateSubmodelElements,
                'ManufacturerProductRoot',
                SubmodelElementSemanticIdEnum.ManufacturerProductRoot,
            );
            const manufacturerProductFamily = findValue(
                nameplateSubmodelElements,
                'ManufacturerProductFamily',
                SubmodelElementSemanticIdEnum.ManufacturerProductFamily,
            );
            const manufacturerProductType = findValue(
                nameplateSubmodelElements,
                'ManufacturerProductType',
                SubmodelElementSemanticIdEnum.ManufacturerProductType,
            );
            const markings = findSubmodelElementByIdShort(
                nameplateSubmodelElements,
                'Markings',
                SubmodelElementSemanticIdEnum.MarkingsV3,
            );
            const companyLogo = findSubmodelElementByIdShort(
                nameplateSubmodelElements,
                'CompanyLogo',
                SubmodelElementSemanticIdEnum.CompanyLogo,
            );

            nameplateData = {
                manufacturerProductRoot: manufacturerProductRoot ?? '-',
                manufacturerProductFamily: manufacturerProductFamily ?? '-',
                manufacturerProductType: manufacturerProductType ?? '-',
                markings: markings as SubmodelElementCollection,
                companyLogo: companyLogo || null,
            };
        }

        return {
            manufacturerName: techData.manufacturerName,
            manufacturerProductDesignation: techData.manufacturerProductDesignation,
            productClassifications: techData.productClassifications,
            manufacturerArticleNumber: techData.manufacturerArticleNumber,
            manufacturerOrderCode: techData.manufacturerOrderCode,
            manufacturerLogo: techData.manufacturerLogo || null,
            manufacturerProductRoot: nameplateData.manufacturerProductRoot,
            manufacturerProductFamily: nameplateData.manufacturerProductFamily,
            manufacturerProductType: nameplateData.manufacturerProductType,
            markings: nameplateData.markings,
            companyLogo: nameplateData.companyLogo || null,
        };
    }, [props.submodels, findValue, nameplateSubmodel]);

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
            addAasData({ aas: props.aas });
            const url = `/product/${encodeBase64(props.aas.id)}`;
            navigate.push(url);
        }
    };

    const productInfo = (
        <Box sx={infoBoxStyle} data-testid="aas-data">
            <DataRow
                title={t('productInfo.productDesignation')}
                value={overviewData?.manufacturerProductDesignation}
                testId="datarow-manufacturer-product-designation"
                withBase64={false}
                hasDivider={false}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <DataRow
                    title={t('productInfo.articleNumber')}
                    value={overviewData?.manufacturerArticleNumber}
                    testId="datarow-manufacturer-article-number"
                    withBase64={false}
                    sx={{ width: '100%' }}
                />
                <DataRow
                    title={t('productInfo.orderCode')}
                    value={overviewData?.manufacturerOrderCode}
                    testId="datarow-manufacturer-order-code"
                    withBase64={false}
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <DataRow
                    title={t('productInfo.manufacturer')}
                    value={overviewData?.manufacturerName}
                    testId="datarow-manufacturer-name"
                    withBase64={false}
                />
            </Box>
        </Box>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const classificationInfo = (
        <Box sx={infoBoxStyle} data-testid="asset-data">
            {!isAccordion && (
                <Box display="flex">
                    <IconCircleWrapper sx={{ mr: 1 }}>
                        <AssetIcon fontSize="small" color="primary" />
                    </IconCircleWrapper>
                    <Typography sx={titleStyle} variant="h3">
                        {t('classification')}
                    </Typography>
                </Box>
            )}
            <DataRow
                title="Manufacturer Product Root"
                value={overviewData?.manufacturerProductRoot}
                testId="datarow-manufacturer-product-root"
                withBase64={false}
            />
            <DataRow
                title="Manufacturer Product Family"
                value={overviewData?.manufacturerProductFamily}
                testId="datarow-manufacturer-product-family"
                withBase64={false}
            />
            <DataRow
                title="Manufacturer Product Type"
                value={overviewData?.manufacturerProductType}
                testId="datarow-manufacturer-product-type"
                withBase64={false}
            />
        </Box>
    );

    const markings = (
        <Box sx={infoBoxStyle} data-testid="markings-data">
            {overviewData?.markings && nameplateSubmodel?.id && (
                <MarkingsComponent
                    submodelElement={overviewData?.markings}
                    submodelId={nameplateSubmodel?.id}
                    columnDisplay
                    hasDivider={false}
                ></MarkingsComponent>
            )}
        </Box>
    );

    return (
        <Card>
            <CardContent sx={cardContentStyle}>
                {props.isLoading ? (
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
                                    <Box>
                                        <Skeleton width="90%" />
                                        <Skeleton width="50%" />
                                        <Skeleton width="75%" sx={{ mt: 2 }} />
                                        <Skeleton width="50%" />
                                    </Box>
                                    <Box>
                                        <Skeleton width="90%" />
                                        <Skeleton width="50%" />
                                        <Skeleton width="75%" sx={{ mt: 2 }} />
                                        <Skeleton width="50%" />
                                    </Box>
                                </>
                            )}
                        </Box>
                    </>
                ) : (
                    <>
                        <ImageWithFallback
                            src={productImageUrl}
                            alt={'Thumbnail'}
                            onClickHandler={props.imageLinksToDetail ? navigateToAas : undefined}
                            size={300}
                        />
                        {isAccordion ? (
                            <MobileAccordion content={productInfo} title={props.displayName || t('title')} />
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        width: 'calc(100% - 340px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                wordBreak: 'break-word',
                                                wordWrap: 'break-word',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                maxWidth: 'calc(100% - 48px)',
                                            }}
                                        >
                                            {props.displayName || t('title')}
                                        </Typography>
                                        <ActionMenu
                                            aas={props.aas}
                                            submodels={props.submodels}
                                            repositoryURL={props.repositoryURL}
                                            className="product-action-menu"
                                        />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
                                        {productInfo}
                                        {markings}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </CardContent>
            {overviewData?.productClassifications && overviewData.productClassifications.length > 0 && (
                <ProductClassificationInfoBox productClassifications={overviewData.productClassifications} />
            )}
        </Card>
    );
}
