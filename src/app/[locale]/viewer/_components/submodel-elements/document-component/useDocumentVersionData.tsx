import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
    SubmodelElementCollection,
    ModelFile,
    SubmodelElementChoice,
    Property,
    MultiLanguageProperty,
    SubmodelElementList,
    KeyTypes,
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
 * Resolves the document version collection for both the flat Handover Documentation (V1.0 / V1.2)
 * and the V2.0 structure, where the versions are wrapped inside a `DocumentVersions` list.
 * @param documentElements the value of a single document collection
 */
function findDocumentVersion(
    documentElements: SubmodelElementChoice[] | null | undefined,
): SubmodelElementCollection | null {
    const directVersion = findSubmodelElementBySemanticIdsOrIdShort(documentElements, 'DocumentVersion', [
        DocumentSpecificSemanticId.DocumentVersion,
        DocumentSpecificSemanticIdIrdi.DocumentVersion,
        DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
    ]) as SubmodelElementCollection | null;
    if (directVersion) return directVersion;

    const versionList = findSubmodelElementBySemanticIdsOrIdShort(documentElements, 'DocumentVersions', [
        DocumentSpecificSemanticIdIrdiV2.DocumentVersionsList,
    ]) as SubmodelElementList | null;
    const versions = (versionList?.value ?? []) as SubmodelElementCollection[];
    return versions.at(-1) ?? null;
}

/**
 * Resolves the digital file element for both the flat Handover Documentation (V1.0 / V1.2) and the
 * V2.0 structure, where the files are wrapped inside a `DigitalFiles` list.
 *
 * Note: The semantic id matching is version-agnostic (see `irdiPathEquals`), so a lookup for the
 * digital file (`0173-1#02-ABK126#003`) also matches the V2.0 `DigitalFiles` list
 * (`0173-1#02-ABK126#002`). We therefore disambiguate on the `modelType`: a matched list contains
 * the actual file elements, while a direct match already is the file.
 * @param versionElements the value of a single document version collection
 */
function findDigitalFileElement(
    versionElements: SubmodelElementChoice[] | null | undefined,
): SubmodelElementChoice | null {
    const fileMatch = findSubmodelElementBySemanticIdsOrIdShort(versionElements, 'DigitalFile', [
        DocumentSpecificSemanticId.DigitalFile,
        DocumentSpecificSemanticIdIrdi.DigitalFile,
        DocumentSpecificSemanticIdIrdiV2.DigitalFile,
    ]);

    if (fileMatch?.modelType === KeyTypes.SubmodelElementList) {
        const files = ((fileMatch as SubmodelElementList).value ?? []) as SubmodelElementChoice[];
        return files.at(-1) ?? null;
    }

    return fileMatch ?? null;
}

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

    function extractDocumentVersionData(documentVersion: SubmodelElementCollection, fileViewObject: FileViewObject) {
        const title = findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'Title', [
            DocumentSpecificSemanticId.Title,
            DocumentSpecificSemanticIdIrdi.Title,
            DocumentSpecificSemanticIdIrdiV2.Title,
        ]);
        fileViewObject.title = getTranslationText(title as MultiLanguageProperty, locale);

        const file = findDigitalFileElement(documentVersion.value);
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

        const organization =
            findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'OrganizationName', [
                DocumentSpecificSemanticId.OrganizationName,
                DocumentSpecificSemanticIdIrdi.OrganizationName,
                DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
            ]) ??
            findSubmodelElementBySemanticIdsOrIdShort(documentVersion.value, 'OrganizationShortName', [
                DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
            ]);
        fileViewObject.organizationName = (organization as Property)?.value || '';

        return fileViewObject;
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
            digitalFile.digitalFileUrl = `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`;
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
            return `${aasOriginUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`;
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

        const documentVersion = findDocumentVersion(submodelElement.value);
        if (documentVersion?.value) {
            fileViewObject = extractDocumentVersionData(documentVersion, fileViewObject);
        }
        return fileViewObject;
    }, [submodelElement, locale, aasOriginUrl, submodelId]);

    return fileViewObject;
}
