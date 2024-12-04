import { Box, Skeleton, styled } from '@mui/material';
import { useState } from 'react';
import DefaultThumbnail from 'assets/AasDefaultThumbnail.svg';

interface StyledImageProps {
    size: number;
}

const StyledImage = styled('img')<StyledImageProps>(({ size }) => ({
    height: size,
    maxWidth: size,
    width: '100%',
    objectFit: 'scale-down',
}));

type StyledImageWithFallBackProps = {
    src: string;
    alt: string;
    size: number;
    onClickHandler?: () => void;
};

export const ImageWithFallback = ({ src, alt, size, onClickHandler }: StyledImageWithFallBackProps) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const ImageContent = (
        <StyledImage
            src={src}
            onError={() => {
                setHasError(true);
            }}
            onLoad={() => {
                setLoading(false);
            }}
            alt={alt}
            size={size}
            onClick={() => onClickHandler?.call(this)}
            style={{
                cursor: onClickHandler ? 'pointer' : 'auto',
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: size,
                width: size,
            }}
            data-testid="image-with-fallback"
        />
    );

    const LoadingContent = (
        <Skeleton
            variant="rectangular"
            sx={{ position: 'absolute', top: '0px', left: '0px', height: size, width: size }}
            onClick={() => onClickHandler?.call(this)}
        />
    );

    const FallbackContent = (
        <DefaultThumbnail
            style={{
                maxHeight: size,
                maxWidth: size,
                width: '100%',
                cursor: onClickHandler ? 'pointer' : 'auto',
            }}
            alt={alt}
            onClick={() => onClickHandler?.call(this)}
            data-testid="default-thumbnail-image-with-fallback"
        />
    );

    return (
        <>
            {!hasError && src ? (
                <Box style={{ position: 'relative', height: size, width: '100%', maxWidth: size }}>
                    {isLoading ? <>{LoadingContent}</> : <></>}
                    {ImageContent}
                </Box>
            ) : (
                FallbackContent
            )}
        </>
    );
};
