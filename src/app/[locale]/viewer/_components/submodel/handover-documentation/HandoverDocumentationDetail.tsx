import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Submodel, SubmodelElementList, SubmodelElementCollection, SubmodelElementChoice } from 'lib/api/aas/models';
import { DocumentComponent } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentComponent';
import { AddDocumentDialog } from 'app/[locale]/viewer/_components/submodel-elements/document-component/AddDocumentDialog';
import { useAddDocument } from 'app/[locale]/viewer/_components/submodel-elements/document-component/useAddDocument';
import { findSubmodelElementBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useSession } from 'next-auth/react';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { useSubmodelRepositoryUrl } from 'app/[locale]/viewer/_components/submodel/SubmodelRepositoryUrlProvider';

export function HandoverDocumentationDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.documentComponent');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const currentAASContext = useCurrentAasContext();
    const { data: session } = useSession();
    const repositoryUrl = useSubmodelRepositoryUrl();

    const submodelId = submodel.id || '';

    const { newDocument, isAdding, addError, updateField, addDocument, resetForm } = useAddDocument(
        submodel,
        submodelId,
        {
            url: repositoryUrl,
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

    // Find the Documents list (V2.0) or Document elements directly (V1.2)
    const documentsElement = findSubmodelElementBySemanticIdsOrIdShort(submodel.submodelElements || [], 'Documents', [
        DocumentSpecificSemanticIdIrdiV2.Documents,
    ]) as SubmodelElementList;

    let documents: SubmodelElementChoice[] = [];
    const documentsListIdShort = documentsElement?.idShort || null; // Store the idShort for V2.0

    if (documentsElement) {
        // V2.0: Documents is a SubmodelElementList
        documents = documentsElement.value || [];
    } else {
        // V1.2: Document elements are directly in submodelElements
        // Check by idShort 'Document' or semantic ID
        documents = (submodel.submodelElements || []).filter((element) => {
            // Check by idShort first
            if (element.idShort === 'Document' || element.idShort?.startsWith('Document')) {
                return true;
            }
            // Check by semantic ID - V1.2 uses different format
            const semanticId = element.semanticId?.keys?.[0]?.value;
            // V1.2 semantic ID: 0173-1#02-ABI500#001/0173-1#01-AHF579#001 or with suffix like *01
            if (semanticId) {
                return (
                    semanticId.includes('0173-1#02-ABI500#001') ||
                    semanticId === DocumentSpecificSemanticIdIrdi.Document ||
                    semanticId.startsWith(DocumentSpecificSemanticIdIrdi.Document)
                );
            }
            return false;
        });
    }

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
                    submodelId={submodelId}
                    repositoryUrl={repositoryUrl}
                    hasDivider={index < documents.length - 1}
                    onRefresh={() => setRefreshKey((prev) => prev + 1)}
                    documentsListIdShort={documentsListIdShort}
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
