import { Box, Checkbox, TableCell, Typography } from '@mui/material';
import { useAasOriginSourceState, useAasState } from 'components/contexts/CurrentAasContext';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { ImageWithFallback } from 'components/basics/StyledImageWithFallBack';
import PictureTableCell from 'components/basics/listBasics/PictureTableCell';
import { ArrowForward } from '@mui/icons-material';
import { RoundedIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getThumbnailFromShell } from 'lib/services/repository-access/repositorySearchActions';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useState } from 'react';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useLocale, useTranslations } from 'next-intl';
import { encodeBase64 } from 'lib/util/Base64Util';
import useSWR from 'swr';
import { SearchResponseEntry } from 'lib/api/graphql/catalogQueries';

type AasTableRowProps = {
    repositoryUrl: string;
    aasListEntry: SearchResponseEntry;
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
export const ProductListTableRow = (props: AasTableRowProps) => {
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
    const t = useTranslations('pages.aasList');
    const locale = useLocale();
    const { data: thumbnailResponse } = useSWR(
        [aasListEntry.id, repositoryUrl],
        async ([aasId, repositoryUrl]) => await getThumbnailFromShell(aasId, repositoryUrl),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    );

    const navigateToAas = (aasId: string) => {
        setAas(null);
        setAasOriginUrl(null);
        const baseUrl = window.location.origin;
        const repoUrl = repositoryUrl ? `?repoUrl=${encodeURIComponent(repositoryUrl)}` : '';

        window.open(baseUrl + `/product/${encodeBase64(aasId)}${repoUrl}`, '_blank');
    };

    const translateListText = (property: {language: string, text: string}[] | undefined) => {
        if (!property) return '';
        // try the current locale first
        const translatedString = property.find((prop) => prop.language === locale);
        // if there is any locale, better show it instead of nothing
        const fallback = property[0] ? Object.values(property[0])[0] : '';
        return translatedString ? translatedString.text : fallback;
    };

    useAsyncEffect(async () => {
        if (!aasListEntry.thumbnailUrl) {
            return;
        }

        if (isValidUrl(aasListEntry.thumbnailUrl)) {
            setThumbnailUrl(aasListEntry.thumbnailUrl);
        } else if (aasListEntry.id && repositoryUrl) {
            if (thumbnailResponse?.isSuccess) {
                const blob = mapFileDtoToBlob(thumbnailResponse?.result);
                const blobUrl = URL.createObjectURL(blob);
                setThumbnailUrl(blobUrl);
            }
        }
    }, [aasListEntry.thumbnailUrl, thumbnailResponse]);

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
                            if (checkBoxDisabled(aasListEntry.id)) showMaxElementsNotification();
                        }}
                    >
                        <Checkbox
                            checked={!!(selectedAasList && selectedAasList.some((el) => el == aasListEntry.id))}
                            disabled={checkBoxDisabled(aasListEntry.id)}
                            onChange={(evt) => updateSelectedAasList(evt.target.checked, aasListEntry.id)}
                            data-testid="list-checkbox"
                            title={t('titleComparisonAddButton')}
                        />
                    </Box>
                </TableCell>
            )}
            <PictureTableCell>
                <ImageWithFallback
                    src={thumbnailUrl}
                    alt={'Thumbnail image for: ' + aasListEntry.id}
                    size={100}
                    onClickHandler={() => navigateToAas(aasListEntry.id)}
                />
            </PictureTableCell>
            <TableCell data-testid="list-manufacturer-name" align="left" sx={tableBodyText}>
                {aasListEntry.manufacturerName ? translateListText(aasListEntry.manufacturerName.mlValues) : ''}
            </TableCell>
            <TableCell data-testid="list-product-designation" align="left" sx={tableBodyText}>
                {aasListEntry.productDesignation ? translateListText(aasListEntry.productDesignation.mlValues) : ''}
            </TableCell>
            <TableCell align="center">
                <RoundedIconButton
                    endIcon={<ArrowForward />}
                    onClick={() => navigateToAas(aasListEntry.id)}
                    title={t('buttonTooltip')}
                    data-testid="list-to-detailview-button"
                />
            </TableCell>
        </>
    );
};
