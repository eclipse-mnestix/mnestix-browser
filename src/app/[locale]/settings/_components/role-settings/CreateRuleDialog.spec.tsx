import { fireEvent, render, screen } from '@testing-library/react';
import { CreateRuleDialog } from './CreateRuleDialog';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { createRbacRule } from 'lib/services/rbac-service/RbacActions';
import { expect } from '@jest/globals';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { act } from 'react';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { mockRbacRoles } from './test-data/mockRbacRoles';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');
jest.mock('./../../../../../lib/hooks/UseShowError', () => ({
    useShowError: () => ({ showError: jest.fn() }),
}));

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

describe('CreateRuleDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
    });

    it('calls onClose without reloading when close button is clicked', async () => {
        const { onClose, reloadRules } = renderCreateRuleDialog();
        expect(screen.getByText('createTitle')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('rule-create-close-button'));
        });

        expect(onClose).toHaveBeenCalled();
        expect(reloadRules).not.toHaveBeenCalled();
    });

    it('handles successful rule creation', async () => {
        (createRbacRule as jest.Mock).mockResolvedValue({ isSuccess: true });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        const { onClose, reloadRules } = renderCreateRuleDialog();

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        act(() => {
            fireEvent.change(roleInput as Element, { target: { value: 'NewRole' } });
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
            message: 'saveSuccess',
            severity: 'success',
        });
        expect(onClose).toHaveBeenCalled();
        expect(reloadRules).toHaveBeenCalled();
    });

    it('displays all available roles', async () => {
        renderCreateRuleDialog(['Role1', 'Role2', 'Role3']);

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        fireEvent.focus(roleInput as Element);

        expect(screen.getByText('Role1')).toBeInTheDocument();
        expect(screen.getByText('Role2')).toBeInTheDocument();
        expect(screen.getByText('Role3')).toBeInTheDocument();
    });

    it('handles conflict error', async () => {
        (createRbacRule as jest.Mock).mockResolvedValue({
            isSuccess: false,
            errorCode: ApiResultStatus.CONFLICT,
        });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        const { onClose, reloadRules } = renderCreateRuleDialog();

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        await act(async () => {
            fireEvent.change(roleInput as Element, { target: { value: 'NewRole' } });
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
            message: 'errors.uniqueIdShort',
            severity: 'error',
        });
        expect(onClose).not.toHaveBeenCalled();
        expect(reloadRules).not.toHaveBeenCalled();
    });

    it('handles failed rule creation', async () => {
        const errorMessage = 'Creation failed';
        (createRbacRule as jest.Mock).mockResolvedValue({
            isSuccess: false,
            message: errorMessage,
        });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        const { onClose, reloadRules } = renderCreateRuleDialog();

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        await act(async () => {
            fireEvent.change(roleInput as Element, { target: { value: 'NewRole' } });
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
            message: errorMessage,
            severity: 'error',
        });
        expect(onClose).not.toHaveBeenCalled();
        expect(reloadRules).not.toHaveBeenCalled();
    });
});
