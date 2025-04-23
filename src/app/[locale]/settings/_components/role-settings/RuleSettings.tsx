import {
    Box,
    Button,
    Chip,
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
import { DialogRbacRule, RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { JSX, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RoundedIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getRbacRules } from 'lib/services/rbac-service/RbacActions';
import { BaSyxRbacRule, RbacRolesFetchResult } from 'lib/services/rbac-service/types/RbacServiceData';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';
import AddIcon from '@mui/icons-material/Add';
import { CreateRuleDialog } from 'app/[locale]/settings/_components/role-settings/CreateRuleDialog';

export const RuleSettings = () => {
    const t = useTranslations('pages.settings.rules');
    const [ruleDetailDialogOpen, setRuleDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<DialogRbacRule>();
    const [rbacRoles, setRbacRoles] = useState<RbacRolesFetchResult>();
    const isMobile = useIsMobile();
    const [isLoading, setIsLoading] = useState(false);
    const { showError } = useShowError();

    const MAX_PERMISSIONS_CHARS = 40;

    // all available role names
    const availableRoles = [...new Set(rbacRoles?.roles.map((role) => role.role))];

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

    const permissionCell = (entry: BaSyxRbacRule) => {
        const permissions: JSX.Element[] = [];
        const keys = Object.keys(entry.targetInformation);
        keys.forEach((key) => {
            if (key === '@type') {
                return;
            }
            //@ts-expect-error keys for union not indexable
            const element: string = entry.targetInformation[key] ? entry.targetInformation[key].join(', ') : '';
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
        // Check if the entry is the only rule for the role
        const isOnlyRule = rbacRoles?.roles.filter((rule) => rule.role === entry.role).length === 1;
        const updatedEntry = { ...entry, isOnlyRule };

        setSelectedRule(updatedEntry);
        setRuleDetailDialogOpen(true);
    };

    function TableCellHeader() {
        const tableHeaderText = {
            variant: 'h5',
            color: 'secondary',
            letterSpacing: 0.16,
            fontWeight: 700,
        };

        return (
            <TableRow>
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-name">
                    {t('tableHeader.name')}
                </TableCell>
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-action">
                    {t('tableHeader.action')}
                </TableCell>
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-type">
                    {t('tableHeader.type')}
                </TableCell>
                {isMobile && (
                    <TableCell sx={tableHeaderText} data-testid="rulesettings-header-permissions">
                        {t('tableHeader.permissions')}
                    </TableCell>
                )}
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-empty"></TableCell>
            </TableRow>
        );
    }

    return (
        <>
            <Box sx={{ p: 3, width: '100%', minHeight: '600px' }}>
                <CardHeading title={t('title')} subtitle={t('subtitle')}></CardHeading>
                {isLoading ? (
                    <CenteredLoadingSpinner sx={{ my: 10 }} />
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
                            {t('buttons.create')}
                        </Button>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableCellHeader />
                                </TableHead>
                                <TableBody>
                                    {rbacRoles?.roles.map((entry) => (
                                        <TableRow
                                            key={entry.idShort}
                                            data-testid={`role-settings-row-${entry.idShort}`}
                                        >
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
                                                <RoundedIconButton
                                                    data-testid={`role-settings-button-${entry.idShort}`}
                                                    onClick={() => openDetailDialog(entry)}
                                                    color="primary"
                                                >
                                                    <ArrowForwardIcon />
                                                </RoundedIconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>
            {selectedRule && (
                <RuleDialog
                    onClose={() => setRuleDetailDialogOpen(false)}
                    reloadRules={loadRbacData}
                    open={ruleDetailDialogOpen}
                    rule={selectedRule}
                    availableRoles={availableRoles}
                ></RuleDialog>
            )}
            <CreateRuleDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                reloadRules={loadRbacData}
                availableRoles={availableRoles}
            />
        </>
    );
};
