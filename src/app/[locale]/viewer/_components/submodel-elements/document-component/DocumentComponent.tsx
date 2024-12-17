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
import { messages } from 'lib/i18n/localization';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTranslationText, hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { DocumentDetailsDialog } from './DocumentDetailsDialog';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAttachmentFromSubmodelElement } from 'lib/services/repository-access/repositorySearchActions';
import { useAasOriginSourceState } from 'components/contexts/CurrentAasContext';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import Image from 'next/image';

enum DocumentSpecificSemanticId {
    DocumentVersion = 'https://admin-shell.io/vdi/2770/1/0/DocumentVersion',
    Title = 'https://admin-shell.io/vdi/2770/1/0/DocumentDescription/Title',
    OrganizationName = 'https://admin-shell.io/vdi/2770/1/0/Organization/OrganizationName',
    DigitalFile = 'https://admin-shell.io/vdi/2770/1/0/StoredDocumentRepresentation/DigitalFile',
    PreviewFile = 'https://admin-shell.io/vdi/2770/1/0/StoredDocumentRepresentation/PreviewFile',
}

enum DocumentSpecificSemanticIdIrdi {
    DocumentVersion = '0173-1#02-ABI503#001/0173-1#01-AHF582#001',
    Title = '0173-1#02-AAO105#002',
    OrganizationName = '0173-1#02-ABI002#001',
    DigitalFile = '0173-1#02-ABI504#001/0173-1#01-AHF583#001',
    PreviewFile = '0173-1#02-ABI505#001/0173-1#01-AHF584#001',
}

enum DocumentSpecificSemanticIdIrdiV2 {
    DocumentVersion = '0173-1#02-ABI503#003/0173-1#01-AHF582#003',
    Title = '0173-1#02-ABG940#004',
    OrganizationShortName = '0173-1#02-ABI002#003',
    DigitalFile = '0173-1#02-ABK126#003',
    PreviewFile = '0173-1#02-ABK127#002',
}

type MarkingsComponentProps = {
    readonly submodelElement?: SubmodelElementCollection;
    readonly hasDivider?: boolean;
    readonly submodelId?: string;
};

