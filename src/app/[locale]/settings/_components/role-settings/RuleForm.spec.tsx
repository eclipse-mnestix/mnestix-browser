import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RuleForm } from './RuleForm';
import { expect } from '@jest/globals';
import { act } from 'react';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { mockRbacRoles } from './test-data/mockRbacRoles';

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
/*
  This file tests the whole RuleForm including the TargetInformationForm + WildcardOrStringArrayInput components
 */
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
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });
    });

    it('renders the form with initial values', async () => {
        await act(async () => {
            render(<RuleForm {...defaultProps} />);
        });

        expect(screen.getByTestId('rule-settings-name-input').querySelector('input')).toHaveValue('Admin');
        expect(screen.getByTestId('rule-settings-action-select').querySelector('input')).toHaveValue('READ');
    });

    it('calls onSubmit with form data when save button is clicked', async () => {
        await act(async () => {
            render(<RuleForm {...defaultProps} />);
        });

        await act(() => {
            fireEvent.click(screen.getByTestId('role-settings-save-button'));
        });

        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', async () => {
        await act(async () => {
            render(<RuleForm {...defaultProps} />);
        });

        fireEvent.click(screen.getByText('buttons.cancel'));

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('shows validation error when role field is empty', async () => {
        await act(async () => {
            render(<RuleForm {...defaultProps} />);
        });

        const roleInput = screen.getByTestId('rule-settings-name-input').querySelector('input');
        fireEvent.change(roleInput as Element, { target: { value: '' } });
        fireEvent.click(screen.getByTestId('role-settings-save-button'));

        expect(await screen.findByText('roleRequired')).toBeInTheDocument();
    });

    describe('TargetInformation form part', () => {
        it('renders TargetInformationForm with initial id values', async () => {
            await act(async () => {
                render(<RuleForm {...defaultProps} />);
            });

            expect(screen.getByTestId('rule-settings-target-select').querySelector('input')).toHaveValue(
                'aas-environment',
            );
            expect(screen.getByTestId('input-aas-environment-aasIds-0').querySelector('input')).toHaveValue('aas1');
            expect(screen.getByTestId('input-aas-environment-submodelIds-0').querySelector('input')).toHaveValue(
                'submodel1',
            );
        });

        it('updates TargetInformationForm values when inputs are changed', async () => {
            await act(async () => {
                render(<RuleForm {...defaultProps} />);
            });

            const aasInput = screen.getByTestId('input-aas-environment-aasIds-0').querySelector('input');
            fireEvent.change(aasInput as Element, { target: { value: 'new-aas-id' } });
            const submodelInput = screen.getByTestId('input-aas-environment-submodelIds-0').querySelector('input');
            fireEvent.change(submodelInput as Element, { target: { value: 'new-submodel-id' } });

            expect(aasInput).toHaveValue('new-aas-id');
            expect(submodelInput).toHaveValue('new-submodel-id');
        });

        it('handles wildcard checkbox in TargetInformationForm', async () => {
            await act(async () => {
                render(<RuleForm {...defaultProps} />);
            });

            const wildcardCheckbox = screen.getByTestId('checkbox-aas-environment-aasIds').querySelector('input');
            await act(async () => {
                fireEvent.click(wildcardCheckbox as Element);
            });

            expect(wildcardCheckbox).toBeChecked();
            expect(screen.queryByTestId('input-aas-environment-aasIds-0')).not.toBeInTheDocument();
            await act(() => {
                fireEvent.click(screen.getByTestId('role-settings-save-button'));
            });
            expect(defaultProps.onSubmit.mock.calls[0][0]).toEqual(
                expect.objectContaining({
                    action: 'READ',
                    role: 'Admin',
                    type: 'aas-environment',
                    targetInformation: expect.objectContaining({
                        'aas-environment': expect.objectContaining({
                            aasIds: [{ id: '*' }],
                            submodelIds: [{ id: 'submodel1' }],
                        }),
                    }),
                }),
            );
        });

        it('enables inputs when wildcard is deselected', async () => {
            await act(async () => {
                render(<RuleForm {...defaultProps} />);
            });

            const wildcardCheckbox = screen.getByTestId('checkbox-aas-environment-aasIds').querySelector('input');
            await act(async () => {
                fireEvent.click(wildcardCheckbox as Element); // Select
                fireEvent.click(wildcardCheckbox as Element); // Deselect
            });

            expect(wildcardCheckbox).not.toBeChecked();
            expect(screen.getByTestId('input-aas-environment-aasIds-0')).toBeInTheDocument();
        });

        it('is possible to add and remove inputs when wildcard is deselected', async () => {
            await act(async () => {
                render(<RuleForm {...defaultProps} />);
            });
            const addButton = screen.getByTestId('add-aas-environment-aasIds');
            await act(async () => {
                fireEvent.click(addButton);
            });
            expect(screen.getByTestId('input-aas-environment-aasIds-1')).toBeInTheDocument();

            const removeButton = screen.getByTestId('remove-aas-environment-aasIds-1');
            await act(async () => {
                fireEvent.click(removeButton);
            });
            expect(screen.queryByTestId('input-aas-environment-aasIds-1')).not.toBeInTheDocument();
        });

        it('sets wildcard to true when last input element is removed', async () => {
            await act(async () => {
                render(<RuleForm {...defaultProps} />);
            });
            const removeButton = screen.getByTestId('remove-aas-environment-aasIds-0');
            await act(async () => {
                fireEvent.click(removeButton);
            });

            const wildcardCheckbox = screen.getByTestId('checkbox-aas-environment-aasIds').querySelector('input');
            expect(wildcardCheckbox).toBeChecked();
        });
    });

    it('shows Admin-Role as autocomplete option for roles', async () => {
        await act(async () => {
            render(<RuleForm {...defaultProps} />);
        });

        const autocompleteInput = screen.getByTestId('rule-settings-name-input').querySelector('input');

        userEvent.click(autocompleteInput as Element);

        const listbox = await screen.findByRole('listbox');
        const option = within(listbox).getByText('Admin-Role');

        userEvent.click(option);

        await waitFor(() => expect(autocompleteInput).toHaveValue('Admin-Role'));
    });
});
