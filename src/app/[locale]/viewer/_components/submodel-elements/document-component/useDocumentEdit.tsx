import { useState } from 'react';
import { useLocale } from 'next-intl';
import { SubmodelElementCollection, MultiLanguageProperty, Property } from 'lib/api/aas/models';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationText } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
} from './DocumentSemanticIds';
import { JsonPatchOperation } from 'lib/api/basyx-v3/apiInterface';
import { patchSubmodelByJsonPatch } from 'lib/services/submodel-repository-service/submodelRepositoryActions';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

/**
 * Hook for handling document editing functionality
 * @param submodelElement The document submodel element collection
 * @param submodelId The submodel ID
 * @param repository Repository information
 * @param onSaveSuccess Callback function called after successful save
 */
export function useDocumentEdit(
    submodelElement: SubmodelElementCollection,
    submodelId: string,
    repository: RepositoryWithInfrastructure,
    onSaveSuccess?: () => void,
) {
    const locale = useLocale();
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedOrganization, setEditedOrganization] = useState('');
    const [titleError, setTitleError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Initialize edit mode with current values
     */
    function initializeEditMode() {
        if (!submodelElement?.value) return;

        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;

        if (!documentVersion?.value) return;

        // Extract current title
        const titleElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticId.Title,
            DocumentSpecificSemanticIdIrdi.Title,
            DocumentSpecificSemanticIdIrdiV2.Title,
        ]);
        const title = titleElement ? getTranslationText(titleElement as MultiLanguageProperty, locale) : '';
        setEditedTitle(title);

        // Extract current description
        const descriptionElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticIdIrdiV2.Description,
        ]);
        const description = descriptionElement
            ? getTranslationText(descriptionElement as MultiLanguageProperty, locale)
            : '';
        setEditedDescription(description);

        // Extract current organization
        const organizationElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticId.OrganizationName,
            DocumentSpecificSemanticIdIrdi.OrganizationName,
            DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
        ]);
        const organization = organizationElement ? (organizationElement as Property).value || '' : '';
        setEditedOrganization(organization);

        setTitleError('');
    }

    /**
     * Validate input fields
     */
    function validate(): boolean {
        let isValid = true;

        // Title is required according to IDTA-02004-2-0
        if (!editedTitle || editedTitle.trim() === '') {
            setTitleError('Title is required');
            isValid = false;
        } else {
            setTitleError('');
        }

        return isValid;
    }

    /**
     * Build JSON Patch operations for the edits
     */
    function buildPatchOperations(): JsonPatchOperation[] {
        const operations: JsonPatchOperation[] = [];

        if (!submodelElement?.value) return operations;

        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;

        if (!documentVersion?.value || !documentVersion?.idShort || !submodelElement?.idShort) return operations;

        const basePath = `/submodelElements/${submodelElement.idShort}/value/${documentVersion.idShort}/value`;

        // Update Title (MultiLanguageProperty)
        const titleElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticId.Title,
            DocumentSpecificSemanticIdIrdi.Title,
            DocumentSpecificSemanticIdIrdiV2.Title,
        ]);
        if (titleElement?.idShort) {
            const titleIndex = documentVersion.value.findIndex((el) => el.idShort === titleElement.idShort);
            if (titleIndex !== -1) {
                operations.push({
                    op: 'replace',
                    path: `${basePath}/${titleIndex}/value`,
                    value: [
                        {
                            language: locale,
                            text: editedTitle,
                        },
                    ],
                });
            }
        }

        // Update Description (MultiLanguageProperty)
        const descriptionElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticIdIrdiV2.Description,
        ]);
        if (descriptionElement?.idShort && editedDescription) {
            const descIndex = documentVersion.value.findIndex((el) => el.idShort === descriptionElement.idShort);
            if (descIndex !== -1) {
                operations.push({
                    op: 'replace',
                    path: `${basePath}/${descIndex}/value`,
                    value: [
                        {
                            language: locale,
                            text: editedDescription,
                        },
                    ],
                });
            }
        }

        // Update Organization (Property)
        const organizationElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticId.OrganizationName,
            DocumentSpecificSemanticIdIrdi.OrganizationName,
            DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
        ]);
        if (organizationElement?.idShort && editedOrganization) {
            const orgIndex = documentVersion.value.findIndex((el) => el.idShort === organizationElement.idShort);
            if (orgIndex !== -1) {
                operations.push({
                    op: 'replace',
                    path: `${basePath}/${orgIndex}/value`,
                    value: editedOrganization,
                });
            }
        }

        return operations;
    }

    /**
     * Validate and save the edits
     */
    async function validateAndSave(): Promise<boolean> {
        if (!validate()) {
            return false;
        }

        setIsSaving(true);

        try {
            const patchOperations = buildPatchOperations();

            if (patchOperations.length === 0) {
                console.warn('No patch operations generated');
                setIsSaving(false);
                return false;
            }

            const result = await patchSubmodelByJsonPatch(submodelId, patchOperations, repository);

            if (result.isSuccess) {
                onSaveSuccess?.();
                return true;
            } else {
                console.error('Failed to save document edits:', result.message);
                setTitleError(result.message || 'Failed to save changes');
                return false;
            }
        } catch (error) {
            console.error('Error saving document edits:', error);
            setTitleError('An error occurred while saving');
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    /**
     * Cancel edit mode
     */
    function cancelEdit() {
        setEditedTitle('');
        setEditedDescription('');
        setEditedOrganization('');
        setTitleError('');
    }

    return {
        editedTitle,
        editedDescription,
        editedOrganization,
        titleError,
        isSaving,
        setEditedTitle,
        setEditedDescription,
        setEditedOrganization,
        validateAndSave,
        cancelEdit,
        initializeEditMode,
    };
}
