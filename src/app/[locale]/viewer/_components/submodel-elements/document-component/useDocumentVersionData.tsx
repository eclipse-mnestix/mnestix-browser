import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
    SubmodelElementCollection,
    ModelFile,
    SubmodelElementChoice,
    Property,
    MultiLanguageProperty,
    SubmodelElementList,
} from 'lib/api/aas/models';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationText } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
    DocumentSpecificSemanticIdIrdiV3,
} from './DocumentSemanticIds';
import { encodeIdShortPath, isValidUrl } from 'lib/util/UrlUtil';
import { encodeBase64 } from 'lib/util/Base64Util';
import { findIdShortForLatestElement } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentUtils';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

export type FileViewObject = {
    mimeType: string;
    title: string;
    digitalFileUrl: string;
    previewImgUrl: string;
    organizationName: string;
};

/**
 * Custom hook which prepares the data from HandoverDocumentation to be displayed.
 * @param submodelElement
 * @param submodelId
 */
export function useFileViewObject(
    submodelElement: SubmodelElementCollection | SubmodelElementList,
    submodelId: string,
    documentIndex?: number,
    parentListIdShort?: string,
) {
    const locale = useLocale();
    const { aasOriginUrl } = useCurrentAasContext();

    function extractDocumentVersionData(
        documentVersion: SubmodelElementCollection,
        fileViewObject: FileViewObject,
        versionIndex?: number,
    ) {
        const title = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'Title', [
            DocumentSpecificSemanticId.Title,
            DocumentSpecificSemanticIdIrdi.Title,
            DocumentSpecificSemanticIdIrdiV2.Title,
        ]);
        fileViewObject.title = getTranslationText(title as MultiLanguageProperty, locale);

        // V3: DigitalFiles is a SubmodelElementList containing File elements
        const digitalFilesList = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'DigitalFiles', [
            DocumentSpecificSemanticIdIrdiV3.DigitalFilesList,
        ]) as SubmodelElementList | null;
        if (digitalFilesList?.value && digitalFilesList.value.length > 0) {
            const firstFile = digitalFilesList.value[0] as ModelFile;
            fileViewObject = {
                ...fileViewObject,
                ...getDigitalFileV3(firstFile, versionIndex ?? 0),
            };
        } else {
            // V1/V2: DigitalFile is directly in the version collection
            const file = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'DigitalFile', [
                DocumentSpecificSemanticId.DigitalFile,
                DocumentSpecificSemanticIdIrdi.DigitalFile,
                DocumentSpecificSemanticIdIrdiV2.DigitalFile,
            ]);
            fileViewObject = file
                ? {
                      ...fileViewObject,
                      ...getDigitalFile(file, documentVersion),
                  }
                : fileViewObject;
        }

        const preview = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'PreviewFile', [
            DocumentSpecificSemanticId.PreviewFile,
            DocumentSpecificSemanticIdIrdi.PreviewFile,
            DocumentSpecificSemanticIdIrdiV2.PreviewFile,
        ]);
        fileViewObject.previewImgUrl = preview ? getPreviewImageUrl(preview, documentVersion) : '';

        const organization = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'OrganizationName', [
            DocumentSpecificSemanticId.OrganizationName,
            DocumentSpecificSemanticIdIrdi.OrganizationName,
            DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
        ]);
        if (organization) {
            fileViewObject.organizationName = (organization as Property).value || '';
        }

        return fileViewObject;
    }

    function getDigitalFileV3(file: ModelFile, versionIndex: number) {
        const digitalFile = {
            digitalFileUrl: '',
            mimeType: file.contentType || '',
        };

        if (isValidUrl(file.value)) {
            digitalFile.digitalFileUrl = file.value || '';
        } else if (submodelId && documentIndex !== undefined && parentListIdShort !== undefined) {
            const submodelElementPath = `${parentListIdShort}[${documentIndex}].DocumentVersions[${versionIndex}].DigitalFiles[0]`;
            digitalFile.digitalFileUrl = `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${encodeIdShortPath(submodelElementPath)}/attachment`;
        }
        return digitalFile;
    }

    function getDigitalFile(versionSubmodelEl: SubmodelElementChoice, fileSubmodelElement: SubmodelElementChoice) {
        const digitalFile = {
            digitalFileUrl: '',
            mimeType: '',
        };

        if (isValidUrl((versionSubmodelEl as ModelFile).value)) {
            digitalFile.digitalFileUrl = (versionSubmodelEl as ModelFile).value || '';
            digitalFile.mimeType = (versionSubmodelEl as ModelFile).contentType;
        } else if (submodelId && fileSubmodelElement.idShort && fileSubmodelElement?.idShort) {
            const idShort = findIdShortForLatestElement(
                fileSubmodelElement as SubmodelElementCollection,
                'DigitalFile',
                DocumentSpecificSemanticId.DigitalFile,
                DocumentSpecificSemanticIdIrdi.DigitalFile,
                DocumentSpecificSemanticIdIrdiV2.DigitalFile,
            );
            const submodelElementPath = `${submodelElement.idShort}.${fileSubmodelElement.idShort}.${idShort}`;
            digitalFile.digitalFileUrl = `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${encodeIdShortPath(submodelElementPath)}/attachment`;
            digitalFile.mimeType = (versionSubmodelEl as ModelFile).contentType;
        }
        return digitalFile;
    }

    function getPreviewImageUrl(
        versionSubmodelEl: SubmodelElementChoice,
        previewSubmodelElement: SubmodelElementChoice,
    ) {
        if (isValidUrl((versionSubmodelEl as ModelFile).value)) {
            return (versionSubmodelEl as ModelFile).value ?? '';
        } else if (submodelId && previewSubmodelElement.idShort && previewSubmodelElement?.idShort) {
            const idShort = findIdShortForLatestElement(
                previewSubmodelElement as SubmodelElementCollection,
                'PreviewFile',
                DocumentSpecificSemanticId.PreviewFile,
                DocumentSpecificSemanticIdIrdi.PreviewFile,
                DocumentSpecificSemanticIdIrdiV2.PreviewFile,
            );
            const submodelElementPath = `${submodelElement.idShort}.${previewSubmodelElement?.idShort}.${idShort}`;
            return `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${encodeIdShortPath(submodelElementPath)}/attachment`;
        }
        return '';
    }

    const fileViewObject = useMemo((): FileViewObject => {
        let fileViewObject: FileViewObject = {
            mimeType: '',
            title: submodelElement?.idShort ?? '',
            organizationName: '',
            digitalFileUrl: '',
            previewImgUrl: '',
        };
        if (!submodelElement?.value) return fileViewObject;

        // V3: DocumentVersions is a SubmodelElementList containing version collections
        const documentVersionsList = findSubmodelElementBySemanticIdsOrIdShort(
            submodelElement.value,
            'DocumentVersions',
            [DocumentSpecificSemanticIdIrdiV3.DocumentVersionsList],
        ) as SubmodelElementList | null;
        if (documentVersionsList?.value && documentVersionsList.value.length > 0) {
            const latestVersion = documentVersionsList.value[0] as SubmodelElementCollection;
            if (latestVersion.value) {
                fileViewObject = extractDocumentVersionData(latestVersion, fileViewObject, 0);
            }
            return fileViewObject;
        }

        // V1/V2: DocumentVersion is directly in the document collection
        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;
        if (documentVersion?.value) {
            fileViewObject = extractDocumentVersionData(documentVersion, fileViewObject);
        }
        return fileViewObject;
    }, [submodelElement, locale, aasOriginUrl, submodelId, documentIndex, parentListIdShort]);

    return fileViewObject;
}
