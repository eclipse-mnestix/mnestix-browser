import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { JSX } from 'react';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: BaSyxRbacRule | undefined;
};
export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('settings');

    const permissions = (entry: BaSyxRbacRule) => {
        const permissions: JSX.Element[] = [];
        const keys = Object.keys(entry.targetInformation);
        keys.forEach((key) => {
            // @ts-expect-error zod type
            const element = entry.targetInformation[key];

            if (element !== '@type' && Array.isArray(element))
                permissions.push(
                    <Box>
                        <Typography color="text.secondary" variant="body2">
                            {key}
                        </Typography>
                        <Typography>{element.join(', ')}</Typography>
                    </Box>,
                );
        });
        return permissions;
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth={true}>
            <DialogCloseButton handleClose={props.onClose}/>
            <DialogContent style={{ padding: '40px' }}>
                <Box display="flex" flexDirection="column" gap="1em">
                    <Typography variant="h2" color={'primary'}>
                        Role: {props.role?.role}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap="1em">
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                {t('roles.tableHeader.action')}
                            </Typography>
                            <Typography>{props.role?.action}</Typography>{' '}
                        </Box>
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                {t('roles.tableHeader.type')}
                            </Typography>
                            <Typography>{props.role?.targetInformation['@type']}</Typography>
                        </Box>
                        {props.role && permissions(props.role)}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
