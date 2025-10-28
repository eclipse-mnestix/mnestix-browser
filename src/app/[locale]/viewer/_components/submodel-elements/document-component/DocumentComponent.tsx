import { InfoOutlined, OpenInNew, Edit, Save, Cancel, CloudUpload } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, TextField } from '@mui/material';
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
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useDocumentEdit } from 'app/[locale]/viewer/_components/submodel-elements/document-component/useDocumentEdit';
import { useDocumentFileUpload } from 'app/[locale]/viewer/_components/submodel-elements/document-component/useDocumentFileUpload';

export type DocumentComponentProps = CustomSubmodelElementComponentProps & {
    onRefresh?: () => void;
    documentsListIdShort?: string | null;
};

export function DocumentComponent(props: DocumentComponentProps) {
    const t = useTranslations('components.documentComponent');
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const fileViewObject = useFileViewObject(props.submodelElement, props.submodelId);
    const [documentUrl, setDocumentUrl] = useState<string>('');
    const { data: session } = useSession();
    const currentAASContext = useCurrentAasContext();

    const {
        editedTitle,
        editedDescription,
        editedOrganization,
        titleError,
        setEditedTitle,
        setEditedDescription,
        setEditedOrganization,
        validateAndSave,
        initializeEditMode,
    } = useDocumentEdit(
        props.submodelElement,
        props.submodelId,
        {
            url: props.repositoryUrl || '',
            infrastructureName: currentAASContext.infrastructureName || '',
        },
        props.documentsListIdShort,
        () => {
            setIsEditMode(false);
            // Trigger full submodel refresh
            props.onRefresh?.();
        },
    );

    const { selectedFile, isUploading, uploadError, handleFileSelect, uploadFile, clearSelectedFile } =
        useDocumentFileUpload(
            props.submodelElement,
            props.submodelId,
            {
                url: props.repositoryUrl || '',
                infrastructureName: currentAASContext.infrastructureName || '',
            },
            () => {
                // Refresh document URL after successful upload
                if (fileViewObject?.digitalFileUrl) {
                    getFileUrl(fileViewObject.digitalFileUrl, session?.accessToken, {
                        url: props.repositoryUrl || '',
                        infrastructureName: currentAASContext.infrastructureName || '',
                    }).then((url) => url && setDocumentUrl(url));
                }
            },
        );

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
        const result = findAllSubmodelElementsBySemanticIdsOrIdShort(
            props.submodelElement.value,
            'DocumentClassification',
            [DocumentSpecificSemanticId.DocumentClassification, DocumentSpecificSemanticIdIrdi.DocumentClassification],
        ) as SubmodelElementCollection[];

        return result || [];
    }

    const handleEditClick = () => {
        initializeEditMode();
        setIsEditMode(true);
    };

    const handleSave = async () => {
        const success = await validateAndSave();
        if (!success) {
            // Keep edit mode open if save failed
            return;
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <DataRow hasDivider={props.hasDivider}>
            {fileViewObject && (
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={{ xs: 1, sm: 6 }}
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        sx={{ mb: 1, flexGrow: 1 }}
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
                            <Box sx={{ flexGrow: 1 }}>
                                {isEditMode ? (
                                    <>
                                        <TextField
                                            fullWidth
                                            label={t('titleLabel')}
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            error={!!titleError}
                                            helperText={titleError}
                                            required
                                            size="small"
                                            sx={{ mb: 1 }}
                                            data-testid="document-title-edit"
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('descriptionLabel')}
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            multiline
                                            rows={2}
                                            size="small"
                                            sx={{ mb: 1 }}
                                            data-testid="document-description-edit"
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('organizationLabel')}
                                            value={editedOrganization}
                                            onChange={(e) => setEditedOrganization(e.target.value)}
                                            size="small"
                                            sx={{ mb: 1 }}
                                            data-testid="document-organization-edit"
                                        />
                                        <Box display="flex" flexDirection="column" gap={1} sx={{ mb: 1 }}>
                                            <input
                                                accept="*/*"
                                                style={{ display: 'none' }}
                                                id="file-upload-input"
                                                type="file"
                                                onChange={handleFileSelect}
                                                data-testid="document-file-input"
                                            />
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <label htmlFor="file-upload-input">
                                                    <Button
                                                        variant="outlined"
                                                        component="span"
                                                        startIcon={<CloudUpload />}
                                                        size="small"
                                                        disabled={isUploading}
                                                        data-testid="document-choose-file-button"
                                                    >
                                                        {t('chooseFile')}
                                                    </Button>
                                                </label>
                                                {selectedFile && (
                                                    <>
                                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                            {selectedFile.name}
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            onClick={uploadFile}
                                                            disabled={isUploading}
                                                            size="small"
                                                            data-testid="document-upload-button"
                                                        >
                                                            {isUploading ? t('uploading') : t('uploadFile')}
                                                        </Button>
                                                        <IconButton
                                                            onClick={clearSelectedFile}
                                                            disabled={isUploading}
                                                            size="small"
                                                            data-testid="document-clear-file-button"
                                                        >
                                                            <Cancel />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </Box>
                                            {uploadError && (
                                                <Typography variant="body2" color="error">
                                                    {uploadError}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box display="flex" gap={1}>
                                            <Button
                                                variant="contained"
                                                startIcon={<Save />}
                                                onClick={handleSave}
                                                size="small"
                                                data-testid="document-save-button"
                                            >
                                                {t('save')}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Cancel />}
                                                onClick={handleCancel}
                                                size="small"
                                                data-testid="document-cancel-button"
                                            >
                                                {t('cancel')}
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </Box>
                        </Box>
                        <DocumentClassification
                            classificationData={getDocumentClassificationCollection()}
                            openDetailDialog={() => setDetailsModalOpen(true)}
                        />
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {!isEditMode && (
                            <IconButton onClick={handleEditClick} data-testid="document-edit-button">
                                <Edit />
                            </IconButton>
                        )}
                        <IconButton onClick={handleDetailsClick} data-testid="document-info-button">
                            <InfoOutlined />
                        </IconButton>
                    </Box>
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
