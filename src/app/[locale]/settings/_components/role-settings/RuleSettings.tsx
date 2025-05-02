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
import { DialogRbacRule, RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RoundedIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getRbacRules } from 'lib/services/rbac-service/RbacActions';
import { BaSyxRbacRule, RbacRolesFetchResult } from 'lib/services/rbac-service/types/RbacServiceData';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';
import AddIcon from '@mui/icons-material/Add';
import { CreateRuleDialog, defaultRbacRule } from 'app/[locale]/settings/_components/role-settings/CreateRuleDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SUMMARY_PRIORITY_ORDER = [
    'aasIds',
    'assetIds',
    'submodelIds',
    'submodelElementIdShortPaths',
    'conceptDescriptionIds',
];
const DEFAULT_RBAC_RULE = { ...defaultRbacRule, isOnlyRuleForRole: false };

function RoleAccordion({
    roleName,
    rules,
    openDetailDialog,
}: {
    roleName: string;
    rules: BaSyxRbacRule[];
    openDetailDialog: (entry: BaSyxRbacRule) => void;
}) {
    const [isExpanded, setExpanded] = useState(false);
    const isMobile = useIsMobile();
    const t = useTranslations('pages.settings.rules');

    function aggregateRoleData(rules: BaSyxRbacRule[]) {
        const actions = Array.from(new Set(rules.map((rule) => rule.action)));
        const types = Array.from(new Set(rules.map((rule) => rule.targetInformation['@type'])));
        const permissions = groupPermissionsByRole(rules);
        return { actions, types, permissions };
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

    function AccordionHeader({ roleName, rules }: { roleName: string; rules: BaSyxRbacRule[] }) {
        const { actions, types, permissions } = aggregateRoleData(rules);
        return (
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly">
                <Box sx={{ width: '12rem' }} p={'1rem'}>
                    <Typography
                        fontWeight="bold"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        maxWidth="inherit"
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflowWrap: 'break-word',
                        }}
                    >
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
                <Box sx={{ width: '16rem' }} p={'1rem'}>
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
                    <Box p={'1rem'} maxWidth="32rem" overflow="hidden" textOverflow="ellipsis">
                        <RulePermissions permissions={permissions} />
                    </Box>
                )}
            </Box>
        );
    }

    function TableCellHeader() {
        const tableHeaderText = {
            variant: 'h5',
            color: 'primary.main',
            letterSpacing: 0.16,
            fontWeight: 700,
        };

        return (
            <TableRow>
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-name">
                    {''}
                </TableCell>
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-action">
                    {t('tableHeader.action')}
                </TableCell>
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-type">
                    {t('tableHeader.type')}
                </TableCell>
                {!isMobile && (
                    <TableCell sx={tableHeaderText} data-testid="rulesettings-header-permissions">
                        {t('tableHeader.permissions')}
                    </TableCell>
                )}
                <TableCell sx={tableHeaderText} data-testid="rulesettings-header-empty"></TableCell>
            </TableRow>
        );
    }

    function RuleList({ rules }: { rules: BaSyxRbacRule[] }) {
        return (
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
                            <Chip key={entry.action} sx={{ fontWeight: 'normal', m: 0.5 }} label={entry.action} />
                        </TableCell>
                        <TableCell sx={{ width: '16rem', borderBottom: '0px', borderTop: '1px solid #eee' }}>
                            {entry.targetInformation['@type']}
                        </TableCell>
                        {!isMobile && (
                            <TableCell sx={{ borderBottom: '0px', borderTop: '1px solid #eee' }}>
                                <PermissionCell entry={entry} />
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
        );
    }

    function PermissionCell({ entry }: { entry: BaSyxRbacRule }) {
        const permissions = Object.entries(entry.targetInformation).filter(
            (e): e is [string, string[]] => e[0] !== '@type',
        );
        return (
            <Box display="flex" flexDirection="column" maxWidth="100%">
                {permissions.map(([category, perms]) => {
                    const idString = perms.join(', ');
                    return (
                        <Box
                            display="flex"
                            flexDirection="row"
                            maxWidth="32rem"
                            key={`permission-row-${entry.idShort}-${category}`}
                        >
                            <Typography variant="body2" fontWeight="bold" mr="0.5rem">
                                {`${category}: `}
                            </Typography>
                            <Typography
                                variant="body2"
                                width="fill"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                maxWidth="100%"
                            >
                                {idString}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    }

    function RulePermissions({ permissions }: { permissions: Record<string, Set<string>>; maxItems?: number }) {
        const permissionCategories = Object.keys(permissions);

        const accumulatedCategories: string[] = [];
        for (const category of SUMMARY_PRIORITY_ORDER) {
            // Push if any rule has this category
            if (permissionCategories.includes(category)) {
                accumulatedCategories.push(category);
            }
        }

        return (
            <Box display="flex" flexDirection="column" maxWidth="100%">
                {accumulatedCategories.map((category) => {
                    const idString = Array.from(permissions[category]).join(', ');

                    return (
                        <Box display="flex" flexDirection="row" key={category} maxWidth="100%">
                            <Typography variant="body2" fontWeight="bold" mr="0.5rem">
                                {`${category}: `}
                            </Typography>
                            <Typography
                                variant="body2"
                                width="fill"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                maxWidth="100%"
                            >
                                {idString}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    }

    return (
        <Accordion key={roleName} expanded={isExpanded}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ height: '8rem' }}
                data-testid={`role-settings-accordion-summary-${roleName}`}
                onClick={() => setExpanded(!isExpanded)}
            >
                <AccordionHeader roleName={roleName} rules={rules} />
            </AccordionSummary>
            <AccordionDetails>
                <Table>
                    <TableHead>
                        <TableCellHeader />
                    </TableHead>
                    <RuleList rules={rules} />
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}

export const RuleSettings = () => {
    const t = useTranslations('pages.settings.rules');
    const [ruleDetailDialogOpen, setRuleDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<DialogRbacRule>();
    const [rbacRoles, setRbacRoles] = useState<RbacRolesFetchResult>();
    const [isLoading, setIsLoading] = useState(false);
    const { showError } = useShowError();

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

    const openDetailDialog = (entry: BaSyxRbacRule) => {
        // Check if the entry is the only rule for the role
        const isOnlyRuleForRole = rbacRoles?.roles.filter((rule) => rule.role === entry.role).length === 1;
        const updatedEntry = { ...entry, isOnlyRuleForRole };

        setSelectedRule(updatedEntry);
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
                                <RoleAccordion
                                    key={roleName}
                                    roleName={roleName}
                                    rules={rules}
                                    openDetailDialog={openDetailDialog}
                                />
                            ))}
                        </Box>
                    </>
                )}
            </Box>

            <RuleDialog
                onClose={() => setRuleDetailDialogOpen(false)}
                reloadRules={loadRbacData}
                open={ruleDetailDialogOpen}
                rule={selectedRule ?? DEFAULT_RBAC_RULE}
                availableRoles={availableRoles}
            />
            <CreateRuleDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                reloadRules={loadRbacData}
                availableRoles={availableRoles}
            />
        </>
    );
};
