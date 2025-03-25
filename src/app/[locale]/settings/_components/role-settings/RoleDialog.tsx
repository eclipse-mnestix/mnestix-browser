import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformation } from 'app/[locale]/settings/_components/role-settings/TargetInformation';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: BaSyxRbacRule | undefined;
};

export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('settings');
    const [isEditMode, setIsEditMode] = useState(false);

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
                <Box display="flex" flexDirection="column">
                    <Typography color="text.secondary" variant="body2">
                        {t('roles.tableHeader.name')}
                    </Typography>
                    <Typography variant="h2" mb="1em">
                        {props.role?.role}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap="1em">
                        <Box>
                            <Typography variant="h5">{t('roles.tableHeader.action')}</Typography>
                            <Typography>{props.role?.action}</Typography>{' '}
                        </Box>
                        <Box>
                            <Typography variant="h5">{t('roles.tableHeader.type')}</Typography>
                            <Typography>{props.role?.targetInformation['@type']}</Typography>
                        </Box>
                        {props.role && (
                            <TargetInformation
                                targetInformation={props.role.targetInformation}
                                isEditMode={isEditMode}
                            />
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '1em' }}>
                {isEditMode ? (
                    <>
                        <Button
                            autoFocus
                            startIcon={<CloseIcon />}
                            variant="outlined"
                            onClick={() => setIsEditMode(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="contained" startIcon={<CheckIcon />} onClick={() => console.log('save')}>
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Button autoFocus startIcon={<ArrowBack />} variant="outlined" onClick={props.onClose}>
                            Back
                        </Button>
                        <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditMode(true)}>
                            Edit
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};
