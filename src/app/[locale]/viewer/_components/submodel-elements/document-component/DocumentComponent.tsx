import { InfoOutlined, OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { SubmodelElementCollection } from 'lib/api/aas/models';
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
import { useSession } from 'next-auth/react';
import { CustomSubmodelElementComponentProps } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import Link from 'next/link';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getFileUrl } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentUtils';

export function DocumentComponent(props: CustomSubmodelElementComponentProps) {
    const t = useTranslations('components.documentComponent');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const fileViewObject = useFileViewObject(props.submodelElement, props.submodelId);
    const [documentUrl, setDocumentUrl] = useState<string>('');
    const { data: session } = useSession();

    useAsyncEffect(async () => {
        if (!fileViewObject?.digitalFileUrl) {
            return;
        }
        const url = await getFileUrl(fileViewObject?.digitalFileUrl, session?.accessToken, props.repositoryUrl);
        if (url) {
            setDocumentUrl(url);
        }
    }, [fileViewObject?.digitalFileUrl, session?.accessToken, props.repositoryUrl]);

    const handleDetailsClick = () => {
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    function getDocumentClassificationCollection() {
        return findAllSubmodelElementsBySemanticIdsOrIdShort(props.submodelElement.value, 'DocumentClassification', [
            DocumentSpecificSemanticId.DocumentClassification,
            DocumentSpecificSemanticIdIrdi.DocumentClassification,
        ]) as SubmodelElementCollection[];
    }

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
                            <Link href={documentUrl} target="_blank">
                                <PreviewImage
                                    previewImgUrl={fileViewObject.previewImgUrl}
                                    mimeType={fileViewObject.mimeType}
                                    repositoryUrl={props.repositoryUrl}
                                />
                            </Link>
                            <Box>
                                <Typography data-testid="document-title" variant="h5">
                                    {fileViewObject.title}
                                </Typography>
                                {fileViewObject.organizationName && (
                                    <Typography variant="body2" data-testid="document-organization">
                                        {fileViewObject.organizationName}
                                    </Typography>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={<OpenInNew />}
                                    sx={{ mt: 1 }}
                                    href={documentUrl}
                                    target="_blank"
                                    data-testid="document-open-button"
                                >
                                    {t('open')}
                                </Button>
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
