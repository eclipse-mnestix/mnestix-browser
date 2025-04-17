import {
    Box,
    Card,
    CardContent,
    Skeleton,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataRow } from 'components/basics/DataRow';
import { AssetAdministrationShell, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { ShellIcon } from 'components/custom-icons/ShellIcon';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useRouter } from 'next/navigation';
import { SubmodelOrIdReference, useAasState } from 'components/contexts/CurrentAasContext';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { useLocale, useTranslations } from 'next-intl';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import {
    findSubmodelByIdOrSemanticId,
    findSubmodelElementByIdShort,
    findValueByIdShort,
} from 'lib/util/SubmodelResolverUtil';
import { MobileAccordion } from 'components/basics/detailViewBasics/MobileAccordion';
import { ProductClassificationInfoBox } from './ProductClassificationInfoBox';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { useProductImageUrl } from 'lib/hooks/UseProductImageUrl';
import { MarkingsComponent } from 'app/[locale]/viewer/_components/submodel-elements/marking-components/MarkingsComponent';

type ProductOverviewCardProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly submodels: SubmodelOrIdReference[] | null;
    readonly productImage?: string;
    readonly isLoading?: boolean;
    readonly isAccordion: boolean;
    readonly imageLinksToDetail?: boolean;
    readonly repositoryURL: string | null;
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
    readonly markings?: SubmodelElementCollection;
    readonly productClassifications?: ProductClassification[];
};

