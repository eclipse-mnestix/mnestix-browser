import { InfoOutlined, OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Link, Typography } from '@mui/material';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { useState } from 'react';
import { findAllSubmodelElementsBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import { DocumentDetailsDialog } from './DocumentDetailsDialog';
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
    const tComponents = useTranslations('components');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const fileViewObject = useFileViewObject(props.submodelElement, props.submodelId);

    const handleDetailsClick = () => {
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    function getDocumentClassificationCollection() {
        return (findAllSubmodelElementsBySemanticIdsOrIdShort(props.submodelElement.value, 'DocumentClassification', [
            DocumentSpecificSemanticId.DocumentClassification,
            DocumentSpecificSemanticIdIrdi.DocumentClassification,
        ]) as SubmodelElementCollection[]) ?? [];
    }

    const hasDigitalFileUrl = !!fileViewObject?.digitalFileUrl?.trim();
    const documentTitle = fileViewObject?.title?.trim()
        ? fileViewObject.title
        : tComponents('propertyComponent.labels.notAvailable');

    return (
        <DataRow hasDivider={props.hasDivider}>
            {fileViewObject && (
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={{ xs: 1, sm: 6 }}
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        sx={{ mb: 1 }}
                    >
                        <Box display="flex" gap={1} flexDirection="row" sx={{ mb: 1 }}>
                            {hasDigitalFileUrl ? (
                                <Link href={fileViewObject.digitalFileUrl} target="_blank">
                                    <PreviewImage
                                        previewImgUrl={fileViewObject.previewImgUrl}
                                        mimeType={fileViewObject.mimeType}
                                    />
                                </Link>
                            ) : (
                                <PreviewImage
                                    previewImgUrl={fileViewObject.previewImgUrl}
                                    mimeType={fileViewObject.mimeType}
                                />
                            )}
                            <Box>
                                <Typography data-testid="document-title" variant="h5">
                                    {documentTitle}
                                </Typography>
                                {fileViewObject.organizationName && (
                                    <Typography variant="body2" data-testid="document-organization">
                                        {fileViewObject.organizationName}
                                    </Typography>
                                )}
                                {hasDigitalFileUrl ? (
                                    <Button
                                        variant="outlined"
                                        startIcon={<OpenInNew />}
                                        sx={{ mt: 1 }}
                                        href={fileViewObject.digitalFileUrl}
                                        target="_blank"
                                        data-testid="document-open-button"
                                    >
                                        {t('open')}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        startIcon={<OpenInNew />}
                                        sx={{ mt: 1 }}
                                        disabled={true}
                                        title={t('fileNotFound')}
                                        data-testid="document-open-button"
                                    >
                                        {t('open')}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        <DocumentClassification
                            classificationData={getDocumentClassificationCollection()}
                            openDetailDialog={() => setDetailsModalOpen(true)}
                        />
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
