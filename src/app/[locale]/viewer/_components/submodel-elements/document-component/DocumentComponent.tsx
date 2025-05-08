import { InfoOutlined, InsertDriveFileOutlined, OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Link, styled, Typography } from '@mui/material';
import {
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { PdfDocumentIcon } from 'components/custom-icons/PdfDocumentIcon';
import { useState } from 'react';
import {
    findAllSubmodelElementsBySemanticIdsOrIdShort,
} from 'lib/util/SubmodelResolverUtil';
import { DocumentDetailsDialog } from './DocumentDetailsDialog';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { checkFileExists } from 'lib/services/search-actions/searchActions';
import { useTranslations } from 'next-intl';
import { DocumentClassification } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentClassification';
import {
    useFileViewObject
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/useDocumentVersionData';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';

type DocumentComponentProps = {
    readonly submodelElement: SubmodelElementCollection;
    readonly hasDivider: boolean;
    readonly submodelId: string;
};

const StyledImageWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    boxShadow: theme.shadows['3'],
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    img: {
        objectFit: 'contain',
        width: '100%',
        height: '100%',
    },
    '.MuiSvgIcon-root': {
        fontSize: '2.5rem',
        opacity: '.5',
    },
}));

export function DocumentComponent(props: DocumentComponentProps) {
    const t = useTranslations('components.documentComponent');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [fileExists, setFileExists] = useState(true);
    const fileViewObject = useFileViewObject(props.submodelElement, props.submodelId);


    useAsyncEffect(async () => {
        if (fileViewObject?.digitalFileUrl) {
            const checkResponse = await checkFileExists(fileViewObject.digitalFileUrl);
            setFileExists(checkResponse.isSuccess && checkResponse.result);
        }
    }, [fileViewObject?.digitalFileUrl]);

    const handleDetailsClick = () => {
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const renderImage = () => (
        <StyledImageWrapper>
            {!imageError && fileViewObject?.previewImgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo can be an arbitrary url which conflicts with https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
                <img
                    src={fileViewObject.previewImgUrl}
                    height={90}
                    width={90}
                    alt="File Preview"
                    onError={handleImageError}
                    data-testid="document-preview-image"
                />
            ) : fileViewObject?.mimeType === 'application/pdf' ? (
                <PdfDocumentIcon color="primary" />
            ) : (
                <InsertDriveFileOutlined color="primary" />
            )}
        </StyledImageWrapper>
    );

    function getDocumentClassificationCollection() {
        return findAllSubmodelElementsBySemanticIdsOrIdShort(props.submodelElement.value, 'DocumentClassification', [
            DocumentSpecificSemanticId.DocumentClassification,
            DocumentSpecificSemanticIdIrdi.DocumentClassification,
        ]) as SubmodelElementCollection[];
    }

    return (
        <DataRow title={props.submodelElement?.idShort} hasDivider={props.hasDivider}>
            {fileViewObject && (
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={1}
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        sx={{ mb: 1 }}
                    >
                        <Box display="flex" gap={1} flexDirection="row" sx={{ mb: 1 }}>
                            {fileExists ? (
                                <Link href={fileViewObject.digitalFileUrl} target="_blank">
                                    {renderImage()}
                                </Link>
                            ) : (
                                renderImage()
                            )}
                            <Box>
                                <Typography data-testid="document-title">{fileViewObject.title}</Typography>
                                {fileViewObject.organizationName && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        data-testid="document-organization"
                                    >
                                        {fileViewObject.organizationName}
                                    </Typography>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={fileExists ? <OpenInNew /> : ''}
                                    sx={{ mt: 1 }}
                                    href={fileViewObject.digitalFileUrl}
                                    target="_blank"
                                    disabled={!fileExists}
                                    data-testid="document-open-button"
                                >
                                    {!fileExists ? t('fileNotFound') : t('open')}
                                </Button>
                            </Box>
                        </Box>
                        <DocumentClassification classificationData={getDocumentClassificationCollection()} />
                    </Box>
                    <IconButton onClick={() => handleDetailsClick()} sx={{ ml: 1 }} data-testid="document-info-button">
                        <InfoOutlined />
                    </IconButton>
                </Box>
            )}
            <DocumentDetailsDialog
                open={detailsModalOpen}
                handleClose={() => handleDetailsModalClose()}
                document={props.submodelElement as SubmodelElementCollection}
                data-testid="document-details-dialog"
            />
        </DataRow>
    );
}
