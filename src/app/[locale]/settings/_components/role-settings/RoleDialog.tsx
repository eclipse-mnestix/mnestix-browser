import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RbacDto } from 'app/[locale]/settings/_components/role-settings/RoleSettings';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: RbacDto | undefined;
};
export const RoleDialog = (props: RoleDialogProps) => {
    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth={true}>
            <IconButton
                aria-label="close"
                onClick={props.onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent style={{ padding: '40px' }}>
                <Box display="flex" flexDirection="column" gap="20px">
                    <Typography variant="h2" color={'primary'}>
                        {props.role?.name}
                    </Typography>
                    <Box>
                        <Typography color="text.secondary">{props.role?.aasIds}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
