import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
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
import { BaSyxRbacRule, RbacRolesFetchResult } from 'lib/services/rbac-service/types/RbacServiceData';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';
import AddIcon from '@mui/icons-material/Add';
import { CreateRuleDialog } from 'app/[locale]/settings/_components/role-settings/CreateRuleDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
            { label: '' },
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

    function groupRulesByRole(): Record<string, BaSyxRbacRule[]> {
        if (!rbacRoles) return {};
        return rbacRoles.roles.reduce(
            (groupedRules, rule) => {
                if (!groupedRules[rule.role]) {
                    groupedRules[rule.role] = [];
                }
                groupedRules[rule.role].push(rule);
                return groupedRules;
            },
            {} as Record<string, BaSyxRbacRule[]>,
        );
    }

    function groupPermissionsByRole(rules: BaSyxRbacRule[]): Record<string, Set<string>> {
        return rules.reduce(
            (groupedPermissions, rule) => {
                Object.entries(rule.targetInformation)
                    .filter(([key]) => key !== '@type')
                    .forEach(([key, value]: [string, string[]]) => {
                        if (!groupedPermissions[key]) {
                            groupedPermissions[key] = new Set();
                        }

                        value.forEach((item) => groupedPermissions[key].add(item));
                    });

                return groupedPermissions;
            },
            {} as Record<string, Set<string>>,
        );
    }

    function aggregateRoleData(rules: BaSyxRbacRule[]) {
        const actions = Array.from(new Set(rules.map((rule) => rule.action)));
        const types = Array.from(new Set(rules.map((rule) => rule.targetInformation['@type'])));
        const permissions = groupPermissionsByRole(rules);
        return { actions, types, permissions };
    }

    function RulePermissions({
        permissions,
        maxItems,
    }: {
        permissions: Record<string, Set<string>>;
        maxItems?: number;
    }) {
        return (
            <Box display="flex" flexDirection="column">
                {Object.entries(permissions).map(([type, ids], index) => {
                    if (maxItems && index >= maxItems) {
                        return index === maxItems + 1 ? (
                            <Typography variant="body2" fontWeight="bold" mr="0.5rem">
                                ...
                            </Typography>
                        ) : (
                            <></>
                        );
                    }

                    const idString = Array.from(ids)[0];

                    return (
                        <Box display="flex" flexDirection="row" key={type}>
                            <Typography variant="body2" fontWeight="bold" mr="0.5rem">
                                {`${type}: `}
                            </Typography>
                            <Typography width="20rem" overflow="hidden" textOverflow="ellipsis">
                                {idString}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    }

    function RoleAccordion({ roleName, rules }: { roleName: string; rules: BaSyxRbacRule[] }) {
        const [isExpanded, setExpanded] = useState(false);
        const { actions, types, permissions } = aggregateRoleData(rules);
        return (
            <Accordion key={roleName} expanded={isExpanded}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ height: '8rem' }}
                    data-testid={`role-settings-accordion-summary-${roleName}`}
                    onClick={() => setExpanded(!isExpanded)}
                >
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly">
                        <Box sx={{ width: '12rem' }} p={'16px'}>
                            <Typography fontWeight="bold" overflow="hidden" textOverflow="ellipsis" width="inherit">
                                {roleName}
                            </Typography>
                        </Box>
                        <Box
                            sx={{ width: '16rem', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}
                            p={'16px'}
                        >
                            {actions.map((action) => (
                                <Chip key={action} sx={{ fontWeight: 'normal', m: 0.5 }} label={action} />
                            ))}
                        </Box>
                        <Box sx={{ width: '16rem' }} p={'16px'}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                width="inherit"
                            >
                                {types.join(', ')}
                            </Typography>
                        </Box>
                        {!isMobile && (
                            <Box p={'16px'}>
                                <RulePermissions permissions={permissions} maxItems={2} />
                            </Box>
                        )}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ width: '12rem' }}></Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {prepareTableHeaders().map((header: { label: string }, index) => (
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
                            {rules.map((entry) => (
                                <TableRow key={entry.idShort} data-testid={`role-settings-row-${entry.idShort}`}>
                                    <TableCell
                                        sx={{ width: '12rem', borderBottom: '0px', borderTop: '1px solid #eee' }}
                                        align="center"
                                    >
                                        {/* Empty cell for correct alignment */}
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: '16rem', borderBottom: '0px', borderTop: '1px solid #eee' }}
                                        align="left"
                                    >
                                        <Chip
                                            key={entry.action}
                                            sx={{ fontWeight: 'normal', m: 0.5 }}
                                            label={entry.action}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: '16rem', borderBottom: '0px', borderTop: '1px solid #eee' }}
                                    >
                                        {entry.targetInformation['@type']}
                                    </TableCell>
                                    {!isMobile && (
                                        <TableCell sx={{ borderBottom: '0px', borderTop: '1px solid #eee' }}>
                                            {permissionCell(entry)}
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ borderBottom: '0px', borderTop: '1px solid #eee' }}>
                                        <RoundedIconButton
                                            data-testid={`role-settings-button-${entry.idShort}`}
                                            onClick={() => openDetailDialog(entry)}
                                            color="primary"
                                            size={'small'}
                                        >
                                            <ArrowForwardIcon />
                                        </RoundedIconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>
        );
    }

    const groupedRules = groupRulesByRole();

    return (
        <>
            <Box sx={{ p: 3, width: '100%', minHeight: '600px' }}>
                <CardHeading title={t('title')} subtitle={t('subtitle')}></CardHeading>
                {isLoading ? (
                    <CenteredLoadingSpinner sx={{ my: 10 }} />
                ) : (
                    <>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setCreateDialogOpen(true)}
                            >
                                {t('buttons.create')}
                            </Button>
                        </Box>
                        <Box width="100%" mt={2}>
                            {Object.entries(groupedRules).map(([roleName, rules]) => (
                                <RoleAccordion key={roleName} roleName={roleName} rules={rules} />
                            ))}
                        </Box>
                    </>
                )}
            </Box>
            {selectedRule && (
                <RuleDialog
                    onClose={async (reload) => {
                        if (reload) {
                            await loadRbacData();
                        }
                        setRuleDetailDialogOpen(false);
                    }}
                    open={ruleDetailDialogOpen}
                    rule={selectedRule}
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