type FileViewObject = {
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

export function DocumentComponent(props: MarkingsComponentProps) {
    const intl = useIntl();
    const [fileViewObject, setFileViewObject] = useState<FileViewObject>();
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [aasOriginUrl] = useAasOriginSourceState();
    const [fileNotFound, setFileNotFound] = useState(false);

    useAsyncEffect(async () => {
        setFileViewObject(await getFileViewObject());
    }, [props.submodelElement]);

    const handleDetailsClick = () => {
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    function findIdShortForLatestElement(
        submodelElement: SubmodelElementCollection,
        prefix: string,
        ...semanticIds: string[]
    ): string {
        const foundIdShorts = submodelElement.value
            ?.filter(
                (element) =>
                    element &&
                    element.idShort &&
                    (hasSemanticId(element, ...semanticIds) || element.idShort.startsWith(prefix)),
            )
            .map((value) => value.idShort)
            .sort()
            .filter((value) => value != null);

        const lastIdShort = foundIdShorts ? foundIdShorts.at(-1) : null;

        if (!foundIdShorts || !lastIdShort || foundIdShorts.length < 1) {
            console.error('Did not find a digital File');
            return 'DigitalFile';
        }

        if (foundIdShorts.length > 1) {
            console.warn(
                `Found multiple versions of documents: ${foundIdShorts}, 
                displaying the last one when sorted alphabetically: ${lastIdShort}`,
            );
        }

        return lastIdShort;
    }

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

    async function getDigitalFile(versionSubmodelEl: ISubmodelElement, submodelElement: ISubmodelElement) {
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

            digitalFile.mimeType = (versionSubmodelEl as File).contentType;

            const fileResponse = await getAttachmentFromSubmodelElement(
                props.submodelId,
                submodelElementPath,
                aasOriginUrl ?? undefined,
            );
            if (!fileResponse.isSuccess) {
                console.error('File not found' + fileResponse.message);
                setFileNotFound(true);
            } else {
                const image = mapFileDtoToBlob(fileResponse.result);
                digitalFile.digitalFileUrl = URL.createObjectURL(image);
            }
        }

        return digitalFile;
    }

    async function getPreviewImageUrl(versionSubmodelEl: ISubmodelElement, submodelElement: ISubmodelElement) {
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

            const imageResponse = await getAttachmentFromSubmodelElement(
                props.submodelId,
                submodelElementPath,
                aasOriginUrl ?? undefined,
            );
            if (!imageResponse.isSuccess) {
                console.error('Image not found' + imageResponse.message);
            } else {
                const image = mapFileDtoToBlob(imageResponse.result);
                previewImgUrl = URL.createObjectURL(image);
            }
        }

        return previewImgUrl ?? '';
    }

    async function getFileViewObject(): Promise<FileViewObject> {
        let fileViewObject: FileViewObject = {
            mimeType: '',
            title: props.submodelElement?.idShort ?? '',
            organizationName: '',
            digitalFileUrl: '',
            previewImgUrl: '',
        };

        if (!props.submodelElement?.value) return fileViewObject;

        for (const submodelElement of props.submodelElement.value) {
            // check for DocumentVersions
            if (
                !hasSemanticId(
                    submodelElement,
                    DocumentSpecificSemanticId.DocumentVersion,
                    DocumentSpecificSemanticIdIrdi.DocumentVersion,
                    DocumentSpecificSemanticIdIrdiV2.DocumentVersion,
                )
            )
                continue;

            const smCollection = submodelElement as SubmodelElementCollection;
            if (!smCollection.value) {
                continue;
            }

            for (const versionEl of Array.isArray(smCollection.value)
                ? smCollection.value
                : Object.values(smCollection.value)) {
                const versionSubmodelEl = versionEl as ISubmodelElement;
                // title
                if (
                    hasSemanticId(
                        versionSubmodelEl,
                        DocumentSpecificSemanticId.Title,
                        DocumentSpecificSemanticIdIrdi.Title,
                        DocumentSpecificSemanticIdIrdiV2.Title,
                    )
                ) {
                    fileViewObject.title = getTranslationText(versionSubmodelEl as MultiLanguageProperty, intl);
                    continue;
                }
                // file
                if (
                    hasSemanticId(
                        versionSubmodelEl,
                        DocumentSpecificSemanticId.DigitalFile,
                        DocumentSpecificSemanticIdIrdi.DigitalFile,
                        DocumentSpecificSemanticIdIrdiV2.DigitalFile,
                    )
                ) {
                    fileViewObject = {
                        ...fileViewObject,
                        ...(await getDigitalFile(versionSubmodelEl, submodelElement)),
                    };
                }
                // preview
                if (
                    hasSemanticId(
                        versionSubmodelEl,
                        DocumentSpecificSemanticId.PreviewFile,
                        DocumentSpecificSemanticIdIrdi.PreviewFile,
                        DocumentSpecificSemanticIdIrdiV2.PreviewFile,
                    )
                ) {
                    fileViewObject.previewImgUrl = await getPreviewImageUrl(versionSubmodelEl, submodelElement);
                }
                // organization name
                if (
                    hasSemanticId(
                        versionSubmodelEl,
                        DocumentSpecificSemanticId.OrganizationName,
                        DocumentSpecificSemanticIdIrdi.OrganizationName,
                        DocumentSpecificSemanticIdIrdiV2.OrganizationShortName,
                    )
                ) {
                    fileViewObject.organizationName = (versionSubmodelEl as Property).value || '';
                }
            }
        }

        return fileViewObject;
    }

    return (
        <DataRow title={props.submodelElement?.idShort} hasDivider={props.hasDivider}>
            {fileViewObject && (
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Box display="flex">
                        <Link href={fileViewObject.digitalFileUrl} target="_blank">
                            <StyledImageWrapper>
                                {fileViewObject.previewImgUrl ? (
                                    <Image src={fileViewObject.previewImgUrl} height={90} width={90} alt="Document" />
                                ) : fileViewObject.mimeType === 'application/pdf' ? (
                                    <PdfDocumentIcon color="primary" />
                                ) : (
                                    <InsertDriveFileOutlined color="primary" />
                                )}
                            </StyledImageWrapper>
                        </Link>
                        <Box>
                            <Typography>{fileViewObject.title}</Typography>
                            {fileViewObject.organizationName && (
                                <Typography variant="body2" color="text.secondary">
                                    {fileViewObject.organizationName}
                                </Typography>
                            )}
                            <Button
                                variant="outlined"
                                startIcon={!fileNotFound ?? <OpenInNew />}
                                sx={{ mt: 1 }}
                                href={fileViewObject.digitalFileUrl}
                                target="_blank"
                                disabled={fileNotFound}
                            >
                                {fileNotFound ? (
                                    <FormattedMessage {...messages.mnestix.fileNotFound} />
                                ) : (
                                    <FormattedMessage {...messages.mnestix.open} />
                                )}
                            </Button>
                        </Box>
                    </Box>
                    <IconButton onClick={() => handleDetailsClick()} sx={{ ml: 1 }}>
                        <InfoOutlined />
                    </IconButton>
                </Box>
            )}
            <DocumentDetailsDialog
                open={detailsModalOpen}
                handleClose={() => handleDetailsModalClose()}
                document={props.submodelElement as SubmodelElementCollection}
            />
        </DataRow>
    );
}
