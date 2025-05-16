import { 
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Typography, 
    useTheme 
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from './DialogCloseButton';
import ConstructionIcon from '@mui/icons-material/Construction';

type ConstructionDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly customMessage?: string;
};

/**
 * Dialog component to display a "feature under construction" message
 * with a construction icon. Used to indicate features that are not yet implemented.
 */
export function ConstructionDialog(props: ConstructionDialogProps) {
    const t = useTranslations('components.constructionDialog');
    const theme = useTheme();

    return (
        <Dialog 
            open={props.open} 
            onClose={props.onClose} 
            maxWidth="sm" 
            fullWidth={true}
            aria-labelledby="construction-dialog-title"
        >
            <DialogCloseButton handleClose={props.onClose} dataTestId="construction-dialog-close" />
            <DialogTitle id="construction-dialog-title" style={{ padding: '2em' }}>
                <Typography variant="h2" color="primary">
                    {t('title')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ padding: 0 }}>
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    gap={3} 
                >
                    <ConstructionIcon 
                        sx={{ 
                            fontSize: 80, 
                            color: theme.palette.warning.main 
                        }} 
                    />
                    <Typography align="center">
                        {props.customMessage || t('message')}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions style={{ padding: '2em' }}>
                <Button 
                    onClick={props.onClose} 
                    variant="contained" 
                    color="primary"
                    data-testid="construction-dialog-button"
                >
                    {t('buttonText')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
