import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Submodel, SubmodelElementList, SubmodelElementCollection } from 'lib/api/aas/models';
import { DocumentComponent } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentComponent';
import { AddDocumentDialog } from 'app/[locale]/viewer/_components/submodel-elements/document-component/AddDocumentDialog';
import { useAddDocument } from 'app/[locale]/viewer/_components/submodel-elements/document-component/useAddDocument';
import { findSubmodelElementBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import { DocumentSpecificSemanticIdIrdiV2 } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useSession } from 'next-auth/react';

type HandoverDocumentationDetailProps = {
    submodel: Submodel;
    submodelId: string;
    repositoryUrl?: string;
};

export function HandoverDocumentationDetail(props: HandoverDocumentationDetailProps) {
    const t = useTranslations('components.documentComponent');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const currentAASContext = useCurrentAasContext();
    const { data: session } = useSession();

    const { newDocument, isAdding, addError, updateField, addDocument, resetForm } = useAddDocument(
        props.submodel,
        props.submodelId,
        {
            url: props.repositoryUrl || '',
            infrastructureName: currentAASContext.infrastructureName || '',
        },
        () => {
            setRefreshKey((prev) => prev + 1);
            resetForm();
        },
    );

    const handleOpenAddDialog = () => {
        resetForm();
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        if (!isAdding) {
            setIsAddDialogOpen(false);
            resetForm();
        }
    };

    // Find the Documents list
    const documentsElement = findSubmodelElementBySemanticIdsOrIdShort(
        props.submodel.submodelElements || [],
        'Documents',
        [DocumentSpecificSemanticIdIrdiV2.Documents],
    ) as SubmodelElementList;

    const documents = documentsElement?.value || [];

    return (
        <Box key={refreshKey}>
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenAddDialog}
                    data-testid="handover-add-document-button"
                >
                    {t('addDocument')}
                </Button>
            </Box>

            {documents.map((document, index) => (
                <DocumentComponent
                    key={`${document.idShort}-${index}`}
                    submodelElement={document as SubmodelElementCollection}
                    submodelId={props.submodelId}
                    repositoryUrl={props.repositoryUrl}
                    hasDivider={index < documents.length - 1}
                />
            ))}

            <AddDocumentDialog
                open={isAddDialogOpen}
                onClose={handleCloseAddDialog}
                newDocument={newDocument}
                isAdding={isAdding}
                addError={addError}
                onUpdateField={updateField}
                onAddDocument={addDocument}
            />
        </Box>
    );
}
