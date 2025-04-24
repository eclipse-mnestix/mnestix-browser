import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RuleDialog } from 'app/[locale]/settings/_components/role-settings/RuleDialog';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { deleteAndCreateRbacRule } from 'lib/services/rbac-service/RbacActions';
import { expect } from '@jest/globals';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { mockRbacRoles } from './test-data/mockRbacRoles';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(() => (key: string) => key),
}));
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');

const mockRule: BaSyxRbacRule = {
    idShort: 'roleId1',
    role: 'Admin-Role',
    action: 'READ',
    targetInformation: {
        '@type': 'aas-environment',
        aasIds: ['aasId1'],
        submodelIds: ['submodelId1'],
    },
};

describe('RoleDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders RoleDialog in view mode', () => {
        render(<RuleDialog open={true} onClose={jest.fn()} rule={mockRule} />);

        expect(screen.getByText('Admin-Role')).toBeInTheDocument();
        expect(screen.getByText('READ')).toBeInTheDocument();
        expect(screen.getByText('aas-environment')).toBeInTheDocument();
    });

    it('switches to edit mode when edit button is clicked', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        render(<RuleDialog open={true} onClose={jest.fn()} rule={mockRule} />);

        fireEvent.click(screen.getByTestId('role-settings-edit-button'));

        await waitFor(() => {
            expect(screen.getByTestId('role-settings-save-button')).toBeInTheDocument();
        });
    });

    it('calls onClose with reload true after successful save', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        const mockOnClose = jest.fn();
        (deleteAndCreateRbacRule as jest.Mock).mockResolvedValue({ isSuccess: true });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(<RuleDialog open={true} onClose={mockOnClose} rule={mockRule} />);

        fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        await waitFor(() => {
            expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
                message: 'saveSuccess',
                severity: 'success',
            });
            expect(mockOnClose).toHaveBeenCalledWith(true);
        });
    });

    it('handles conflict error', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
        const mockOnClose = jest.fn();
        (deleteAndCreateRbacRule as jest.Mock).mockResolvedValue({
            isSuccess: false,
            errorCode: ApiResultStatus.CONFLICT,
        });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(<RuleDialog open={true} onClose={mockOnClose} rule={mockRule} />);

        fireEvent.click(screen.getByTestId('role-settings-edit-button'));
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        await waitFor(() => {
            expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
                message: 'errors.uniqueIdShort',
                severity: 'error',
            });
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });
});
