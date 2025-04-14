import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Skeleton,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataRow } from 'components/basics/DataRow';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AssetAdministrationShell, Property, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { ShellIcon } from 'components/custom-icons/ShellIcon';
import { isValidUrl } from 'lib/util/UrlUtil';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useRouter } from 'next/navigation';
import { SubmodelOrIdReference, useAasState } from 'components/contexts/CurrentAasContext';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { getThumbnailFromShell } from 'lib/services/repository-access/repositorySearchActions';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useTranslations } from 'next-intl';

type ProductOverviewCardProps = {
    readonly aas: AssetAdministrationShell | null;
    readonly submodels: SubmodelOrIdReference[] | null;
    readonly productImage?: string;
    readonly isLoading?: boolean;
    readonly isAccordion: boolean;
    readonly imageLinksToDetail?: boolean;
    readonly repositoryURL: string | null;
};

type MobileAccordionProps = {
    readonly content: React.ReactNode;
    readonly title: string;
    readonly icon: React.ReactNode;
};

type TechnicalData = {
    readonly manufacturerName: string;
    //Hier noch mehr Properties hinzufügen
}

function MobileAccordion(props: MobileAccordionProps) {
    return (
        <Accordion disableGutters elevation={0} style={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ArrowDropDownIcon sx={{ color: 'grey.600' }} />}>
                <Box display="flex" alignItems="center" data-testid="mobile-accordion-header">
                    <IconCircleWrapper sx={{ mr: 1 }}>{props.icon}</IconCircleWrapper>
                    <Typography>{props.title}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails data-testid="mobile-accordion-content">{props.content}</AccordionDetails>
        </Accordion>
    );
}

export function ProductOverviewCard(props: ProductOverviewCardProps) {
    const isAccordion = props.isAccordion;
    const navigate = useRouter();
    const [productImageUrl, setProductImageUrl] = useState<string>('');
    const [, setAasState] = useAasState();
    const t = useTranslations('pages.productViewer');
    const [technicalData, setTechnicalData] = useState<TechnicalData>();

    async function createAndSetUrlForImageFile() {
        if (!props.aas) return;

        if (!props.repositoryURL) {
            setProductImageUrl('');
            return;
        }

        const response = await getThumbnailFromShell(props.aas.id, props.repositoryURL);
        if (!response.isSuccess) {
            console.error('Image not found');
            return;
        }
        const blob = mapFileDtoToBlob(response.result);
        setProductImageUrl(URL.createObjectURL(blob));
    }

    useAsyncEffect(async () => {
        if (!props.productImage) return;

        if (!isValidUrl(props.productImage!)) {
            await createAndSetUrlForImageFile();
        } else {
            setProductImageUrl(props.productImage);
        }
    }, [props.productImage]);

    //Nur ein API call statt zweimal mit $value
    useEffect(() => {
        if (props.submodels && props.submodels.length > 0) {
            const sm = props.submodels.find((sm) => sm.submodel?.idShort === 'TechnicalData'); //IDShort or semanticId ??
            if (sm?.submodel?.submodelElements) {
                const generalInformation = sm.submodel.submodelElements.find((element) => element.idShort === 'GeneralInformation') as SubmodelElementCollection;
                const manufacturerName = generalInformation?.value?.find((element) => element.idShort === 'ManufacturerLogo') as Property; //Logo grad nur zum testen hier drin, da Stift keinen Name hat
                //Hier noch mehr Properties hinzufügen
                setTechnicalData({ manufacturerName: manufacturerName?.value ?? '-' });
            }
            else {
                //Error message for no Technical Data Submodel found
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

    const aasInfo = (
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
                title="Manufacturer Name" // Translation ??
                value={technicalData?.manufacturerName}
                testId='datarow-aas-id'
                withBase64={false}
            />
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
                                    title={t('title')}
                                    icon={<ShellIcon fontSize="small" color="primary" />}
                                />
                            </>
                        ) : (
                            <>
                                {aasInfo}
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
