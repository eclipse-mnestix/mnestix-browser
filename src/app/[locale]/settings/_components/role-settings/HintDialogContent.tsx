import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslations } from 'next-intl';

export function CreateHint({ onClose }: { onClose: () => void }) {
    const t = useTranslations('pages.settings.rules.createRule.hint');

    return (
        <>
            <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                {t('title')}
            </Typography>
            <DialogContent>
                <Typography variant="body1" color="text.secondary">
                    {t('text')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<CheckIcon />}
                    variant="contained"
                    onClick={onClose}
                    data-testid="role-create-hint-acknowledge"
                >
                    {t('acknowledge')}
                </Button>
            </DialogActions>
        </>
    );
}

export function DeleteHint({ onClose }: { onClose: () => void }) {
    const t = useTranslations('pages.settings.rules.deleteRule.hint');

    return (
        <>
            <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                {t('title')}
            </Typography>
            <DialogContent>
                <Typography variant="body1" color="text.secondary">
                    {t('text')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<CheckIcon />}
                    variant="contained"
                    onClick={onClose}
                    data-testid="role-delete-hint-acknowledge"
                >
                    {t('acknowledge')}
                </Button>
            </DialogActions>
        </>
    );
}
