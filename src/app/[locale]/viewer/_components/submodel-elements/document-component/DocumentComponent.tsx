import { InfoOutlined, InsertDriveFileOutlined, OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Link, styled, Typography } from '@mui/material';
import {
    File,
    ISubmodelElement,
    MultiLanguageProperty,
    Property,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { PdfDocumentIcon } from 'components/custom-icons/PdfDocumentIcon';
import { useState } from 'react';
import {
    findSubmodelElementBySemanticIdsOrIdShort,
    getTranslationText,
} from 'lib/util/SubmodelResolverUtil';
import { DocumentDetailsDialog } from './DocumentDetailsDialog';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useAasOriginSourceState } from 'components/contexts/CurrentAasContext';
import { encodeBase64 } from 'lib/util/Base64Util';
import { checkFileExists } from 'lib/services/search-actions/searchActions';
import { useLocale, useTranslations } from 'next-intl';
import { findIdShortForLatestElement } from './DocumentUtils';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
    DocumentSpecificSemanticIdIrdiV2,
} from './DocumentSemanticIds';
import {
    DocumentClassification
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentClassification';

type DocumentComponentProps = {
    readonly submodelElement: SubmodelElementCollection;
    readonly hasDivider: boolean;
    readonly submodelId: string;
};

export type FileViewObject = {
    mimeType: string;
    title: string;
    digitalFileUrl: string;
    previewImgUrl: string;
    organizationName: string;
};

const StyledImageWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    boxShadow: theme.shadows['3'],
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    img: {
        objectFit: 'contain',
        width: '100%',
        height: '100%',
    },
    '.MuiSvgIcon-root': {
        fontSize: '2.5rem',
        opacity: '.5',
    },
}));

