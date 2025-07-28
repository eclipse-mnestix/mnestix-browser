import { Box, Button, Link, styled, Typography, Skeleton } from '@mui/material';
import { ModelFile } from 'lib/api/aas/models';
import { useState } from 'react';
import { getSanitizedHref } from 'lib/util/HrefUtil';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAttachmentFromSubmodelElement } from 'lib/services/repository-access/repositorySearchActions';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useTranslations } from 'next-intl';
import ImagePreviewDialog from './ImagePreviewDialog';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useSession } from 'next-auth/react';
import { getFileUrl } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentUtils';

const StyledFileImg = styled('img')(() => ({
    objectFit: 'contain',
    objectPosition: 'left top',
    maxWidth: '100%',
    maxHeight: '100%',
}));

type FileComponentProps = {
    readonly file: ModelFile;
    readonly submodelId?: string;
    readonly submodelElementPath?: string;
    readonly withPreviewDialog?: boolean;
    readonly repositoryUrl?: string;
};

export function FileComponent({ file, submodelId, submodelElementPath, withPreviewDialog = true, repositoryUrl }: FileComponentProps) {
    const [image, setImage] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [, setLoadError] = useState<boolean>(false);
    const { aasOriginUrl } = useCurrentAasContext();
    const { data: session } = useSession();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<ModelFile | null>(null);
    const [previewPath, setPreviewPath] = useState<string | null>(null);

    const handleOpenPreview = (file: ModelFile, path: string) => {
        setPreviewFile(file);
        setPreviewPath(path);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };
    const t = useTranslations('pages.aasViewer');

    async function getImage() {
        try {
            setLoading(true);
            setLoadError(false);

            if (file.value && file.contentType?.startsWith('image')) {
                if (isValidUrl(file.value)) {
                    setImage(file.value);
                } else if (submodelId && submodelElementPath) {
                    const imageResponse = await getAttachmentFromSubmodelElement(
                        submodelId,
                        submodelElementPath,
                        aasOriginUrl ?? undefined,
                    );
                    if (!imageResponse.isSuccess) {
                        console.error('Image not found' + imageResponse.message);
                        setLoadError(true);
                    } else {
                        const image = mapFileDtoToBlob(imageResponse.result);
                        setImage(URL.createObjectURL(image));
                    }
                }
            } else {
                // Not an image, set loading to false and don't attempt to load
                setLoadError(true);
            }
        } catch (error) {
            console.error('Error loading image:', error);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    }

    async function resolveFileUrl() {
        if (!file.value) {
            setFileUrl(null);
            return;
        }

        if (isValidUrl(file.value)) {
            setFileUrl(file.value);
        } else {
            const repoUrl = repositoryUrl || aasOriginUrl;
            if (repoUrl && submodelId && submodelElementPath) {
                const attachmentUrl = `${repoUrl}/submodels/${encodeURIComponent(btoa(submodelId))}/submodel-elements/${submodelElementPath}/attachment`;
                try {
                    const resolvedUrl = await getFileUrl(attachmentUrl, session?.accessToken, repoUrl);
                    setFileUrl(resolvedUrl || attachmentUrl);
                } catch (error) {
                    console.error('Error resolving file URL:', error);
                    setFileUrl(attachmentUrl);
                }
            } else {
                setFileUrl(getSanitizedHref(file.value));
            }
        }
    }

    useAsyncEffect(async () => {
        await getImage();
        await resolveFileUrl();
    }, [file.value, session?.accessToken, repositoryUrl, aasOriginUrl, submodelId, submodelElementPath]);

    if (!file) {
        return <></>;
    }

    // Show loading state when loading is true
    if (loading) {
        return (
            <Box
                sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Skeleton variant="rectangular" width="100%" height={'200'} />
            </Box>
        );
    }

    // Show image if available
    if (image) {
        if (withPreviewDialog) {
            return (
                <>
                    <Button
                        onClick={() => handleOpenPreview(file, submodelElementPath || '')}
                        sx={{ height: '100%', width: 'auto', p: 0 }}
                    >
                        <StyledFileImg src={image} />
                    </Button>

                    <ImagePreviewDialog
                        open={previewOpen}
                        onClose={handleClosePreview}
                        file={previewFile}
                        submodelId={submodelId}
                        submodelElementPath={previewPath}
                    />
                </>
            );
        } else {
            return <StyledFileImg src={image} />;
        }
    }

    return fileUrl ? (
        <Link href={fileUrl} target="_blank">
            <Typography>{file.value?.toString()}</Typography>
        </Link>
    ) : (
        <Typography>{t('labels.notAvailable')}</Typography>
    );
}