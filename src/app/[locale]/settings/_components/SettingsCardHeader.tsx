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
    const t = useTranslations();
    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
            <CardHeading title={props.title} subtitle={props.subtitle} />
            <Box display="flex" gap={2} alignContent="center" flexWrap="wrap">
                {props.isEditMode ? (
                    <>
                        <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => props.onCancel()}>
                            {t('common.actions.cancel')}
                        </Button>
                        <Button variant="contained" startIcon={<CheckIcon />} onClick={props.onSubmit}>
                            {t('pages.settings.connections.saveButton')}
                        </Button>
                    </>
                ) : (
                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => props.onEdit()}>
                        {t('pages.settings.connections.editButton')}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
