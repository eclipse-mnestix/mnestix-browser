import { InfoOutlined, OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { SubmodelElementCollection, SubmodelElementList } from 'lib/api/aas/models';
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
    DocumentSpecificSemanticIdIrdiV3,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { PreviewImage } from 'app/[locale]/viewer/_components/submodel-elements/document-component/PreviewImage';
import { useSession } from 'next-auth/react';
import { CustomSubmodelElementComponentProps } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import Link from 'next/link';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getFileUrl } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentUtils';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

interface DocumentComponentProps extends CustomSubmodelElementComponentProps {
    readonly documentIndex?: number;
    readonly parentListIdShort?: string;
}

export function DocumentComponent(props: DocumentComponentProps) {
    const t = useTranslations('components.documentComponent');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const fileViewObject = useFileViewObject(props.submodelElement, props.submodelId, props.documentIndex, props.parentListIdShort);
    const [documentUrl, setDocumentUrl] = useState<string>('');
    const { data: session } = useSession();
    const currentAASContext = useCurrentAasContext();

    useAsyncEffect(async () => {
        if (!fileViewObject?.digitalFileUrl) {
            return;
        }
        const url = await getFileUrl(fileViewObject?.digitalFileUrl, session?.accessToken, {
            url: fileViewObject?.digitalFileUrl,
            infrastructureName: currentAASContext.infrastructureName || '',
        });
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
        // V3: DocumentClassifications is a SubmodelElementList containing classification collections
        const classificationsList = findAllSubmodelElementsBySemanticIdsOrIdShort(
            props.submodelElement.value,
            'DocumentClassifications',
            [DocumentSpecificSemanticIdIrdiV3.DocumentClassificationsList],
        );
        if (classificationsList && classificationsList.length > 0) {
            const list = classificationsList[0] as SubmodelElementList;
            return (list.value ?? []) as SubmodelElementCollection[];
        }

        // V1/V2: DocumentClassification collections directly in the document
        const result = findAllSubmodelElementsBySemanticIdsOrIdShort(
            props.submodelElement.value,
            'DocumentClassification',
            [DocumentSpecificSemanticId.DocumentClassification, DocumentSpecificSemanticIdIrdi.DocumentClassification],
        ) as SubmodelElementCollection[];

        return result || [];
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
                            {documentUrl ? (
                                <Link href={documentUrl} target="_blank">
                                    <PreviewImage
                                        previewImgUrl={fileViewObject.previewImgUrl}
                                        mimeType={fileViewObject.mimeType}
                                        repositoryUrl={props.repositoryUrl}
                                    />
                                </Link>
                            ) : (
                                <PreviewImage
                                    previewImgUrl={fileViewObject.previewImgUrl}
                                    mimeType={fileViewObject.mimeType}
                                    repositoryUrl={props.repositoryUrl}
                                />
                            )}
                            <Box>
                                <Typography data-testid="document-title" variant="h5">
                                    {fileViewObject.title}
                                </Typography>
                                {fileViewObject.organizationName && (
                                    <Typography variant="body2" data-testid="document-organization">
                                        {fileViewObject.organizationName}
                                    </Typography>
                                )}
                                {documentUrl ? (
                                    <Button
                                        variant="outlined"
                                        startIcon={<OpenInNew />}
                                        sx={{ mt: 1 }}
                                        href={documentUrl}
                                        target="_blank"
                                        data-testid="document-open-button"
                                        component="a"
                                        rel="noopener noreferrer"
                                    >
                                        {t('open')}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        startIcon={<OpenInNew />}
                                        sx={{ mt: 1 }}
                                        data-testid="document-open-button"
                                        disabled
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
