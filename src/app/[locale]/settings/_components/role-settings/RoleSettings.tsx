import {
    Box,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { CardHeading } from 'components/basics/CardHeading';
import { useTranslations } from 'next-intl';
import { RoleDialog } from 'app/[locale]/settings/_components/role-settings/RoleDialog';
import { JSX, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RoundedIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getRbacRules } from 'lib/services/rbac-service/RbacActions';
import { BaSyxRbacRule, RbacRolesFetchResult } from 'lib/services/rbac-service/RbacRulesService';

export const RoleSettings = () => {
    const t = useTranslations('settings');
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<BaSyxRbacRule | undefined>(undefined);
    const [rbacRoles, setRbacRoles] = useState<RbacRolesFetchResult | undefined>();
    const MAX_PERMISSIONS_CHARS = 40;

    useAsyncEffect(async () => {
        const rbacRoles = await getRbacRules();
        if (rbacRoles.isSuccess) {
            setRbacRoles(rbacRoles.result);
        }
    }, []);

    const tableHeaders = [
        { label: t('roles.tableHeader.name') },
        { label: t('roles.tableHeader.action') },
        { label: t('roles.tableHeader.type') },
        { label: 'Permissions' }, // TODO intl
        { label: '' },
    ];

    // Test all List implementation and align styling
    // mobile: hide permissions

    const permissionCell = (entry: BaSyxRbacRule) => {
        const permissions: JSX.Element[] = [];
        const keys = Object.keys(entry.targetInformation);
        keys.forEach((key) => {
            // @ts-expect-error zod type
            let element = entry.targetInformation[key];
            if (Array.isArray(element)) {
                element = element.join(', ');
            }
            if (key !== '@type') {
                permissions.push(
                    <Box component="span" key={element}>
                        <Box component="span" fontWeight="bold">
                            {`${key}: `}
                        </Box>
                        {element.length > MAX_PERMISSIONS_CHARS
                            ? `${element.slice(0, MAX_PERMISSIONS_CHARS)}...`
                            : element}
                        <br />
                    </Box>,
                );
            }
        });
        return permissions;
    };

    const openDetailDialog = (entry: BaSyxRbacRule) => {
        setSelectedRole(entry);
        setRoleDialogOpen(true);
    };

    return (
        <>
            <Box sx={{ p: 3, width: '100%', minHeight: '600px' }}>
                <CardHeading title={t('roles.title')} subtitle={t('roles.subtitle')}></CardHeading>
                <Divider sx={{ my: 2 }} />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {!!tableHeaders &&
                                    tableHeaders.map((header: { label: string }, index) => (
                                        <TableCell key={index}>
                                            <Typography
                                                variant="h5"
                                                color="secondary"
                                                letterSpacing={0.16}
                                                fontWeight={700}
                                            >
                                                {header.label}
                                            </Typography>
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rbacRoles?.roles.map((entry) => (
                                <TableRow key={entry.role}>
                                    <TableCell>
                                        <Typography fontWeight="bold">{entry.role}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip sx={{ fontWeight: 'normal', m: 0.5 }} label={entry.action} />
                                    </TableCell>
                                    <TableCell>{entry.targetInformation['@type']}</TableCell>
                                    <TableCell>{permissionCell(entry)}</TableCell>
                                    <TableCell>
                                        <RoundedIconButton onClick={() => openDetailDialog(entry)} color="primary">
                                            <ArrowForwardIcon />
                                        </RoundedIconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <RoleDialog
                onClose={() => {
                    setRoleDialogOpen(false);
                }}
                open={roleDialogOpen}
                role={selectedRole}
            ></RoleDialog>
        </>
    );
};
