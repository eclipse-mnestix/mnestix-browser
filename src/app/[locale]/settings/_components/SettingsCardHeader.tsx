import { CardHeading } from 'components/basics/CardHeading';
import { useTranslations } from 'next-intl';
import { Box, Button } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export type SettingsCardHeaderProps = {
    readonly onCancel: () => void;
    readonly onEdit: () => void;
    readonly onSubmit: () => void;
    readonly title: React.ReactNode;
    readonly subtitle: React.ReactNode;
    readonly isEditMode: boolean;
};

export function SettingsCardHeader(props: SettingsCardHeaderProps) {
    const t = useTranslations('pages.settings');
    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" data-testid="settings-card-header">
            <CardHeading title={props.title} subtitle={props.subtitle} />
            <Box display="flex" gap={2} alignContent="center" flexWrap="wrap">
                {props.isEditMode ? (
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={() => props.onCancel()}
                            data-testid="settings-cancel-button"
                        >
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CheckIcon />}
                            onClick={props.onSubmit}
                            data-testid="settings-save-button"
                        >
                            {t('actions.saveButton')}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => props.onEdit()}
                        data-testid="settings-edit-button"
                    >
                        {t('actions.editButton')}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
