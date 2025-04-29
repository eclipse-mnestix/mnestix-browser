import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CreateRuleDialog } from './CreateRuleDialog';
import { createRbacRule } from 'lib/services/rbac-service/RbacActions';
import { expect } from '@jest/globals';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { act } from 'react';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('next-intl', () => ({
    useTranslations: (scope?: string) => (key: string) => (scope ? `${scope}.${key}` : key),
}));
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');

function renderCreateRuleDialog(availableRoles?: string[]) {
    const onClose = jest.fn();
    const reloadRules = jest.fn().mockResolvedValue(undefined);

    render(
        <CreateRuleDialog
            open={true}
            onClose={onClose}
            reloadRules={reloadRules}
            availableRoles={availableRoles ?? ['Role1', 'Role2']}
        />,
    );

    return { onClose, reloadRules };
}

function doMock(createRbacError?: string) {
    const mockNotificationSpawner = { spawn: jest.fn() };
    (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

    const returnValue =
        createRbacError === undefined
            ? { isSuccess: true }
            : createRbacError === 'CONFLICT'
              ? { isSuccess: false, errorCode: ApiResultStatus.CONFLICT }
              : { isSuccess: false, errorCode: ApiResultStatus.UNKNOWN_ERROR, message: createRbacError };
    (createRbacRule as jest.Mock).mockResolvedValue(returnValue);

    return { spawn: mockNotificationSpawner.spawn };
}

function setTextInput(testId: string, text: string) {
    const input = screen.getByTestId(testId).querySelector('input')!;
    fireEvent.change(input, { target: { value: text } });
}

describe('CreateRuleDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls onClose without reloading when close button is clicked', async () => {
        const { onClose, reloadRules } = renderCreateRuleDialog();

        await waitFor(() => {
            expect(screen.getByText('pages.settings.rules.createRule.title')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('rule-create-close-button'));
        });

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });

    it('handles successful rule creation', async () => {
        const { spawn } = doMock();
        const { onClose, reloadRules } = renderCreateRuleDialog();

        setTextInput('rule-settings-name-input', 'Role1');
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        await waitFor(() => {
            expect(spawn).toHaveBeenCalledWith({
                message: 'pages.settings.rules.createRule.saveSuccess',
                severity: 'success',
            });
            expect(onClose).toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
        });
    });

    it('handles conflict error', async () => {
        const { spawn } = doMock('CONFLICT');
        const { onClose, reloadRules } = renderCreateRuleDialog();

        await act(async () => {
            setTextInput('rule-settings-name-input', 'Role1');
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

    it('handles failed rule creation', async () => {
        const errorMessage = 'Creation failed';
        const { spawn } = doMock(errorMessage);
        const { onClose, reloadRules } = renderCreateRuleDialog();

        await act(async () => {
            setTextInput('rule-settings-name-input', 'Role1');
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        await waitFor(() => {
            expect(spawn).toHaveBeenCalled();
            expect(spawn).toHaveBeenCalledWith({
                title: 'navigation.errors.unexpectedError',
                message: `UNKNOWN_ERROR: ${errorMessage}`,
                severity: 'error',
            });
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });

    it('shows hint dialog for new role', async () => {
        doMock();
        const { onClose, reloadRules } = renderCreateRuleDialog();

        await act(async () => {
            setTextInput('rule-settings-name-input', 'NewRole');
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        await waitFor(() => {
            expect(onClose).not.toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
            expect(screen.getByText('pages.settings.rules.createRule.hint.text')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-create-hint-acknowledge'));
        });

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });
});
