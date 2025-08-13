import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

interface InfrastructureDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export function InfrastructureDeleteDialog({ open, onClose, onDelete }: InfrastructureDeleteDialogProps) {
    const t = useTranslations('pages.settings.infrastructure');

    function handleDelete() {
        onDelete();
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('form.deleteDialogTitle')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('form.deleteConfirm')}</DialogContentText>
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {t('form.deleteWarning')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('form.cancel')}
                </Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                    {t('form.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