export function DocumentComponent(props: DocumentComponentProps) {
    const t = useTranslations('components.documentComponent');
    const locale = useLocale();
    const [fileViewObject, setFileViewObject] = useState<FileViewObject>();
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [aasOriginUrl] = useAasOriginSourceState();
    const [imageError, setImageError] = useState(false);
    const [fileExists, setFileExists] = useState(true);

    useAsyncEffect(async () => {
        if (fileViewObject?.digitalFileUrl) {
            const checkResponse = await checkFileExists(fileViewObject.digitalFileUrl);
            setFileExists(checkResponse.isSuccess && checkResponse.result);
        }
    }, [fileViewObject?.digitalFileUrl]);

    useAsyncEffect(async () => {
        setFileViewObject(getFileViewObject());
    }, [props.submodelElement]);

    const handleDetailsClick = () => {
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const renderImage = () => (
        <StyledImageWrapper>
            {!imageError && fileViewObject?.previewImgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo can be an arbitrary url which conflicts with https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
                <img
                    src={fileViewObject.previewImgUrl}
                    height={90}
                    width={90}
                    alt="File Preview"
                    onError={handleImageError}
                    data-testid="document-preview-image"
                />
            ) : fileViewObject?.mimeType === 'application/pdf' ? (
                <PdfDocumentIcon color="primary" />
            ) : (
                <InsertDriveFileOutlined color="primary" />
            )}
        </StyledImageWrapper>
    );

    function findIdShortForLatestDocument(submodelElement: SubmodelElementCollection) {
        return findIdShortForLatestElement(
            submodelElement,
            'DigitalFile',
            DocumentSpecificSemanticId.DigitalFile,
            DocumentSpecificSemanticIdIrdi.DigitalFile,
            DocumentSpecificSemanticIdIrdiV2.DigitalFile,
        );
    }

    function findIdShortForLatestPreviewImage(submodelElement: SubmodelElementCollection) {
        return findIdShortForLatestElement(
            submodelElement,
            'PreviewFile',
            DocumentSpecificSemanticId.PreviewFile,
            DocumentSpecificSemanticIdIrdi.PreviewFile,
            DocumentSpecificSemanticIdIrdiV2.PreviewFile,
        );
    }

    function getDigitalFile(versionSubmodelEl: ISubmodelElement, submodelElement: ISubmodelElement) {
        const digitalFile = {
            digitalFileUrl: '',
            mimeType: '',
        };

        if (isValidUrl((versionSubmodelEl as File).value)) {
            digitalFile.digitalFileUrl = (versionSubmodelEl as File).value || '';
            digitalFile.mimeType = (versionSubmodelEl as File).contentType;
        } else if (props.submodelId && submodelElement.idShort && props.submodelElement?.idShort) {
            const submodelElementPath =
                props.submodelElement.idShort +
                '.' +
                submodelElement.idShort +
                '.' +
                findIdShortForLatestDocument(submodelElement as SubmodelElementCollection);

            digitalFile.digitalFileUrl =
                aasOriginUrl +
                '/submodels/' +
                encodeBase64(props.submodelId) +
                '/submodel-elements/' +
                submodelElementPath +
                '/attachment';

            digitalFile.mimeType = (versionSubmodelEl as File).contentType;
        }

        return digitalFile;
    }

    function getPreviewImageUrl(versionSubmodelEl: ISubmodelElement, submodelElement: ISubmodelElement) {
        let previewImgUrl;

        if (isValidUrl((versionSubmodelEl as File).value)) {
            previewImgUrl = (versionSubmodelEl as File).value ?? '';
        } else if (props.submodelId && submodelElement.idShort && props.submodelElement?.idShort) {
            const submodelElementPath =
                props.submodelElement.idShort +
                '.' +
                submodelElement.idShort +
                '.' +
                findIdShortForLatestPreviewImage(submodelElement as SubmodelElementCollection);

            previewImgUrl =
                aasOriginUrl +
                '/submodels/' +
                encodeBase64(props.submodelId) +
                '/submodel-elements/' +
                submodelElementPath +
                '/attachment';
        }

        return previewImgUrl ?? '';
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

    function getFileViewObject(): FileViewObject {
        let fileViewObject: FileViewObject = {
            mimeType: '',
            title: props.submodelElement?.idShort ?? '',
            organizationName: '',
            digitalFileUrl: '',
            previewImgUrl: '',
        };
        if (!props.submodelElement?.value) return fileViewObject;

        const documentVersion = findSubmodelElementBySemanticIdsOrIdShort(props.submodelElement.value, 'DocumentVersion', [
            DocumentSpecificSemanticId.DocumentVersion,
            DocumentSpecificSemanticIdIrdi.DocumentVersion,
            DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
        ]) as SubmodelElementCollection;
        if (documentVersion?.value) {
            fileViewObject =  extractDocumentVersionData(documentVersion, fileViewObject);
        }
        return fileViewObject;
    }

    function getDocumentClassificationCollection() {
        // TODO there can be more than one
        return findSubmodelElementBySemanticIdsOrIdShort(props.submodelElement.value, 'DocumentClassification', [
            DocumentSpecificSemanticId.DocumentClassification,
            DocumentSpecificSemanticIdIrdi.DocumentClassification,
        ]) as SubmodelElementCollection;
    }

    return (
        <DataRow title={props.submodelElement?.idShort} hasDivider={props.hasDivider}>
            {fileViewObject && (
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" gap={1}>
                        {fileExists ? (
                            <Link href={fileViewObject.digitalFileUrl} target="_blank">
                                {renderImage()}
                            </Link>
                        ) : (
                            renderImage()
                        )}
                        <Box>
                            <Typography data-testid="document-title">{fileViewObject.title}</Typography>
                            {fileViewObject.organizationName && (
                                <Typography variant="body2" color="text.secondary" data-testid="document-organization">
                                    {fileViewObject.organizationName}
                                </Typography>
                            )}
                            <Button
                                variant="outlined"
                                startIcon={fileExists ? <OpenInNew /> : ''}
                                sx={{ mt: 1 }}
                                href={fileViewObject.digitalFileUrl}
                                target="_blank"
                                disabled={!fileExists}
                                data-testid="document-open-button"
                            >
                                {!fileExists ? t('fileNotFound') : t('open')}
                            </Button>
                        </Box>
                        <DocumentClassification classificationData={getDocumentClassificationCollection()} />
                    </Box>
                    <IconButton onClick={() => handleDetailsClick()} sx={{ ml: 1 }} data-testid="document-info-button">
                        <InfoOutlined />
                    </IconButton>
                </Box>
            )}
            <DocumentDetailsDialog
                open={detailsModalOpen}
                handleClose={() => handleDetailsModalClose()}
                document={props.submodelElement as SubmodelElementCollection}
                data-testid="document-details-dialog"
            />
        </DataRow>
    );
}
