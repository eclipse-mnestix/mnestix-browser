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
