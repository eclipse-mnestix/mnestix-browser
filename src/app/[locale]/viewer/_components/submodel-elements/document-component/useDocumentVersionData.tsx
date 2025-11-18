import { useState, useEffect, useCallback } from 'react';
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
} from './DocumentSemanticIds';
import { isValidUrl } from 'lib/util/UrlUtil';
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
) {
    const locale = useLocale();
    const { aasOriginUrl } = useCurrentAasContext();
    const [fileViewObject, setFileViewObject] = useState<FileViewObject>();

    const getDigitalFile = useCallback(
        (versionSubmodelEl: SubmodelElementChoice, fileSubmodelElement: SubmodelElementChoice) => {
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
                digitalFile.digitalFileUrl = `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`;
                digitalFile.mimeType = (versionSubmodelEl as ModelFile).contentType;
            }
            return digitalFile;
        },
        [submodelId, submodelElement.idShort, aasOriginUrl],
    );

    const getPreviewImageUrl = useCallback(
        (versionSubmodelEl: SubmodelElementChoice, previewSubmodelElement: SubmodelElementChoice) => {
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
                return `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`;
            }
            return '';
        },
        [submodelId, submodelElement.idShort, aasOriginUrl],
    );

    const extractDocumentVersionData = useCallback(
        (documentVersion: SubmodelElementCollection, fileViewObject: FileViewObject) => {
            const title = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, null, [
                DocumentSpecificSemanticId.Title,
                DocumentSpecificSemanticIdIrdi.Title,
                DocumentSpecificSemanticIdIrdiV2.Title,
            ]);
            fileViewObject.title = getTranslationText(title as MultiLanguageProperty, locale);

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
            fileViewObject.organizationName = (organization as Property).value || '';

            return fileViewObject;
        },
        [locale, getDigitalFile, getPreviewImageUrl],
    );

    const getFileViewObject = useCallback((): FileViewObject => {
        let fileViewObject: FileViewObject = {
            mimeType: '',
            title: submodelElement?.idShort ?? '',
            organizationName: '',
            digitalFileUrl: '',
            previewImgUrl: '',
        };
        if (!submodelElement?.value) return fileViewObject;

        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;
        if (documentVersion.value) {
            fileViewObject = extractDocumentVersionData(documentVersion, fileViewObject);
        }
        return fileViewObject;
    }, [submodelElement, extractDocumentVersionData]);

    useEffect(() => {
        setFileViewObject(getFileViewObject());
    }, [getFileViewObject]);

    return fileViewObject;
}
