import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { rbacAction, RbacDto } from 'app/[locale]/settings/_components/role-settings/RoleSettings';
import { useTranslations } from 'next-intl';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: RbacDto | undefined;
};
export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('settings');

    const permissions = (entry: RbacDto) => {
        const permissions = [];
        for (const elem in entry.targetInformation) {
            if (elem !== 'type' && Array.isArray(elem))
                permissions.push(
                    <Box>
                        <Typography color="text.secondary" variant="body2">
                            {elem}
                        </Typography>
                        <Typography>{elem[elem].join(', ')}</Typography>
                    </Box>,
                );
        }
        return permissions;
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth={true}>
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
                <Box display="flex" flexDirection="column" gap="1em">
                    <Typography variant="h2" color={'primary'}>
                        Role: {props.role?.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap="1em">
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                {t('roles.tableHeader.action')}
                            </Typography>
                            <Typography>{props.role?.action.map((action) => rbacAction[action]).join(', ')}</Typography>{' '}
                        </Box>
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                {t('roles.tableHeader.type')}
                            </Typography>
                            <Typography>{props.role?.targetInformation.type}</Typography>
                        </Box>
                        {props.role && permissions(props.role)}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
