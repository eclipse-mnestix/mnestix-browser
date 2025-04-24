import { Box, styled, Typography } from '@mui/material';
import { File, Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { useState } from 'react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { isValidUrl } from 'lib/util/UrlUtil';
import { getAttachmentFromSubmodelElement } from 'lib/services/repository-access/repositorySearchActions';
import { useAasOriginSourceState } from 'components/contexts/CurrentAasContext';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

type SingleMarkingsComponentProps = {
    readonly file?: File;
    readonly name?: Property;
    readonly additionalText?: Property;
    readonly submodelId?: string;
    readonly idShortPath?: string;
    readonly rowDisplay?: boolean;
};

const StyledFileImg = styled('img')(({ theme }) => ({
    display: 'block',
    objectFit: 'scale-down',
    objectPosition: 'center',
    width: '100%',
    height: '100%',
    aspectRatio: '1',
    padding: theme.spacing(1),
}));



export function SingleMarkingsComponent(props: SingleMarkingsComponentProps) {
    const { file, name, additionalText, submodelId, idShortPath } = props;
    const [markingImage, setMarkingImage] = useState<string>();
    const [aasOriginUrl] = useAasOriginSourceState();


    const StyledMarkingImageWrapper = styled(Box)(() => ({
        maxWidth: props.rowDisplay ? '60px' : 'auto',
        minWidth: props.rowDisplay ? '60px' : '80px',
        minHeight: props.rowDisplay ? '60px' : '80px',
        display: 'flex',
        flexDirection: 'column',
    }));

    const StyledMarkingContainer = styled(Box)(() => ({
        maxWidth: props.rowDisplay ? '200px' : 'calc(25% - 15px)',
        display: 'flex',
        flexDirection: props.rowDisplay ? 'row' : 'column',
        '@media(max-width: 1120px)': !props.rowDisplay ? { width: 'calc(50% - 10px)' } : undefined,
    }));

    useAsyncEffect(async () => {
        if (!isValidUrl(file!.value)) {
            const fileIdShort = idShortPath + '.' + file?.idShort;
            const imageResponse = await getAttachmentFromSubmodelElement(
                submodelId!,
                fileIdShort,
                aasOriginUrl ?? undefined,
            );
            if (!imageResponse.isSuccess) {
                console.error('Image not found for file ID: ' + fileIdShort);
            } else {
                const image = mapFileDtoToBlob(imageResponse.result);
                setMarkingImage(URL.createObjectURL(image));
            }
        } else {
            if (file?.value) setMarkingImage(file.value);
        }
    }, [props.file]); return (
        !!file && (
            <StyledMarkingContainer>
                <StyledMarkingImageWrapper sx={{ boxShadow: 2 }}>

                    <StyledFileImg src={markingImage} />

                    {/* TODO get this value from concept description if there is only an IRDI? */}
                    {(name?.value === '0173-1#07-DAA603#004') && (
                        <Box sx={{ backgroundColor: 'grey.200', p: 0.5, flexGrow: '0' }}>
                            <Typography variant="body2" color="text.secondary">
                                CE
                            </Typography>
                        </Box>
                    )}

                </StyledMarkingImageWrapper>
                {(!!name || !!additionalText) && (
                    <Box sx={{ p: 1, flexGrow: '0' }}
                    >
                        {!!name && <Typography>{name.value}</Typography>}
                        {!!additionalText && (
                            <Typography variant="body2" color="text.secondary">
                                {additionalText.value}
                            </Typography>)}
                    </Box>
                )}
            </StyledMarkingContainer>
        )
    );
}
