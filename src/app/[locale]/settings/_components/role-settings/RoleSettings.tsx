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
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';

export const RoleSettings = () => {
    const t = useTranslations('settings');
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<BaSyxRbacRule | undefined>(undefined);
    const [rbacRoles, setRbacRoles] = useState<RbacRolesFetchResult | undefined>();
    const isMobile = useIsMobile();
    const [isLoading, setIsLoading] = useState(false);
    const { showError } = useShowError();

    const MAX_PERMISSIONS_CHARS = 40;

    async function loadRbacData() {
        setIsLoading(true);
        const response = await getRbacRules();
        if (response.isSuccess) {
            // sort by role name
            response.result.roles.sort((a: { role: string }, b: { role: string }) => a.role.localeCompare(b.role));
            setRbacRoles(response.result);
        } else {
            showError(response.message);
        }
        setIsLoading(false);
    }

    useAsyncEffect(async () => {
        await loadRbacData();
    }, []);

    const prepareTableHeaders = () => {
        const tableHeaders = [
            { label: t('roles.tableHeader.name') },
            { label: t('roles.tableHeader.action') },
            { label: t('roles.tableHeader.type') },
            { label: t('roles.tableHeader.permissions') },
            { label: '' },
        ];
        if (isMobile) {
            tableHeaders.splice(3, 1);
        }
        return tableHeaders;
    };

    const permissionCell = (entry: BaSyxRbacRule) => {
        const permissions: JSX.Element[] = [];
        const keys = Object.keys(entry.targetInformation);
        keys.forEach((key) => {
            if (key === '@type') {
                return;
            }
            //@ts-expect-error keys for union not indexable
            let element: string | string[] = entry.targetInformation[key];
            if (Array.isArray(element)) {
                element = element.join(', ');
            }
            permissions.push(
                <Box component="span" key={key + element}>
                    <Box component="span" fontWeight="bold">
                        {`${key}: `}
                    </Box>
                    {element.length > MAX_PERMISSIONS_CHARS ? `${element.slice(0, MAX_PERMISSIONS_CHARS)}...` : element}
                    <br />
                </Box>,
            );
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
                {isLoading ? (
                    <CenteredLoadingSpinner sx={{ my: 10 }} />
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {!!prepareTableHeaders() &&
                                        prepareTableHeaders().map((header: { label: string }, index) => (
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
                                    <TableRow key={entry.role + entry.action + entry.targetInformation['@type']}>
                                        <TableCell>
                                            <Typography fontWeight="bold">{entry.role}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                key={entry.action}
                                                sx={{ fontWeight: 'normal', m: 0.5 }}
                                                label={entry.action}
                                            />
                                        </TableCell>
                                        <TableCell>{entry.targetInformation['@type']}</TableCell>
                                        {!isMobile && <TableCell>{permissionCell(entry)}</TableCell>}
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
                )}
            </Box>
            {selectedRole && (
                <RoleDialog
                    onClose={async (reload) => {
                        if (reload) {
                            await loadRbacData();
                        }
                        setRoleDialogOpen(false);
                    }}
                    open={roleDialogOpen}
                    role={selectedRole}
                ></RoleDialog>
            )}
        </>
    );
};
