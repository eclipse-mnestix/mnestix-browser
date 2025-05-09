import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useAasOriginSourceState } from 'components/contexts/CurrentAasContext';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationText } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
} from './DocumentSemanticIds';
import { isValidUrl } from 'lib/util/UrlUtil';
import { encodeBase64 } from 'lib/util/Base64Util';
import {
    File,
    ISubmodelElement,
    MultiLanguageProperty,
    Property,
} from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { findIdShortForLatestElement } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentUtils';

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
export function useFileViewObject(submodelElement: SubmodelElementCollection, submodelId: string) {
    const locale = useLocale();
    const [aasOriginUrl] = useAasOriginSourceState();
    const [fileViewObject, setFileViewObject] = useState<FileViewObject>();

    useEffect(() => {
        setFileViewObject(getFileViewObject());
    }, [submodelElement]);

    function getFileViewObject(): FileViewObject {
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
        if (documentVersion?.value) {
            fileViewObject = extractDocumentVersionData(documentVersion, fileViewObject);
        }
        return fileViewObject;
    }

    function extractDocumentVersionData(documentVersion: SubmodelElementCollection, fileViewObject: FileViewObject) {
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
    }

    function getDigitalFile(versionSubmodelEl: ISubmodelElement, submodelElement: ISubmodelElement) {
        const digitalFile = {
            digitalFileUrl: '',
            mimeType: '',
        };

        if (isValidUrl((versionSubmodelEl as File).value)) {
            digitalFile.digitalFileUrl = (versionSubmodelEl as File).value || '';
            digitalFile.mimeType = (versionSubmodelEl as File).contentType;
        } else if (submodelId && submodelElement.idShort && submodelElement?.idShort) {
            const idShort = findIdShortForLatestElement(
                submodelElement as SubmodelElementCollection,
                'DigitalFile',
                DocumentSpecificSemanticId.DigitalFile,
                DocumentSpecificSemanticIdIrdi.DigitalFile,
                DocumentSpecificSemanticIdIrdiV2.DigitalFile,
            );
            const submodelElementPath = `${submodelElement.idShort}.${submodelElement.idShort}.${idShort}`;
            digitalFile.digitalFileUrl = `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`;
            digitalFile.mimeType = (versionSubmodelEl as File).contentType;
        }
        return digitalFile;
    }

    function getPreviewImageUrl(versionSubmodelEl: ISubmodelElement, submodelElement: ISubmodelElement) {
        if (isValidUrl((versionSubmodelEl as File).value)) {
            return (versionSubmodelEl as File).value ?? '';
        } else if (submodelId && submodelElement.idShort && submodelElement?.idShort) {
            const idShort = findIdShortForLatestElement(
                submodelElement as SubmodelElementCollection,
                'PreviewFile',
                DocumentSpecificSemanticId.PreviewFile,
                DocumentSpecificSemanticIdIrdi.PreviewFile,
                DocumentSpecificSemanticIdIrdiV2.PreviewFile,
            );
            const submodelElementPath = `${submodelElement.idShort}.${submodelElement?.idShort}.${idShort}`;
            return `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`;
        }
        return '';
    }

    return fileViewObject;
}
