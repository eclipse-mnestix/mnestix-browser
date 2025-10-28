import { useState } from 'react';
import { Submodel, SubmodelElementList } from 'lib/api/aas/models';
import { findSubmodelElementBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import { DocumentSpecificSemanticIdIrdi, DocumentSpecificSemanticIdIrdiV2 } from './DocumentSemanticIds';
import {
    postSubmodelElement,
    postSubmodelElementByPath,
    putAttachmentToSubmodelElement,
} from 'lib/services/submodel-repository-service/submodelRepositoryActions';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

export type NewDocumentData = {
    title: string;
    description: string;
    organizationShortName: string;
    version: string;
    language: string;
    file?: File;
};

/**
 * Hook for adding new documents to HandoverDocumentation submodel
 * @param submodel The HandoverDocumentation submodel
 * @param submodelId The submodel ID
 * @param repository Repository information
 * @param onAddSuccess Callback function called after successful addition
 */
export function useAddDocument(
    submodel: Submodel | undefined,
    submodelId: string,
    repository: RepositoryWithInfrastructure,
    onAddSuccess?: () => void,
) {
    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState('');
    const [newDocument, setNewDocument] = useState<NewDocumentData>({
        title: '',
        description: '',
        organizationShortName: '',
        version: '1.0',
        language: 'en',
    });

    /**
     * Validate new document data
     */
    function validate(): { isValid: boolean; errors: Record<string, string> } {
        const errors: Record<string, string> = {};

        if (!newDocument.title || newDocument.title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!newDocument.version || newDocument.version.trim() === '') {
            errors.version = 'Version is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }

    /**
     * Find or determine the Documents list idShort (V2.0) or check if V1.2
     */
    function getDocumentsListIdShort(): { idShort: string | null; isV2: boolean } {
        if (!submodel?.submodelElements) return { idShort: null, isV2: false };

        const documentsElement = findSubmodelElementBySemanticIdsOrIdShort(submodel.submodelElements, 'Documents', [
            DocumentSpecificSemanticIdIrdiV2.Documents,
        ]) as SubmodelElementList;

        return {
            idShort: documentsElement?.idShort || null,
            isV2: !!documentsElement,
        };
    }

    /**
     * Generate a unique idShort for the new Document
     */
    function generateDocumentIdShort(): string {
        const timestamp = Date.now();
        return `Document_${timestamp}`;
    }

    /**
     * Generate a unique idShort for the new DocumentVersion
     */
    function generateDocumentVersionIdShort(): string {
        return `DocumentVersion_${newDocument.version.replace(/\./g, '_')}`;
    }

    /**
     * Build the new Document structure for V2.0
     */
    function buildNewDocumentStructureV2(documentIdShort: string, documentVersionIdShort: string) {
        return {
            modelType: 'SubmodelElementCollection',
            idShort: documentIdShort,
            semanticId: {
                type: 'ExternalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: DocumentSpecificSemanticIdIrdiV2.Document,
                    },
                ],
            },
            value: [
                {
                    modelType: 'SubmodelElementList',
                    idShort: 'DocumentVersions',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: DocumentSpecificSemanticIdIrdiV2.DocumentVersions,
                            },
                        ],
                    },
                    orderRelevant: false,
                    typeValueListElement: 'SubmodelElementCollection',
                    value: [
                        {
                            modelType: 'SubmodelElementCollection',
                            idShort: documentVersionIdShort,
                            semanticId: {
                                type: 'ExternalReference',
                                keys: [
                                    {
                                        type: 'GlobalReference',
                                        value: DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
                                    },
                                ],
                            },
                            value: [
                                {
                                    modelType: 'MultiLanguageProperty',
                                    idShort: 'Title',
                                    semanticId: {
                                        type: 'ExternalReference',
                                        keys: [
                                            {
                                                type: 'GlobalReference',
                                                value: DocumentSpecificSemanticIdIrdiV2.Title,
                                            },
                                        ],
                                    },
                                    value: [
                                        {
                                            language: newDocument.language,
                                            text: newDocument.title,
                                        },
                                    ],
                                },
                                {
                                    modelType: 'MultiLanguageProperty',
                                    idShort: 'Description',
                                    semanticId: {
                                        type: 'ExternalReference',
                                        keys: [
                                            {
                                                type: 'GlobalReference',
                                                value: DocumentSpecificSemanticIdIrdiV2.Description,
                                            },
                                        ],
                                    },
                                    value: [
                                        {
                                            language: newDocument.language,
                                            text: newDocument.description || '',
                                        },
                                    ],
                                },
                                {
                                    modelType: 'Property',
                                    idShort: 'OrganizationShortName',
                                    semanticId: {
                                        type: 'ExternalReference',
                                        keys: [
                                            {
                                                type: 'GlobalReference',
                                                value: DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
                                            },
                                        ],
                                    },
                                    valueType: 'xs:string',
                                    value: newDocument.organizationShortName || '',
                                },
                                {
                                    modelType: 'Property',
                                    idShort: 'Version',
                                    semanticId: {
                                        type: 'ExternalReference',
                                        keys: [
                                            {
                                                type: 'GlobalReference',
                                                value: DocumentSpecificSemanticIdIrdiV2.Version,
                                            },
                                        ],
                                    },
                                    valueType: 'xs:string',
                                    value: newDocument.version,
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }

    /**
     * Build the new Document structure for V1.2
     */
    function buildNewDocumentStructureV1_2(documentIdShort: string) {
        return {
            modelType: 'SubmodelElementCollection',
            idShort: documentIdShort,
            semanticId: {
                type: 'ExternalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: DocumentSpecificSemanticIdIrdi.Document,
                    },
                ],
            },
            value: [
                {
                    modelType: 'SubmodelElementCollection',
                    idShort: 'DocumentVersion',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: DocumentSpecificSemanticIdIrdi.DocumentVersion,
                            },
                        ],
                    },
                    value: [
                        {
                            modelType: 'MultiLanguageProperty',
                            idShort: 'Title',
                            semanticId: {
                                type: 'ExternalReference',
                                keys: [
                                    {
                                        type: 'GlobalReference',
                                        value: DocumentSpecificSemanticIdIrdi.Title,
                                    },
                                ],
                            },
                            value: [
                                {
                                    language: newDocument.language,
                                    text: newDocument.title,
                                },
                            ],
                        },
                        {
                            modelType: 'MultiLanguageProperty',
                            idShort: 'Summary',
                            semanticId: {
                                type: 'ExternalReference',
                                keys: [
                                    {
                                        type: 'GlobalReference',
                                        value: DocumentSpecificSemanticIdIrdi.Summary,
                                    },
                                ],
                            },
                            value: [
                                {
                                    language: newDocument.language,
                                    text: newDocument.description || '',
                                },
                            ],
                        },
                        {
                            modelType: 'Property',
                            idShort: 'OrganizationName',
                            semanticId: {
                                type: 'ExternalReference',
                                keys: [
                                    {
                                        type: 'GlobalReference',
                                        value: DocumentSpecificSemanticIdIrdi.OrganizationName,
                                    },
                                ],
                            },
                            valueType: 'xs:string',
                            value: newDocument.organizationShortName || '',
                        },
                    ],
                },
            ],
        };
    }

    /**
     * Add the new document to the submodel
     */
    async function addDocument(): Promise<boolean> {
        const validation = validate();
        if (!validation.isValid) {
            setAddError(Object.values(validation.errors)[0]);
            return false;
        }

        setIsAdding(true);
        setAddError('');

        try {
            const { idShort: documentsListIdShort, isV2 } = getDocumentsListIdShort();

            if (isV2) {
                // V2.0: Add to Documents list using POST at path
                if (!documentsListIdShort) {
                    setAddError('Documents list not found in submodel');
                    setIsAdding(false);
                    return false;
                }

                const documentIdShort = generateDocumentIdShort();
                const documentVersionIdShort = generateDocumentVersionIdShort();
                const newDocumentStructure = buildNewDocumentStructureV2(documentIdShort, documentVersionIdShort);

                // POST the new Document to the Documents list path
                const postResult = await postSubmodelElementByPath(
                    submodelId,
                    documentsListIdShort,
                    newDocumentStructure,
                    repository,
                );

                if (!postResult.isSuccess) {
                    setAddError(postResult.message || 'Failed to add document');
                    setIsAdding(false);
                    return false;
                }

                // If a file is selected, upload it
                if (newDocument.file) {
                    const documentVersionPath = `${documentsListIdShort}.${documentIdShort}.DocumentVersions[0]`;

                    // First add the DigitalFile element to the DocumentVersion
                    const digitalFileElement = {
                        modelType: 'File',
                        idShort: 'DigitalFile',
                        semanticId: {
                            type: 'ExternalReference',
                            keys: [
                                {
                                    type: 'GlobalReference',
                                    value: DocumentSpecificSemanticIdIrdiV2.DigitalFile,
                                },
                            ],
                        },
                        contentType: newDocument.file.type || 'application/octet-stream',
                        value: '',
                    };

                    const digitalFileResult = await postSubmodelElementByPath(
                        submodelId,
                        documentVersionPath,
                        digitalFileElement,
                        repository,
                    );

                    if (digitalFileResult.isSuccess) {
                        // Upload the actual file
                        const idShortPath = `${documentVersionPath}.DigitalFile`;
                        const blob = new Blob([newDocument.file], { type: newDocument.file.type });
                        await putAttachmentToSubmodelElement(
                            submodelId,
                            {
                                idShortPath: idShortPath,
                                fileName: newDocument.file.name,
                                file: blob,
                            },
                            repository,
                        );
                    }
                }
            } else {
                // V1.2: Add Document directly to submodelElements using POST
                const documentIdShort = generateDocumentIdShort();
                const newDocumentStructure = buildNewDocumentStructureV1_2(documentIdShort);

                // POST the new Document directly to submodelElements
                const postResult = await postSubmodelElement(submodelId, newDocumentStructure, repository);

                if (!postResult.isSuccess) {
                    setAddError(postResult.message || 'Failed to add document');
                    setIsAdding(false);
                    return false;
                }

                // If a file is selected, upload it
                if (newDocument.file) {
                    const documentVersionPath = `${documentIdShort}.DocumentVersion`;

                    // First add the File element (V1.2 uses DigitalFile semantic ID)
                    const digitalFileElement = {
                        modelType: 'File',
                        idShort: 'File',
                        semanticId: {
                            type: 'ExternalReference',
                            keys: [
                                {
                                    type: 'GlobalReference',
                                    value: DocumentSpecificSemanticIdIrdi.DigitalFile,
                                },
                            ],
                        },
                        contentType: newDocument.file.type || 'application/octet-stream',
                        value: '',
                    };

                    const digitalFileResult = await postSubmodelElementByPath(
                        submodelId,
                        documentVersionPath,
                        digitalFileElement,
                        repository,
                    );

                    if (digitalFileResult.isSuccess) {
                        // Upload the actual file
                        const idShortPath = `${documentVersionPath}.File`;
                        const blob = new Blob([newDocument.file], { type: newDocument.file.type });
                        await putAttachmentToSubmodelElement(
                            submodelId,
                            {
                                idShortPath: idShortPath,
                                fileName: newDocument.file.name,
                                file: blob,
                            },
                            repository,
                        );
                    }
                }
            }

            // Reset form
            setNewDocument({
                title: '',
                description: '',
                organizationShortName: '',
                version: '1.0',
                language: 'en',
            });

            onAddSuccess?.();
            return true;
        } catch (error) {
            console.error('Error adding document:', error);
            setAddError('An error occurred while adding the document');
            return false;
        } finally {
            setIsAdding(false);
        }
    }

    /**
     * Update a field in the new document data
     */
    function updateField<K extends keyof NewDocumentData>(field: K, value: NewDocumentData[K]) {
        setNewDocument((prev) => ({
            ...prev,
            [field]: value,
        }));
        setAddError('');
    }

    /**
     * Reset the form
     */
    function resetForm() {
        setNewDocument({
            title: '',
            description: '',
            organizationShortName: '',
            version: '1.0',
            language: 'en',
        });
        setAddError('');
    }

    return {
        newDocument,
        isAdding,
        addError,
        updateField,
        addDocument,
        resetForm,
    };
}
