import { alpha, Box, Dialog, DialogProps, Paper, styled, Typography } from '@mui/material';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { ChooseTemplateItem } from './ChooseTemplateItem';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';

interface ChooseTemplateDialogProps extends DialogProps {
    defaultTemplates?: Submodel[];
    isLoading?: boolean;
    handleTemplateClick?: (template?: Submodel) => void;
    onClose: () => void;
}

const StyledLoadingOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.common.white, 0.7),
}));

export function ChooseTemplateDialog(props: ChooseTemplateDialogProps) {
    const locale = useLocale();
    const t = useTranslations('pages.templates');
    const { defaultTemplates, isLoading, handleTemplateClick, ...other } = props;
    return (
        <Dialog {...other} maxWidth="md" data-testid="choose-template-dialog">
            {isLoading && (
                <StyledLoadingOverlay>
                    <CenteredLoadingSpinner />
                </StyledLoadingOverlay>
            )}
            <DialogCloseButton handleClose={props.onClose} />
            <Paper sx={{ p: 2 }}>
                <Typography variant="h3" align="center">
                    {t('chooseAStartingPoint')}
                </Typography>
                <Box sx={{ my: 2 }}>
                    {defaultTemplates?.map((template, i) => {
                        return (
                            <ChooseTemplateItem
                                key={i}
                                data-testid={`choose-template-item-${i}`}
                                label={`${template.idShort} V${template.administration?.version ?? '-'}.${
                                    template.administration?.revision ?? '-'
                                }`}
                                subLabel={template.semanticId?.keys?.[0]?.value}
                                description={template.description ? getTranslationText(template.description, locale) : undefined}
                                onClick={() => handleTemplateClick && handleTemplateClick(template)}
                            />
                        );
                    })}
                    <ChooseTemplateItem
                        data-testid="choose-template-item-empty"
                        label={t('emptyCustom')}
                        subLabel={t('emptyCustomDescription')}
                        hasDivider={false}
                        onClick={() => handleTemplateClick && handleTemplateClick()}
                    />
                </Box>
            </Paper>
        </Dialog>
    );
}
