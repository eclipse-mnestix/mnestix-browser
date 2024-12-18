import { Box, Checkbox, TableCell, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useRouter } from 'next/navigation';
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
    fontSize: '16px',
    color: 'text.primary',
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
    const navigate = useRouter();
    const intl = useIntl();
    const [, setAas] = useAasState();
    const [, setAasOriginUrl] = useAasOriginSourceState();
    const notificationSpawner = useNotificationSpawner();
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [nameplateData, setNameplateData] = useState<NameplateValuesDto>();
    // const t = useTranslations('aas-list');

    const navigateToAas = (listEntry: ListEntityDto) => {
        setAas(null);
        setAasOriginUrl(null);
        if (listEntry.aasId) navigate.push(`/viewer/${encodeBase64(listEntry.aasId)}`);
    };

    const translateListText = (property: MultiLanguageValueOnly | undefined) => {
        if (!property) return '';
        // try the current locale first
        const translatedString = property.find((prop) => prop[intl.locale]);
        // if there is any locale, better show it instead of nothing
        const fallback = property[0] ? Object.values(property[0])[0] : '';
        return translatedString ? translatedString[intl.locale] : fallback;
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

        const nameplate = await getNameplateValuesForAAS(repositoryUrl, aasListEntry.aasId);

        if (!nameplate.success) {
            console.log(nameplate.error);
        } else {
            setNameplateData(nameplate);
        }
    }, [aasListEntry.aasId]);

    const showMaxElementsNotification = () => {
        notificationSpawner.spawn({
            message: (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    <FormattedMessage {...messages.mnestix.aasList.maxElementsWarning} />
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
                            title={intl.formatMessage(messages.mnestix.aasList.titleComparisonAddButton)}
                        />
                    </Box>
                </TableCell>
            )}
            <PictureTableCell title={intl.formatMessage(messages.mnestix.aasList.titleViewAASButton)}>
                <ImageWithFallback src={thumbnailUrl} alt={'Thumbnail image for: ' + aasListEntry.assetId} size={88} />
            </PictureTableCell>
            <TableCell align="left" sx={tableBodyText}>
                {nameplateData && translateListText(nameplateData.manufacturerName)}
            </TableCell>
            <TableCell align="left" sx={tableBodyText}>
                {nameplateData && tooltipText(translateListText(nameplateData.manufacturerProductDesignation), 80)}
            </TableCell>
            <TableCell align="left" sx={tableBodyText}>
                <Typography>{tooltipText(aasListEntry.assetId, 35)}</Typography>
            </TableCell>
            <TableCell align="left" sx={tableBodyText}>
                <Typography>{tooltipText(aasListEntry.aasId, 35)}</Typography>
            </TableCell>
            <TableCell align="center">
                <RoundedIconButton
                    endIcon={<ArrowForward />}
                    onClick={() => navigateToAas(aasListEntry)}
                    title={intl.formatMessage(messages.mnestix.aasList.titleViewAASButton)}
                    data-testid="list-to-detailview-button"
                />
            </TableCell>
        </>
    );
};
