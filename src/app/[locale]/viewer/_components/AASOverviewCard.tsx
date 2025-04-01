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
import React, { useState } from 'react';
import { DataRow } from 'components/basics/DataRow';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FormattedMessage, useIntl } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { AssetAdministrationShell, SpecificAssetId } from '@aas-core-works/aas-core3.0-typescript/types';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { ShellIcon } from 'components/custom-icons/ShellIcon';
import { isValidUrl } from 'lib/util/UrlUtil';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useRouter } from 'next/navigation';
import { useAasState } from 'components/contexts/CurrentAasContext';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { getThumbnailFromShell } from 'lib/services/repository-access/repositorySearchActions';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

type AASOverviewCardProps = {
    readonly aas: AssetAdministrationShell | null;
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

export function AASOverviewCard(props: AASOverviewCardProps) {
    const intl = useIntl();
    const isAccordion = props.isAccordion;
    const specificAssetIds = props.aas?.assetInformation?.specificAssetIds as SpecificAssetId[];
    const navigate = useRouter();
    const [productImageUrl, setProductImageUrl] = useState<string>('');
    const [, setAasState] = useAasState();

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
                        <FormattedMessage {...messages.mnestix.assetAdministrationShell} />
                    </Typography>
                </Box>
            )}
            <DataRow 
                title="id" 
                value={props.aas?.id}
                testId='datarow-aas-id'
                withBase64={true}
            />
            <DataRow 
                title="idShort" 
                value={props.aas?.idShort ?? '-'} 
            />
            <DataRow 
                title="repositoryURL" 
                value={props.repositoryURL ?? '-'} 
            />
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
                        <FormattedMessage {...messages.mnestix.asset} />
                    </Typography>
                </Box>
            )}
            <DataRow 
                title="globalAssetId" 
                value={props.aas?.assetInformation?.globalAssetId ?? '-'}
                testId='datarow-asset-id'
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
                                    title={intl.formatMessage(messages.mnestix.assetAdministrationShell)}
                                    icon={<ShellIcon fontSize="small" color="primary" />}
                                />
                                <MobileAccordion
                                    content={assetInfo}
                                    title={intl.formatMessage(messages.mnestix.asset)}
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
