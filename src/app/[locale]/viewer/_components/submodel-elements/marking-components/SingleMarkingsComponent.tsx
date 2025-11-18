import { Box, styled, Typography } from '@mui/material';
import { ModelFile, Property } from 'lib/api/aas/models';
import { useState } from 'react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { isValidUrl } from 'lib/util/UrlUtil';
import { getAttachmentFromSubmodelElement } from 'lib/services/submodel-repository-service/submodelRepositoryActions';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useSubmodelRepositoryUrl } from 'app/[locale]/viewer/_components/submodel/SubmodelRepositoryUrlProvider';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

type SingleMarkingsComponentProps = {
    readonly file?: ModelFile;
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
    const { file, name, additionalText, submodelId, idShortPath, rowDisplay } = props;
    const [markingImage, setMarkingImage] = useState<string>();
    const submodelRepositoryUrl = useSubmodelRepositoryUrl();
    const currentAASContext = useCurrentAasContext();

    useAsyncEffect(async () => {
        if (!isValidUrl(file!.value) && submodelRepositoryUrl) {
            const fileIdShort = idShortPath + '.' + file?.idShort;
            const imageResponse = await getAttachmentFromSubmodelElement(submodelId!, fileIdShort, {
                url: submodelRepositoryUrl,
                infrastructureName: currentAASContext.infrastructureName || '',
            });
            if (!imageResponse.isSuccess) {
                console.error('Image not found for file ID: ' + fileIdShort);
            } else {
                const image = mapFileDtoToBlob(imageResponse.result);
                setMarkingImage(URL.createObjectURL(image));
            }
        } else {
            if (file?.value) setMarkingImage(file.value);
        }
    }, [props.file]);

    return (
        !!file && (
            <Box
                sx={{
                    maxWidth: rowDisplay ? '200px' : 'calc(25% - 15px)',
                    display: 'flex',
                    flexDirection: rowDisplay ? 'row' : 'column',
                    '@media(max-width: 1120px)': !rowDisplay ? { width: 'calc(50% - 10px)' } : undefined,
                }}
            >
                <Box
                    sx={{
                        maxWidth: rowDisplay ? '4rem' : 'auto',
                        minWidth: rowDisplay ? '4rem' : '5rem',
                        minHeight: rowDisplay ? '4rem' : '5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 2,
                    }}
                >
                    <StyledFileImg src={markingImage} />

                    {/* TODO get this value from concept description if there is only an IRDI? */}
                    {name?.value === '0173-1#07-DAA603#004' && (
                        <Box sx={{ backgroundColor: 'grey.200', p: 0.5, flexGrow: '0' }}>
                            <Typography variant="body2" color="text.secondary">
                                CE
                            </Typography>
                        </Box>
                    )}
                </Box>
                {(!!name || !!additionalText) && (
                    <Box sx={{ p: 1, flexGrow: '0' }}>
                        {!!name && <Typography>{name.value}</Typography>}
                        {!!additionalText && (
                            <Typography variant="body2" color="text.secondary">
                                {additionalText.value}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        )
    );
}
