import { InfoOutlined, OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Link, Typography } from '@mui/material';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { useState } from 'react';
import { findAllSubmodelElementsBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import { DocumentDetailsDialog } from './DocumentDetailsDialog';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { checkFileExists } from 'lib/services/search-actions/searchActions';
import { useTranslations } from 'next-intl';
import { DocumentClassification } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentClassification';
import { useFileViewObject } from 'app/[locale]/viewer/_components/submodel-elements/document-component/useDocumentVersionData';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { PreviewImage } from 'app/[locale]/viewer/_components/submodel-elements/document-component/PreviewImage';

type DocumentComponentProps = {
    readonly submodelElement: SubmodelElementCollection;
    readonly hasDivider: boolean;
    readonly submodelId: string;
};

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
                                    <PreviewImage
                                        previewImgUrl={fileViewObject.previewImgUrl}
                                        mimeType={fileViewObject.mimeType}
                                        imageError={imageError}
                                        handleImageError={handleImageError}
                                    />
                                </Link>
                            ) : (
                                <PreviewImage
                                    previewImgUrl={fileViewObject.previewImgUrl}
                                    mimeType={fileViewObject.mimeType}
                                    imageError={imageError}
                                    handleImageError={handleImageError}
                                />
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
