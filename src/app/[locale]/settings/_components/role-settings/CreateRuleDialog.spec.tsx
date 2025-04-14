import { fireEvent, render, screen } from '@testing-library/react';
import { CreateRuleDialog } from './CreateRuleDialog';
import { createRbacRule } from 'lib/services/rbac-service/RbacActions';
import { expect } from '@jest/globals';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { act } from 'react';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');
jest.mock('./../../../../../lib/hooks/UseShowError', () => ({
    useShowError: () => ({ showError: jest.fn() }),
}));

describe('CreateRuleDialog', () => {
    const defaultProps = {
        open: true,
        onClose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls onClose when close button is clicked', async () => {
        render(<CreateRuleDialog {...defaultProps} />);
        expect(screen.getByText('createTitle')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('rule-create-close-button'));
        });

        expect(defaultProps.onClose).toHaveBeenCalledWith(false);
    });

    it('handles successful rule creation', async () => {
        (createRbacRule as jest.Mock).mockResolvedValue({ isSuccess: true });
        const mockNotificationSpawner = { spawn: jest.fn() };
        (useNotificationSpawner as jest.Mock).mockReturnValue(mockNotificationSpawner);

        render(<CreateRuleDialog {...defaultProps} />);

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        await act(async () => {
            fireEvent.change(roleInput as Element, { target: { value: 'NewRole' } });
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(mockNotificationSpawner.spawn).toHaveBeenCalledWith({
            message: 'saveSuccess',
            severity: 'success',
        });
        expect(defaultProps.onClose).toHaveBeenCalledWith(true);
    });

    it('handles failed rule creation', async () => {
        const errorMessage = 'Creation failed';
        (createRbacRule as jest.Mock).mockResolvedValue({
            isSuccess: false,
            message: errorMessage,
        });

        render(<CreateRuleDialog {...defaultProps} />);

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        await act(async () => {
            fireEvent.change(roleInput as Element, { target: { value: 'NewRole' } });
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(defaultProps.onClose).not.toHaveBeenCalledWith(true);
    });
});
