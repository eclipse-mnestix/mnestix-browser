import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DialogRbacRule, RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { createRbacRule, deleteAndCreateRbacRule, deleteRbacRule } from 'lib/services/rbac-service/RbacActions';
import { expect } from '@jest/globals';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { mockRbacRoles } from './test-data/mockRbacRoles';
import { ApiResponseWrapperError, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { EnvProvider } from 'app/EnvProvider';
import { RoleOptions } from './RuleSettings';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('next-intl', () => ({
    useTranslations: (scope?: string) => (key: string) => (scope ? `${scope}.${key}` : key),
}));
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');
jest.mock('./../../../../../lib/services/envAction', () => ({
    getEnv: jest.fn().mockResolvedValue({
        KEYCLOAK_ISSUER: 'http://test-keycloak.dev:8080',
        KEYCLOAK_LOCAL_URL: 'http://localhost:8080',
        KEYCLOAK_REALM: 'test-realm',
    }),
}));

const notLastRuleForRole: DialogRbacRule = {
    ...mockRbacRoles.roles[0],
    isOnlyRuleForRole: false,
};
const lastRuleForRole: DialogRbacRule = {
    ...mockRbacRoles.roles[2],
    isOnlyRuleForRole: true,
};
const conflictRule = {
    ...mockRbacRoles.roles[3],
    isOnlyRuleForRole: true,
};
const newName = 'newRoleName';

const availableRoles: RoleOptions[] = [
    ...new Map((mockRbacRoles?.roles ?? []).map((role) => [role.role, { name: role.role }])).values(),
];

async function renderRuleDialog(rule: DialogRbacRule) {
    const onClose = jest.fn();
    const reloadRules = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
        render(
            <RuleDialog
                open={true}
                onClose={onClose}
                rule={rule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
            {
                wrapper: ({ children }) => <EnvProvider>{children}</EnvProvider>,
            },
        );
    });

    return { onClose, reloadRules };
}

function doMock(createRbacError?: ApiResponseWrapperError<void>, deleteRbacError?: ApiResponseWrapperError<void>) {
    const mockNotificationSpawner = { spawn: jest.fn() };
    (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

    (createRbacRule as jest.Mock).mockResolvedValue(createRbacError ?? wrapSuccess(undefined));

    (deleteAndCreateRbacRule as jest.Mock).mockResolvedValue(
        createRbacError ?? deleteRbacError ?? wrapSuccess(undefined),
    );

    (deleteRbacRule as jest.Mock).mockResolvedValue(deleteRbacError ?? wrapSuccess(undefined));

    return { spawn: mockNotificationSpawner.spawn };
}

function setTextInput(testId: string, text: string) {
    const input = screen.getByTestId(testId).querySelector('input');
    if (!input) {
        throw new Error(`Input with testId ${testId} not found`);
    }
    fireEvent.change(input, { target: { value: text } });
}

describe('RoleDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders RoleDialog in view mode', async () => {
        await renderRuleDialog(notLastRuleForRole);

        await waitFor(() => {
            expect(screen.getByText('Admin-Role')).toBeInTheDocument();
            expect(screen.getByText('READ')).toBeInTheDocument();
            expect(screen.getByText('aas-environment')).toBeInTheDocument();
        });
    });

    it('closes the dialog on back', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-back-button'));
        });

        await waitFor(() => {
            expect(reloadRules).not.toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('switches to edit mode when edit button is clicked', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('role-settings-save-button')).toBeInTheDocument();
            expect(reloadRules).not.toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    it('reloads the list after successful save', async () => {
        const { spawn } = doMock();
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        });

        await act(async () => {
            setTextInput('rule-settings-name-input', lastRuleForRole.role);
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        await waitFor(() => {
            expect(spawn).toHaveBeenCalledWith({
                message: 'pages.settings.rules.editRule.saveSuccess',
                severity: 'success',
            });
            expect(reloadRules).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows delete hint when changing the last rule for a role', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(lastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        });

        await act(async () => {
            setTextInput('rule-settings-name-input', notLastRuleForRole.role);
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        await waitFor(() => {
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
            expect(screen.getByText('pages.settings.rules.keycloakHint.delete')).toBeInTheDocument();
            expect(screen.getByTestId('role-hint-acknowledge')).toBeInTheDocument();
            expect(screen.getByTestId('role-hint-keycloak')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-hint-acknowledge'));
        });

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows create hint when changing the role to a new one', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        });

        await act(async () => {
            setTextInput('rule-settings-name-input', newName);
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        await waitFor(() => {
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
            expect(screen.getByText('pages.settings.rules.keycloakHint.create')).toBeInTheDocument();
            expect(screen.getByTestId('role-hint-acknowledge')).toBeInTheDocument();
            expect(screen.getByTestId('role-hint-keycloak')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-hint-acknowledge'));
        });

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('handles conflict error', async () => {
        const { spawn } = doMock(wrapErrorCode(ApiResultStatus.CONFLICT, 'CONFLICT', 409));
        const { onClose, reloadRules } = await renderRuleDialog(conflictRule);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        });

        await act(async () => {
            setTextInput('rule-settings-name-input', lastRuleForRole.role);
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        await waitFor(() => {
            expect(spawn).toHaveBeenCalledWith({
                message: 'pages.settings.rules.errors.uniqueIdShort',
                severity: 'error',
            });
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });

    it('switches to delete mode', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('role-delete-question')).toBeInTheDocument();
            expect(screen.getByTestId('role-delete-info')).toBeInTheDocument();
            expect(screen.getByTestId('role-target-information-view')).toBeInTheDocument();
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });

    it('closes the dialog on delete dialog', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('dialog-close-button'));
        });

        await waitFor(() => {
            expect(reloadRules).not.toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows the successful delete message without hint dialog', async () => {
        const { spawn } = doMock();
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-delete-confirm-button'));
        });

        await waitFor(() => {
            expect(deleteRbacRule).toHaveBeenCalledWith(notLastRuleForRole.idShort);
            expect(spawn).toHaveBeenCalledWith({
                message: 'pages.settings.rules.deleteRule.success',
                severity: 'success',
            });
            expect(onClose).toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
            expect(screen.queryByText('pages.settings.rules.keycloakHint.delete')).not.toBeInTheDocument();
        });
    });

    it('shows the delete hint dialog after deleting', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(lastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-delete-confirm-button'));
        });

        await waitFor(() => {
            expect(deleteRbacRule).toHaveBeenCalledWith(lastRuleForRole.idShort);
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
            expect(screen.getByText('pages.settings.rules.keycloakHint.delete')).toBeInTheDocument();
            expect(screen.getByTestId('role-hint-acknowledge')).toBeInTheDocument();
            expect(screen.getByTestId('role-hint-keycloak')).toBeInTheDocument();
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('role-hint-acknowledge'));
        });

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('switches back to edit view mode on cancel delete', async () => {
        const { onClose, reloadRules } = await renderRuleDialog(notLastRuleForRole);

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('role-delete-question')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-delete-cancel-button'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('role-settings-dialog')).toBeInTheDocument();
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
            expect(screen.queryByText('pages.settings.rules.keycloakHint.create')).not.toBeInTheDocument();
            expect(screen.queryByText('pages.settings.rules.keycloakHint.delete')).not.toBeInTheDocument();
        });
    });
});
