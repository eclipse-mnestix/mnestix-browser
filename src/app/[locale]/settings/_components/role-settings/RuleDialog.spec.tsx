import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DialogRbacRule, RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { deleteAndCreateRbacRule, deleteRbacRule, getRbacRules } from 'lib/services/rbac-service/RbacActions';
import { expect } from '@jest/globals';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { mockRbacRoles } from './test-data/mockRbacRoles';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(() => (key: string) => key),
}));
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');

const mockRule: DialogRbacRule = {
    idShort: 'roleId1',
    role: 'Admin-Role',
    action: 'READ',
    targetInformation: {
        '@type': 'aas-environment',
        aasIds: ['aasId1'],
        submodelIds: ['submodelId1'],
    },
    isOnlyRule: false,
};

const availableRoles = mockRbacRoles.roles.map((role) => role.role);

describe('RoleDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders RoleDialog in view mode', () => {
        render(
            <RuleDialog
                open={true}
                onClose={jest.fn()}
                rule={mockRule}
                reloadRules={jest.fn()}
                availableRoles={availableRoles}
            />,
        );

        expect(screen.getByText('Admin-Role')).toBeInTheDocument();
        expect(screen.getByText('READ')).toBeInTheDocument();
        expect(screen.getByText('aas-environment')).toBeInTheDocument();
    });

    it('closes the dialog on back', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-back-button'));

        await waitFor(() => {
            expect(reloadRules).not.toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('switches to edit mode when edit button is clicked', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-edit-button'));

        await waitFor(() => {
            expect(screen.getByTestId('role-settings-save-button')).toBeInTheDocument();
            expect(reloadRules).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    it('reloads the list after successful save', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        (deleteAndCreateRbacRule as jest.Mock).mockResolvedValue({ isSuccess: true });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        await waitFor(() => {
            expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
                message: 'editRule.saveSuccess',
                severity: 'success',
            });
            expect(reloadRules).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles conflict error', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        (deleteAndCreateRbacRule as jest.Mock).mockResolvedValue({
            isSuccess: false,
            errorCode: ApiResultStatus.CONFLICT,
        });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        await waitFor(() => {
            expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
                message: 'errors.uniqueIdShort',
                severity: 'error',
            });
            expect(mockOnClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });

    it('switches to delete mode', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-delete-button'));

        await waitFor(() => {
            expect(screen.getByTestId('role-delete-question')).toBeInTheDocument();
            expect(screen.getByTestId('role-delete-info')).toBeInTheDocument();
            expect(screen.getByTestId('role-target-information-view')).toBeInTheDocument();
            expect(mockOnClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });

    it('closes the dialog on delete dialog', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        fireEvent.click(screen.getByTestId('dialog-close-button'));

        await waitFor(() => {
            expect(reloadRules).not.toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('shows the successful message without hint dialog', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        (deleteRbacRule as jest.Mock).mockResolvedValue({ isSuccess: true });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        fireEvent.click(screen.getByTestId('role-delete-confirm-button'));

        await waitFor(() => {
            expect(deleteRbacRule).toHaveBeenCalledWith(mockRule.idShort);
            expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
                message: 'deleteRule.success',
                severity: 'success',
            });
            expect(mockOnClose).toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
        });
    });
    
    it('shows the hint dialog after deleting', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        (deleteRbacRule as jest.Mock).mockResolvedValue({ isSuccess: true });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={{ ...mockRule, isOnlyRule: true }} // Mocking isOnlyRule to true for delete test
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-delete-button'));
        fireEvent.click(screen.getByTestId('role-delete-confirm-button'));

        await waitFor(() => {
            expect(deleteRbacRule).toHaveBeenCalledWith(mockRule.idShort);
            expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
                message: 'deleteRule.success',
                severity: 'success',
            });
            expect(mockOnClose).not.toHaveBeenCalled();
            expect(reloadRules).toHaveBeenCalled();
        });
        
        fireEvent.click(screen.getByTestId('role-delete-hint-acknowledge'));
        
        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('switches back to edit view mode on cancel delete', async () => {
        const reloadRules = jest.fn();
        const mockOnClose = jest.fn();
        (getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(
            <RuleDialog
                open={true}
                onClose={mockOnClose}
                rule={mockRule}
                reloadRules={reloadRules}
                availableRoles={availableRoles}
            />,
        );

        fireEvent.click(screen.getByTestId('role-settings-delete-button'));

        await waitFor(() => {
            expect(screen.getByTestId('role-delete-question')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('role-delete-cancel-button'));

        await waitFor(() => {
            expect(screen.getByTestId('role-settings-dialog')).toBeInTheDocument();
            expect(mockOnClose).not.toHaveBeenCalled();
            expect(reloadRules).not.toHaveBeenCalled();
        });
    });
});
