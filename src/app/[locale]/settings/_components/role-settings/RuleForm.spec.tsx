import { fireEvent, render, screen } from '@testing-library/react';
import { RuleForm } from './RuleForm';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { expect } from '@jest/globals';
import { act } from 'react';

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

describe('RuleForm', () => {
    const mockRule: BaSyxRbacRule = {
        idShort: 'test-id',
        role: 'Admin',
        action: 'READ',
        targetInformation: {
            '@type': 'aas-environment',
            aasIds: ['aas1'],
            submodelIds: ['submodel1'],
        },
    };

    const defaultProps = {
        onSubmit: jest.fn(),
        onCancel: jest.fn(),
        rule: mockRule,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form with initial values', () => {
        render(<RuleForm {...defaultProps} />);

        expect(screen.getByTestId('rule-settings-name-input').querySelector('input')).toHaveValue('Admin');
        expect(screen.getByTestId('rule-settings-action-select').querySelector('input')).toHaveValue('READ');
    });

    it('calls onSubmit with form data when save button is clicked', async () => {
        render(<RuleForm {...defaultProps} />);

        await act(() => {
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<RuleForm {...defaultProps} />);
        act(() => {
            fireEvent.click(screen.getByText('buttons.cancel'));
        });
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('shows validation error when role field is empty', async () => {
        render(<RuleForm {...defaultProps} />);

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        fireEvent.change(roleInput as Element, { target: { value: '' } });
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        expect(await screen.findByText('roleRequired')).toBeInTheDocument();
    });
});
