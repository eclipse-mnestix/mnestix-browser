import { PdfDocumentIcon } from 'components/custom-icons/PdfDocumentIcon';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { Box, styled } from '@mui/material';

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

export const PreviewImage = (props: {previewImgUrl: string, mimeType: string, imageError: boolean, handleImageError: () => void}) => {
    return (
        <StyledImageWrapper>
            {!props.imageError && props.previewImgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo can be an arbitrary url which conflicts with https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
                <img
                    src={props.previewImgUrl}
                    height={90}
                    width={90}
                    alt="File Preview"
                    onError={props.handleImageError}
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
