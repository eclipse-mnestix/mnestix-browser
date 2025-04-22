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
import { RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { JSX, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RoundedIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getRbacRules } from 'lib/services/rbac-service/RbacActions';
import { RbacRolesFetchResult, BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';
import AddIcon from '@mui/icons-material/Add';
import { CreateRuleDialog } from 'app/[locale]/settings/_components/role-settings/CreateRuleDialog';

export const RuleSettings = () => {
    const t = useTranslations('pages.settings.rules');
    const [ruleDetailDialogOpen, setRuleDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<BaSyxRbacRule | undefined>(undefined);
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
            { label: t('tableHeader.name') },
            { label: t('tableHeader.action') },
            { label: t('tableHeader.type') },
            { label: t('tableHeader.permissions') },
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
        setSelectedRule(entry);
        setRuleDetailDialogOpen(true);
    };

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
                    onClose={async (reload) => {
                        setRuleDetailDialogOpen(false);
                        if (reload) {
                            await loadRbacData();
                        }
                    }}
                    open={ruleDetailDialogOpen}
                    rule={selectedRule}
                    rules={rbacRoles?.roles ?? []}
                ></RuleDialog>
            )}
            <CreateRuleDialog
                open={createDialogOpen}
                onClose={async (reload) => {
                    if (reload) {
                        await loadRbacData();
                    }
                    setCreateDialogOpen(false);
                }}
            />
        </>
    );
};
