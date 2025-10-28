import { useState } from 'react';
import { useLocale } from 'next-intl';
import { SubmodelElementCollection, MultiLanguageProperty, Property } from 'lib/api/aas/models';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationText } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
} from './DocumentSemanticIds';
import { putSubmodelElementByPath } from 'lib/services/submodel-repository-service/submodelRepositoryActions';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

/**
 * Hook for handling document editing functionality using PUT
 * @param submodelElement The document submodel element collection
 * @param submodelId The submodel ID
 * @param repository Repository information
 * @param documentsListIdShort The idShort of the Documents list (V2.0 only, null for V1.2)
 * @param onSaveSuccess Callback function called after successful save
 */
export function useDocumentEdit(
    submodelElement: SubmodelElementCollection,
    submodelId: string,
    repository: RepositoryWithInfrastructure,
    documentsListIdShort: string | null | undefined,
    onSaveSuccess?: () => void,
) {
    const locale = useLocale();
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedOrganization, setEditedOrganization] = useState('');
    const [titleError, setTitleError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Detect if V1.2 or V2.0 based on structure
     */
    function detectVersion(): '1.2' | '2.0' {
        if (!submodelElement?.value) return '2.0';

        // V1.2: DocumentVersion is a SubmodelElementCollection (singular)
        // V2.0: DocumentVersions is a SubmodelElementList (plural)
        const documentVersions = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersions', [
            DocumentSpecificSemanticIdIrdiV2.DocumentVersions,
        ]);

        return documentVersions ? '2.0' : '1.2';
    }

    /**
     * Get the base path for API calls
     */
    function getBasePath(): string {
        const documentIdShort = submodelElement.idShort || 'Document';
        const version = detectVersion();

        if (version === '1.2') {
            // V1.2: Document.DocumentVersion
            return `${documentIdShort}.DocumentVersion`;
        } else {
            // V2.0: Documents.Document_xyz.DocumentVersions[0]
            // documentsListIdShort is passed from parent (e.g., "Documents")
            const listIdShort = documentsListIdShort || 'Documents';
            return `${listIdShort}.${documentIdShort}.DocumentVersions[0]`;
        }
    }

    /**
     * Initialize edit mode with current values
     */
    function initializeEditMode() {
        if (!submodelElement?.value) return;

        const version = detectVersion();
        let documentVersion: SubmodelElementCollection | undefined;

        if (version === '1.2') {
            // V1.2: Find DocumentVersion (Collection)
            documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
                DocumentSpecificSemanticId.DocumentVersion,
                DocumentSpecificSemanticIdIrdi.DocumentVersion,
            ]) as SubmodelElementCollection;
        } else {
            // V2.0: Find DocumentVersions (List), then get first element
            const documentVersionsList = findSubmodelElementBySemanticIdsOrIdShort(
                submodelElement.value,
                'DocumentVersions',
                [DocumentSpecificSemanticIdIrdiV2.DocumentVersions],
            ) as any;

            if (documentVersionsList?.value && Array.isArray(documentVersionsList.value)) {
                documentVersion = documentVersionsList.value[0] as SubmodelElementCollection;
            }
        }

        if (!documentVersion?.value) return;

        // Get Title
        const titleElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticId.Title,
            DocumentSpecificSemanticIdIrdi.Title,
            DocumentSpecificSemanticIdIrdiV2.Title,
        ]);
        const title = titleElement ? getTranslationText(titleElement as MultiLanguageProperty, locale) : '';
        setEditedTitle(title);

        // Get Description/Summary (V1.2 uses "Summary", V2.0 uses "Description")
        const descriptionElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
            DocumentSpecificSemanticId.Title, // Fallback
            DocumentSpecificSemanticIdIrdi.Summary, // V1.2
            DocumentSpecificSemanticIdIrdiV2.Description, // V2.0
        ]);
        const description = descriptionElement
            ? getTranslationText(descriptionElement as MultiLanguageProperty, locale)
            : '';
        setEditedDescription(description);

        // Get Organization (V1.2: OrganizationName, V2.0: OrganizationShortName)
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

        if (!editedTitle || editedTitle.trim() === '') {
            setTitleError('Title is required');
            isValid = false;
        } else {
            setTitleError('');
        }

        return isValid;
    }

    /**
     * Build the complete SubmodelElement for a MultiLanguageProperty
     */
    function buildMultiLanguageProperty(
        idShort: string,
        semanticIdValue: string,
        text: string,
        language: string = locale,
    ): MultiLanguageProperty {
        return {
            modelType: 'MultiLanguageProperty',
            idShort,
            semanticId: {
                type: 'ExternalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: semanticIdValue,
                    },
                ],
            },
            value: [
                {
                    language,
                    text,
                },
            ],
        };
    }

    /**
     * Build the complete SubmodelElement for a Property
     */
    function buildProperty(idShort: string, semanticIdValue: string, value: string): Property {
        return {
            modelType: 'Property',
            idShort,
            semanticId: {
                type: 'ExternalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: semanticIdValue,
                    },
                ],
            },
            valueType: 'xs:string',
            value,
        };
    }

    /**
     * Save the edited values using 3 separate PUT calls
     */
    async function validateAndSave(): Promise<boolean> {
        if (!validate()) {
            return false;
        }

        setIsSaving(true);

        try {
            const basePath = getBasePath();
            const version = detectVersion();
            const errors: string[] = [];

            // 1. PUT Title
            const titleSemanticId =
                version === '1.2' ? DocumentSpecificSemanticIdIrdi.Title : DocumentSpecificSemanticIdIrdiV2.Title;

            const titleElement = buildMultiLanguageProperty('Title', titleSemanticId, editedTitle);
            const titleResult = await putSubmodelElementByPath(
                submodelId,
                `${basePath}.Title`,
                titleElement,
                repository,
            );

            if (!titleResult.isSuccess) {
                errors.push(`Title update failed: ${titleResult.message}`);
            }

            // 2. PUT Description/Summary
            if (editedDescription) {
                const descSemanticId =
                    version === '1.2'
                        ? DocumentSpecificSemanticIdIrdi.Summary
                        : DocumentSpecificSemanticIdIrdiV2.Description;
                const descIdShort = version === '1.2' ? 'Summary' : 'Description';

                const descElement = buildMultiLanguageProperty(descIdShort, descSemanticId, editedDescription);
                const descResult = await putSubmodelElementByPath(
                    submodelId,
                    `${basePath}.${descIdShort}`,
                    descElement,
                    repository,
                );

                if (!descResult.isSuccess) {
                    errors.push(`${descIdShort} update failed: ${descResult.message}`);
                }
            }

            // 3. PUT Organization
            if (editedOrganization) {
                const orgSemanticId =
                    version === '1.2'
                        ? DocumentSpecificSemanticIdIrdi.OrganizationName
                        : DocumentSpecificSemanticIdIrdiV2.OrganizationShortName;
                const orgIdShort = version === '1.2' ? 'OrganizationName' : 'OrganizationShortName';

                const orgElement = buildProperty(orgIdShort, orgSemanticId, editedOrganization);
                const orgResult = await putSubmodelElementByPath(
                    submodelId,
                    `${basePath}.${orgIdShort}`,
                    orgElement,
                    repository,
                );

                if (!orgResult.isSuccess) {
                    errors.push(`${orgIdShort} update failed: ${orgResult.message}`);
                }
            }

            if (errors.length > 0) {
                console.error('Some updates failed:', errors);
                setIsSaving(false);
                return false;
            }

            onSaveSuccess?.();
            return true;
        } catch (error) {
            console.error('Error saving document:', error);
            return false;
        } finally {
            setIsSaving(false);
        }
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
        initializeEditMode,
        validateAndSave,
    };
}
