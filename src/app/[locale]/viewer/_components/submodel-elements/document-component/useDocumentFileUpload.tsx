import { useState } from 'react';
import { SubmodelElementCollection } from 'lib/api/aas/models';
import { findSubmodelElementBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
} from './DocumentSemanticIds';
import { putAttachmentToSubmodelElement } from 'lib/services/submodel-repository-service/submodelRepositoryActions';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';
import { JsonPatchOperation } from 'lib/api/basyx-v3/apiInterface';
import { patchSubmodelByJsonPatch } from 'lib/services/submodel-repository-service/submodelRepositoryActions';

/**
 * Hook for handling file upload functionality for HandoverDocumentation
 * @param submodelElement The document submodel element collection
 * @param submodelId The submodel ID
 * @param repository Repository information
 * @param onUploadSuccess Callback function called after successful upload
 */
export function useDocumentFileUpload(
    submodelElement: SubmodelElementCollection,
    submodelId: string,
    repository: RepositoryWithInfrastructure,
    onUploadSuccess?: () => void,
) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    /**
     * Handle file selection
     */
    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadError('');
        }
    }

    /**
     * Build the idShortPath for the DigitalFile element
     */
    function buildDigitalFileIdShortPath(): string | null {
        if (!submodelElement?.value || !submodelElement?.idShort) return null;

        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;

        if (!documentVersion?.value || !documentVersion?.idShort) return null;

        // Find or determine the DigitalFiles element
        const digitalFilesElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'DigitalFile', [
            DocumentSpecificSemanticId.DigitalFile,
            DocumentSpecificSemanticIdIrdi.DigitalFile,
            DocumentSpecificSemanticIdIrdiV2.DigitalFile,
        ]);

        if (!digitalFilesElement?.idShort) {
            // If DigitalFile doesn't exist, we'll need to create it first via PATCH
            return null;
        }

        // Build the path: Document.DocumentVersion.DigitalFile
        return `${submodelElement.idShort}.${documentVersion.idShort}.${digitalFilesElement.idShort}`;
    }

    /**
     * Create a DigitalFile element if it doesn't exist
     */
    async function ensureDigitalFileExists(): Promise<boolean> {
        if (!submodelElement?.value || !submodelElement?.idShort || !selectedFile) return false;

        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;

        if (!documentVersion?.value || !documentVersion?.idShort) return false;

        // Check if DigitalFile already exists
        const digitalFilesElement = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'DigitalFile', [
            DocumentSpecificSemanticId.DigitalFile,
            DocumentSpecificSemanticIdIrdi.DigitalFile,
            DocumentSpecificSemanticIdIrdiV2.DigitalFile,
        ]);

        if (digitalFilesElement) {
            return true; // Already exists
        }

        // Create DigitalFile element via PATCH
        const basePath = `/submodelElements/${submodelElement.idShort}/value/${documentVersion.idShort}/value`;
        const patchOperations: JsonPatchOperation[] = [
            {
                op: 'add',
                path: `${basePath}/-`,
                value: {
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
                    contentType: selectedFile.type || 'application/octet-stream',
                    value: '',
                },
            },
        ];

        try {
            const result = await patchSubmodelByJsonPatch(submodelId, patchOperations, repository);
            return result.isSuccess;
        } catch (error) {
            console.error('Error creating DigitalFile element:', error);
            return false;
        }
    }

    /**
     * Upload the selected file
     */
    async function uploadFile(): Promise<boolean> {
        if (!selectedFile) {
            setUploadError('No file selected');
            return false;
        }

        setIsUploading(true);
        setUploadError('');

        try {
            // Ensure DigitalFile element exists
            const digitalFileExists = await ensureDigitalFileExists();
            if (!digitalFileExists) {
                setUploadError('Failed to prepare upload location');
                setIsUploading(false);
                return false;
            }

            // Build the idShortPath
            const idShortPath = buildDigitalFileIdShortPath();
            if (!idShortPath) {
                setUploadError('Could not determine upload path');
                setIsUploading(false);
                return false;
            }

            // Upload the file
            const blob = new Blob([selectedFile], { type: selectedFile.type });
            const result = await putAttachmentToSubmodelElement(
                submodelId,
                {
                    idShortPath: idShortPath,
                    fileName: selectedFile.name,
                    file: blob,
                },
                repository,
            );

            if (result.isSuccess) {
                setSelectedFile(null);
                onUploadSuccess?.();
                return true;
            } else {
                setUploadError(result.message || 'Failed to upload file');
                return false;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadError('An error occurred during upload');
            return false;
        } finally {
            setIsUploading(false);
        }
    }

    /**
     * Clear the selected file
     */
    function clearSelectedFile() {
        setSelectedFile(null);
        setUploadError('');
    }

    return {
        selectedFile,
        isUploading,
        uploadError,
        handleFileSelect,
        uploadFile,
        clearSelectedFile,
    };
}