export function ProductOverviewCard(props: ProductOverviewCardProps) {
    const isAccordion = props.isAccordion;
    const navigate = useRouter();
    const [, setAasState] = useAasState();
    const t = useTranslations('pages.productViewer');
    const [overviewData, setOverviewData] = useState<OverviewData>();
    const locale = useLocale();
    const productImageUrl = useProductImageUrl(props.aas, props.repositoryURL);

    // TODO: once we know how to display this data, split it into its own components
    useEffect(() => {
        if (props.submodels && props.submodels.length > 0) {
            const technicalDataSubmodelElements = findSubmodelByIdOrSemanticId(
                props.submodels,
                SubmodelSemanticIdEnum.TechnicalData,
                'TechnicalData',
            )?.submodelElements;
            const nameplateSubmodelElements = findSubmodelByIdOrSemanticId(
                props.submodels,
                SubmodelSemanticIdEnum.NameplateV2,
                'Nameplate',
            )?.submodelElements;

            if (technicalDataSubmodelElements) {
                const manufacturerName = findValueByIdShort(
                    technicalDataSubmodelElements,
                    'ManufacturerName',
                    SubmodelElementSemanticIdEnum.ManufacturerName,
                    locale,
                );
                const manufacturerProductDesignation = findValueByIdShort(
                    technicalDataSubmodelElements,
                    'ManufacturerProductDesignation',
                    SubmodelElementSemanticIdEnum.ManufacturerProductDesignation,
                    locale,
                );
                const manufacturerArticleNumber = findValueByIdShort(
                    technicalDataSubmodelElements,
                    'ManufacturerArticleNumber',
                    SubmodelElementSemanticIdEnum.ManufacturerArticleNumber,
                    locale,
                );

                const manufacturerOrderCode = findValueByIdShort(
                    technicalDataSubmodelElements,
                    'ManufacturerOrderCode',
                    SubmodelElementSemanticIdEnum.ManufacturerOrderCode,
                    locale,
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
                                findValueByIdShort(
                                    submodelClassification.value,
                                    'ProductClassificationSystem',
                                    SubmodelElementSemanticIdEnum.ProductClassificationSystem,
                                    locale,
                                ) || undefined,
                            ProductClassId:
                                findValueByIdShort(
                                    submodelClassification.value,
                                    'ProductClassId',
                                    SubmodelElementSemanticIdEnum.ProductClassId,
                                    locale,
                                ) || undefined,
                        };
                        classifications.push(classification);
                    }
                });
                setOverviewData({
                    manufacturerName: manufacturerName ?? '-',
                    manufacturerProductDesignation: manufacturerProductDesignation ?? '-',
                    productClassifications: classifications,
                    manufacturerArticleNumber: manufacturerArticleNumber ?? '-',
                    manufacturerOrderCode: manufacturerOrderCode ?? '-',
                });
            }
            if (nameplateSubmodelElements) {
                const manufacturerProductRoot = findValueByIdShort(
                    nameplateSubmodelElements,
                    'ManufacturerProductRoot',
                    SubmodelElementSemanticIdEnum.ManufacturerProductRoot,
                    locale,
                );
                const manufacturerProductFamily = findValueByIdShort(
                    nameplateSubmodelElements,
                    'ManufacturerProductFamily',
                    SubmodelElementSemanticIdEnum.ManufacturerProductFamily,
                    locale,
                );
                const manufacturerProductType = findValueByIdShort(
                    nameplateSubmodelElements,
                    'ManufacturerProductType',
                    SubmodelElementSemanticIdEnum.ManufacturerProductType,
                    locale,
                );
                const markings = findSubmodelElementByIdShort(
                    nameplateSubmodelElements,
                    'Markings',
                    SubmodelElementSemanticIdEnum.MarkingsV3,
                );
                setOverviewData((prevData) => ({
                    ...prevData,
                    manufacturerProductRoot: manufacturerProductRoot ?? '-',
                    manufacturerProductFamily: manufacturerProductFamily ?? '-',
                    manufacturerProductType: manufacturerProductType ?? '-',
                    markings: markings as SubmodelElementCollection,
                }));
            }
        }
    }, [props.submodels]);

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
            setAasState(props.aas);
            const url = `/product/${encodeBase64(props.aas.id)}`;
            navigate.push(url);
        }
    };

    const productInfo = (
        <Box sx={infoBoxStyle} data-testid="aas-data">
            {!isAccordion && (
                <Box display="flex">
                    <IconCircleWrapper sx={{ mr: 1 }}>
                        <ShellIcon fontSize="small" color="primary" />
                    </IconCircleWrapper>
                    <Typography sx={titleStyle} variant="h3">
                        {t('title')}
                    </Typography>
                </Box>
            )}
            <DataRow
                title="Manufacturer Product Designation" // Translation ??
                value={overviewData?.manufacturerProductDesignation}
                testId="datarow-manufacturer-product-designation"
                withBase64={false}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <DataRow
                    title="Article number" // Translation ??
                    value={overviewData?.manufacturerArticleNumber}
                    testId="datarow-manufacturer-article-number"
                    withBase64={false}
                />
                <DataRow
                    title="Order Code" // Translation ??
                    value={overviewData?.manufacturerOrderCode}
                    testId="datarow-manufacturer-order-code"
                    withBase64={false}
                />
            </Box>
            <DataRow
                title="Manufacturer Name" // Translation ??
                value={overviewData?.manufacturerName}
                testId="datarow-manufacturer-name"
                withBase64={false}
            />

        </Box>
    );

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

    // TODO translations
    const markings = (
        <Box sx={infoBoxStyle} data-testid="markings-data">
            {!isAccordion && (
                <Box display="flex">
                    <IconCircleWrapper sx={{ mr: 1 }}>
                        <AssetIcon fontSize="small" color="primary" />
                    </IconCircleWrapper>
                    <Typography sx={titleStyle} variant="h3">
                        Produktkennzeichnungen
                    </Typography>
                </Box>
            )}
            <MarkingsComponent submodelElement={overviewData?.markings}></MarkingsComponent>
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
                                    content={productInfo}
                                    title={t('title')}
                                    icon={<ShellIcon fontSize="small" color="primary" />}
                                />
                                <MobileAccordion
                                    content={classificationInfo}
                                    title={t('classification')}
                                    icon={<ShellIcon fontSize="small" color="primary" />}
                                />
                            </>
                        ) : (
                            <>
                                {productInfo} {markings}
                                {//classificationInfo
                                }
                            </>
                        )}
                    </>
                )}
            </CardContent>
            {overviewData?.productClassifications && overviewData.productClassifications.length > 0 && (
                <ProductClassificationInfoBox
                    productClassifications={overviewData.productClassifications}
                />
            )}
        </Card>
    );
}
