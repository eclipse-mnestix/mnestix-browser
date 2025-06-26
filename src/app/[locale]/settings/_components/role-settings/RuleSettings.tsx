import { Box, Button } from '@mui/material';
import { CardHeading } from 'components/basics/CardHeading';
import { useTranslations } from 'next-intl';
import { DialogRbacRule, RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { useState } from 'react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getRbacRules } from 'lib/services/rbac-service/RbacActions';
import { BaSyxRbacRule, RbacRolesFetchResult } from 'lib/services/rbac-service/types/RbacServiceData';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';
import AddIcon from '@mui/icons-material/Add';
import { CreateRuleDialog, defaultRbacRule } from 'app/[locale]/settings/_components/role-settings/CreateRuleDialog';
import { RoleAccordion } from './RoleAccordion';

const DEFAULT_RBAC_RULE = { ...defaultRbacRule, isOnlyRuleForRole: false };
export type RoleOptions = {
    readonly name: string;
    readonly title?: string;
};

export const RuleSettings = () => {
    const t = useTranslations('pages.settings.rules');
    const [ruleDetailDialogOpen, setRuleDetailDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<DialogRbacRule>();
    const [rbacRoles, setRbacRoles] = useState<RbacRolesFetchResult>();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const { showError } = useShowError();

    // all available role names
    /**
     * Extracts available roles as an array of objects with 'role' and 'title' properties.
     * @type {RoleOptions}[]}
     */
    const availableRoles: RoleOptions[] = [
        ...new Map((rbacRoles?.roles ?? []).map((role) => [role.role, { name: role.role }])).values(),
    ];

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

    const openCreateDialog = (roleName: string | null) => {
        setSelectedRole(roleName);
        setCreateDialogOpen(true);
    };

    const openDeleteRoleDialog = (_roleName: string) => {
        throw new Error('Delete role dialog is not implemented yet');
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
                                    openCreateDialog={openCreateDialog}
                                    openDeleteRoleDialog={openDeleteRoleDialog}
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
                onClose={() => {
                    setSelectedRole(null);
                    setCreateDialogOpen(false);
                }}
                reloadRules={loadRbacData}
                availableRoles={availableRoles}
                selectedRole={selectedRole}
            />
        </>
    );
};
