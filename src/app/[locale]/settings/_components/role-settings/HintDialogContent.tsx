import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslations } from 'use-intl';

export function CreateHint({ onClose }: { onClose: () => void }) {
    const t = useTranslations('pages.settings.rules.createRule.hint');

    return (
        <>
            <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                {t('title')}
            </Typography>
            <DialogContent style={{ padding: '40px' }}>
                <Typography variant="body1" color="text.secondary">
                    {t('text')}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: '1em' }}>
                <Button startIcon={<CheckIcon />} variant="contained" onClick={onClose}>
                    {t('acknowledge')}
                </Button>
            </DialogActions>
        </>
    );
}