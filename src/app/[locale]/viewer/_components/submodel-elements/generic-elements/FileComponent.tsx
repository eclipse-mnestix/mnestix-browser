import { Box, Button, Link, styled, Typography, Skeleton } from '@mui/material';
import { File } from '@aas-core-works/aas-core3.0-typescript/types';
import { useState } from 'react';
import { getSanitizedHref } from 'lib/util/HrefUtil';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAttachmentFromSubmodelElement } from 'lib/services/repository-access/repositorySearchActions';
import { useAasOriginSourceState } from 'components/contexts/CurrentAasContext';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useTranslations } from 'next-intl';
import ImagePreviewDialog from './ImagePreviewDialog';

const StyledFileImg = styled('img')(() => ({
    objectFit: 'contain',
    objectPosition: 'left top',
    maxWidth: '100%',
    maxHeight: '100%',
}));

type FileComponentProps = {
    readonly file: File;
    readonly submodelId?: string;
    readonly submodelElementPath?: string;
    readonly withPreviewDialog?: boolean;
};

export function FileComponent({ file, submodelId, submodelElementPath, withPreviewDialog = true }: FileComponentProps) {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<boolean>(false);
    const [aasOriginUrl] = useAasOriginSourceState();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewPath, setPreviewPath] = useState<string | null>(null);

    const handleOpenPreview = (file: File, path: string) => {
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

            if (file.contentType?.startsWith('image')) {
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

    useAsyncEffect(async () => {
        await getImage();
    }, []);

    if (!file) {
        return <></>;
    }

    // Show loading state when loading is true
    if (loading) {
        return (
            <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            return <StyledFileImg src={image} />
        }
    }

    // Only show link or not available message if image failed to load or isn't an image
    return file.value ? (
        <Link href={getSanitizedHref(file.value?.toString())} target="_blank">
            <Typography>{file.value?.toString()}</Typography>
        </Link>
    ) : (
        <Typography>
            {t('labels.notAvailable')}
        </Typography>

    );
}
