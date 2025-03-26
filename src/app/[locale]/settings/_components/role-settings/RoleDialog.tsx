import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformation } from 'app/[locale]/settings/_components/role-settings/TargetInformation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: BaSyxRbacRule | undefined;
};

type RoleFormModel = {
    type: string;
    actions: string[];
    targetInformation: Record<string, string>;
};

export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('settings');
    const [isEditMode, setIsEditMode] = useState(false);

    // TODO can we get this type/enum from the backend part?
    const actions = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXECUTE'];

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm();
    const onSubmit: SubmitHandler<RoleFormModel> = (data) => {
        console.log(data);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth={true}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                {isEditMode ? (
                                    <Controller
                                        name="actions"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <Select labelId="role-type-select-label" variant="outlined" {...field}>
                                                    {actions.map((type) => (
                                                        <MenuItem key={type} value={type}>
                                                            {type}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                ) : (
                                    <Typography>{props.role?.action}</Typography>
                                )}
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
                            <Button variant="contained" startIcon={<CheckIcon />} type="submit">
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
            </form>
        </Dialog>
    );
};
