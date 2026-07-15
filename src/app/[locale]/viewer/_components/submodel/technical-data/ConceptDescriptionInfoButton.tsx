import React, { useState } from 'react';
import { Box, Dialog, DialogContent, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { useLocale, useTranslations } from 'next-intl';
import { ConceptDescription } from 'lib/api/aas/models';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { CopyButton } from 'components/basics/CopyButton';
import { getDataSpecContentFromConceptDescription } from './ConceptDescriptionHelper';

/**
 * Renders an info icon for a submodel element that has a concept description loaded.
 * Clicking the icon opens a dialog displaying the details of the concept description,
 * such as the semantic ID (e.g. from ECLASS), preferred name, definition and unit.
 */
export function ConceptDescriptionInfoButton(props: { conceptDescription: ConceptDescription }) {
    const t = useTranslations('pages.aasViewer.submodels.conceptDescription');
    const locale = useLocale();
    const [open, setOpen] = useState(false);

    const dataSpecContent = getDataSpecContentFromConceptDescription(props.conceptDescription);

    const preferredName = dataSpecContent?.preferredName
        ? getTranslationText(dataSpecContent.preferredName, locale)
        : '';
    const shortName = dataSpecContent?.shortName ? getTranslationText(dataSpecContent.shortName, locale) : '';
    const definition = dataSpecContent?.definition ? getTranslationText(dataSpecContent.definition, locale) : '';
    const description = props.conceptDescription.description
        ? getTranslationText(props.conceptDescription.description, locale)
        : '';
    const unit = dataSpecContent?.unit ?? '';
    const symbol = dataSpecContent?.symbol ?? '';
    const dataType = dataSpecContent?.dataType ?? '';
    const sourceOfDefinition = dataSpecContent?.sourceOfDefinition ?? '';

    const title = preferredName || props.conceptDescription.idShort || t('title');

    function renderInfoRow(label: string, value: string, copyValue?: string) {
        if (!value.trim()) {
            return null;
        }
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ wordBreak: 'break-word' }}>{value}</Typography>
                    {copyValue && <CopyButton value={copyValue} dataTestId="concept-description-semantic-id-copy" />}
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Tooltip title={t('showInfo')}>
                <IconButton
                    onClick={() => setOpen(true)}
                    size="small"
                    sx={{ ml: 1, alignSelf: 'center' }}
                    aria-label={t('showInfo')}
                    data-testid="concept-description-info-button"
                >
                    <InfoOutlined fontSize="small" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth={true}>
                <DialogCloseButton handleClose={() => setOpen(false)} dataTestId="concept-description-dialog-close" />
                <DialogContent style={{ padding: '2em' }}>
                    <Typography variant="h3" color="primary" sx={{ mb: 2, pr: 3, wordBreak: 'break-word' }}>
                        {title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {renderInfoRow(t('semanticId'), props.conceptDescription.id, props.conceptDescription.id)}
                        <Divider />
                        {renderInfoRow(t('preferredName'), preferredName)}
                        {renderInfoRow(t('shortName'), shortName)}
                        {renderInfoRow(t('definition'), definition)}
                        {renderInfoRow(t('description'), description)}
                        {renderInfoRow(t('unit'), unit)}
                        {renderInfoRow(t('symbol'), symbol)}
                        {renderInfoRow(t('dataType'), dataType)}
                        {renderInfoRow(t('sourceOfDefinition'), sourceOfDefinition)}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
