import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { CloudUpload, Add } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { NewDocumentData } from './useAddDocument';

type AddDocumentDialogProps = {
    open: boolean;
    onClose: () => void;
    newDocument: NewDocumentData;
    isAdding: boolean;
    addError: string;
    onUpdateField: <K extends keyof NewDocumentData>(field: K, value: NewDocumentData[K]) => void;
    onAddDocument: () => Promise<boolean>;
};

export function AddDocumentDialog(props: AddDocumentDialogProps) {
    const t = useTranslations('components.documentComponent');
    const { open, onClose, newDocument, isAdding, addError, onUpdateField, onAddDocument } = props;

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onUpdateField('file', file);
        }
    };

    const handleAdd = async () => {
        const success = await onAddDocument();
        if (success) {
            onClose();
        }
    };

    const handleClose = () => {
        if (!isAdding) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth data-testid="add-document-dialog">
            <DialogTitle>{t('addDocument')}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label={t('titleLabel')}
                        value={newDocument.title}
                        onChange={(e) => onUpdateField('title', e.target.value)}
                        required
                        disabled={isAdding}
                        data-testid="add-document-title"
                    />
                    <TextField
                        fullWidth
                        label={t('descriptionLabel')}
                        value={newDocument.description}
                        onChange={(e) => onUpdateField('description', e.target.value)}
                        multiline
                        rows={3}
                        disabled={isAdding}
                        data-testid="add-document-description"
                    />
                    <TextField
                        fullWidth
                        label={t('organizationLabel')}
                        value={newDocument.organizationShortName}
                        onChange={(e) => onUpdateField('organizationShortName', e.target.value)}
                        disabled={isAdding}
                        data-testid="add-document-organization"
                    />
                    <Box display="flex" gap={2}>
                        <TextField
                            label={t('versionLabel')}
                            value={newDocument.version}
                            onChange={(e) => onUpdateField('version', e.target.value)}
                            required
                            disabled={isAdding}
                            sx={{ flex: 1 }}
                            data-testid="add-document-version"
                        />
                        <TextField
                            label={t('languageLabel')}
                            value={newDocument.language}
                            onChange={(e) => onUpdateField('language', e.target.value)}
                            disabled={isAdding}
                            sx={{ flex: 1 }}
                            data-testid="add-document-language"
                        />
                    </Box>
                    <Box>
                        <input
                            accept="*/*"
                            style={{ display: 'none' }}
                            id="add-document-file-input"
                            type="file"
                            onChange={handleFileSelect}
                            disabled={isAdding}
                            data-testid="add-document-file-input"
                        />
                        <label htmlFor="add-document-file-input">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUpload />}
                                fullWidth
                                disabled={isAdding}
                                data-testid="add-document-choose-file"
                            >
                                {t('chooseFile')}
                            </Button>
                        </label>
                        {newDocument.file && (
                            <Typography variant="body2" sx={{ mt: 1 }} data-testid="add-document-filename">
                                {newDocument.file.name}
                            </Typography>
                        )}
                    </Box>
                    {addError && (
                        <Typography variant="body2" color="error" data-testid="add-document-error">
                            {addError}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isAdding} data-testid="add-document-cancel">
                    {t('cancel')}
                </Button>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    startIcon={<Add />}
                    disabled={isAdding}
                    data-testid="add-document-submit"
                >
                    {isAdding ? t('adding') : t('addDocumentButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
