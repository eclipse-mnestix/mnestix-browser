import { PdfDocumentIcon } from 'components/custom-icons/PdfDocumentIcon';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { Box, styled } from '@mui/material';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getFileUrl } from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentUtils';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

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
    const currentAASContext = useCurrentAasContext();

    useAsyncEffect(async () => {
        const url = await getFileUrl(props.previewImgUrl, session?.accessToken, {
            url: props.repositoryUrl ?? '',
            id: 'unknown',
            infrastructureName: currentAASContext.infrastructureName || '',
        });
        setImageUrl(url);
    }, [props.previewImgUrl, session?.accessToken, props.repositoryUrl]);

    const handleImageError = () => {
        setImageError(true);
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
