import { Box, Checkbox, Skeleton, TableCell, Typography } from '@mui/material';
import { useAasOriginSourceState, useAasState } from 'components/contexts/CurrentAasContext';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import { tooltipText } from 'lib/util/ToolTipText';
import PictureTableCell from 'components/basics/listBasics/PictureTableCell';
import { ArrowForward } from '@mui/icons-material';
import { RoundedIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getThumbnailFromShell } from 'lib/services/repository-access/repositorySearchActions';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useState } from 'react';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ListEntityDto, NameplateValuesDto } from 'lib/services/list-service/ListService';
import { getNameplateValuesForAAS } from 'lib/services/list-service/aasListApiActions';
import { MultiLanguageValueOnly } from 'lib/api/basyx-v3/types';
import { useLocale, useTranslations } from 'next-intl';
import { encodeBase64 } from 'lib/util/Base64Util';

type AasTableRowProps = {
    repositoryUrl: string;
    aasListEntry: ListEntityDto;
    comparisonFeatureFlag: boolean | undefined;
    checkBoxDisabled: (aasId: string | undefined) => boolean | undefined;
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
};

const tableBodyText = {
    lineHeight: '150%',
    fontSize: '14px',
    color: 'text.primary',
    wordWrap: 'break-word',
};
export const AasListTableRow = (props: AasTableRowProps) => {
    const {
        repositoryUrl,
        aasListEntry,
        comparisonFeatureFlag,
        checkBoxDisabled,
        selectedAasList,
        updateSelectedAasList,
    } = props;
    const [, setAas] = useAasState();
    const [, setAasOriginUrl] = useAasOriginSourceState();
    const notificationSpawner = useNotificationSpawner();
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [nameplateData, setNameplateData] = useState<NameplateValuesDto>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const t = useTranslations('aas-list');
    const locale = useLocale();

    const navigateToAas = (listEntry: ListEntityDto) => {
        setAas(null);
        setAasOriginUrl(null);
        const baseUrl = window.location.origin;
        window.open(baseUrl + `/viewer/${encodeBase64(listEntry.aasId)}`, '_blank');
    };

    const translateListText = (property: MultiLanguageValueOnly | undefined) => {
        if (!property) return '';
        // try the current locale first
        const translatedString = property.find((prop) => prop[locale]);
        // if there is any locale, better show it instead of nothing
        const fallback = property[0] ? Object.values(property[0])[0] : '';
        return translatedString ? translatedString[locale] : fallback;
    };

    useAsyncEffect(async () => {
        if (!aasListEntry.thumbnail) {
            return;
        }

        if (isValidUrl(aasListEntry.thumbnail)) {
            setThumbnailUrl(aasListEntry.thumbnail);
        } else if (aasListEntry.aasId && repositoryUrl) {
            const response = await getThumbnailFromShell(aasListEntry.aasId, repositoryUrl);
            if (response.isSuccess) {
                const blob = mapFileDtoToBlob(response.result);
                const blobUrl = URL.createObjectURL(blob);
                setThumbnailUrl(blobUrl);
            }
        }
    }, [aasListEntry.thumbnail]);

    useAsyncEffect(async () => {
        if (!aasListEntry.aasId) return;
        setIsLoading(true);

        const nameplate = await getNameplateValuesForAAS(repositoryUrl, aasListEntry.aasId);

        if (!nameplate.success) {
            console.log(nameplate.error);
        } else {
            setNameplateData(nameplate);
        }

        setIsLoading(false);
    }, [aasListEntry.aasId]);

    const showMaxElementsNotification = () => {
        notificationSpawner.spawn({
            message: (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {t('maxElementsWarning')}
                </Typography>
            ),
            severity: 'warning',
        });
    };

    return (
        <>
            {comparisonFeatureFlag && (
                <TableCell align="center" sx={tableBodyText}>
                    <Box
                        component="span"
                        onClick={() => {
                            if (checkBoxDisabled(aasListEntry.aasId)) showMaxElementsNotification();
                        }}
                    >
                        <Checkbox
                            checked={!!(selectedAasList && selectedAasList.some((el) => el == aasListEntry.aasId))}
                            disabled={checkBoxDisabled(aasListEntry.aasId)}
                            onChange={(evt) => updateSelectedAasList(evt.target.checked, aasListEntry.aasId)}
                            data-testid="list-checkbox"
                            title={t('titleComparisonAddButton')}
                        />
                    </Box>
                </TableCell>
            )}
            <PictureTableCell>
                <ImageWithFallback
                    src={thumbnailUrl}
                    alt={'Thumbnail image for: ' + aasListEntry.assetId}
                    size={100}
                    onClickHandler={() => navigateToAas(aasListEntry)}
                />
            </PictureTableCell>
            <TableCell data-testid="list-manufacturer-name" align="left" sx={tableBodyText}>
                {!isLoading ? (
                    nameplateData?.manufacturerName && translateListText(nameplateData.manufacturerName)
                ) : (
                    <Skeleton variant="text" width="80%" height={26} />
                )}
            </TableCell>
            <TableCell data-testid="list-product-designation" align="left" sx={tableBodyText}>
                {!isLoading ? (
                    nameplateData && tooltipText(translateListText(nameplateData.manufacturerProductDesignation), 80)
                ) : (
                    <Skeleton variant="text" width="80%" height={26} />
                )}
            </TableCell>
            <TableCell data-testid="list-assetId" align="left" sx={tableBodyText}>
                <Typography sx={{ all: 'unset' }}>{tooltipText(aasListEntry.assetId, 35)}</Typography>
            </TableCell>
            <TableCell data-testid="list-aasId" align="left" sx={tableBodyText}>
                <Typography sx={{ all: 'unset' }}>{tooltipText(aasListEntry.aasId, 35)}</Typography>
            </TableCell>
            <TableCell align="center">
                <RoundedIconButton
                    endIcon={<ArrowForward />}
                    onClick={() => navigateToAas(aasListEntry)}
                    title={t('titleViewAASButton')}
                    data-testid="list-to-detailview-button"
                />
            </TableCell>
        </>
    );
};
