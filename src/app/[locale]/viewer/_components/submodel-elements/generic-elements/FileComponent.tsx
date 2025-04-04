import { Box, Link, styled, Typography } from '@mui/material';
import { File } from '@aas-core-works/aas-core3.0-typescript/types';
import { useState } from 'react';
import { getSanitizedHref } from 'lib/util/HrefUtil';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAttachmentFromSubmodelElement } from 'lib/services/repository-access/repositorySearchActions';
import { useAasOriginSourceState } from 'components/contexts/CurrentAasContext';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useTranslations } from 'next-intl';

const StyledFileImg = styled('img')(() => ({
    objectFit: 'contain',
    objectPosition: 'left top',
    maxWidth: '100%',
    maxHeight: '300px',
}));

type FileComponentProps = {
    readonly file: File;
    readonly submodelId?: string;
    readonly submodelElementPath?: string;
};

export function FileComponent(props: FileComponentProps) {
    const [image, setImage] = useState<string | null>(null);
    const { file } = props;
    const [aasOriginUrl] = useAasOriginSourceState();
    const t = useTranslations('common');

    async function getImage() {
        if (file.contentType?.startsWith('image')) {
            if (isValidUrl(file.value)) {
                setImage(file.value);
            } else if (props.submodelId && props.submodelElementPath) {
                const imageResponse = await getAttachmentFromSubmodelElement(
                    props.submodelId,
                    props.submodelElementPath,
                    aasOriginUrl ?? undefined,
                );
                if (!imageResponse.isSuccess) {
                    console.error('Image not found' + imageResponse.message);
                } else {
                    const image = mapFileDtoToBlob(imageResponse.result);
                    setImage(URL.createObjectURL(image));
                }
            }
        }
    }

    useAsyncEffect(async () => {
        await getImage();
    }, []);

    if (!file) {
        return <></>;
    }

    if (image) {
        return (
            <Box>
                <StyledFileImg src={image} />
            </Box>
        );
    } else {
        return file.value ? (
            <Link href={getSanitizedHref(file.value?.toString())} target="_blank">
                <Typography>{file.value?.toString()}</Typography>
            </Link>
        ) : (
            <Typography>{t('labels.notAvailable')}</Typography>
        );
    }
}
