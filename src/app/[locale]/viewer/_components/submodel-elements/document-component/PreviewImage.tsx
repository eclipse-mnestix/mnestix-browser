import { PdfDocumentIcon } from 'components/custom-icons/PdfDocumentIcon';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { Box, styled } from '@mui/material';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';

const StyledImageWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    minHeight: 90,
    minWidth: 90,
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

export const PreviewImage = (props: { previewImgUrl: string; mimeType: string; repositoryUrl?: string }) => {
    const [imageError, setImageError] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const { data: session } = useSession();

    useAsyncEffect(async () => {
        const url = await getImageUrl();
        setImageUrl(url);
    }, [props.previewImgUrl, session]);

    const handleImageError = () => {
        setImageError(true);
    };

    const getImageUrl = async () => {
        if (!session?.accessToken || !props.repositoryUrl || !props.previewImgUrl.startsWith(props.repositoryUrl)) {
            return props.previewImgUrl;
        }

        try {
            const response = await fetch(props.previewImgUrl, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            const blob = await response.blob();
            return window.URL.createObjectURL(blob);
        } catch (e) {
            console.warn(`Failed to open file with auth: ${e}`);
            return props.previewImgUrl;
        }
    };

    return (
        <StyledImageWrapper>
            {!imageError && imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo can be an arbitrary url which conflicts with https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
                <img
                    src={imageUrl}
                    alt="File Preview"
                    onError={handleImageError}
                    data-testid="document-preview-image"
                />
            ) : props?.mimeType === 'application/pdf' ? (
                <PdfDocumentIcon color="primary" />
            ) : (
                <InsertDriveFileOutlined color="primary" />
            )}
        </StyledImageWrapper>
    );
};
