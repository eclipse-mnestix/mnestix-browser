import { screen, fireEvent } from '@testing-library/react';
import { expect } from '@jest/globals';
import { RoleActionMenu } from './RoleActionMenu';
import { CustomRender } from 'test-utils/CustomRender';

describe('RoleActionMenu', () => {
    const mockOpenCreateDialog = jest.fn();
    const mockOpenDeleteRoleDialog = jest.fn();
    const testRoleName = 'test-role';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the menu button', () => {
        CustomRender(
            <RoleActionMenu
                roleName={testRoleName}
                openCreateDialog={mockOpenCreateDialog}
                openDeleteRoleDialog={mockOpenDeleteRoleDialog}
            />,
        );

        const menuButton = screen.getByRole('button');
        expect(menuButton).toBeInTheDocument();
    });

    it('opens menu when button is clicked', () => {
        CustomRender(
            <RoleActionMenu
                roleName={testRoleName}
                openCreateDialog={mockOpenCreateDialog}
                openDeleteRoleDialog={mockOpenDeleteRoleDialog}
            />,
        );

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        // Check if menu items are visible
        expect(screen.getByTestId('create-rule-menu-item')).toBeInTheDocument();
        expect(screen.getByTestId('delete-role-menu-item')).toBeInTheDocument();
    });

    it('calls openCreateDialog with roleName when create rule is clicked', () => {
        CustomRender(
            <RoleActionMenu
                roleName={testRoleName}
                openCreateDialog={mockOpenCreateDialog}
                openDeleteRoleDialog={mockOpenDeleteRoleDialog}
            />,
        );

        // Open menu
        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        // Click create rule menu item
        const createRuleMenuItem = screen.getByTestId('create-rule-menu-item');
        fireEvent.click(createRuleMenuItem);

        expect(mockOpenCreateDialog).toHaveBeenCalledWith(testRoleName);
        expect(mockOpenCreateDialog).toHaveBeenCalledTimes(1);
    });

    it('calls openDeleteRoleDialog with roleName when delete role is clicked', () => {
        CustomRender(
            <RoleActionMenu
                roleName={testRoleName}
                openCreateDialog={mockOpenCreateDialog}
                openDeleteRoleDialog={mockOpenDeleteRoleDialog}
            />,
        );

        // Open menu
        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        // Click delete role menu item
        const deleteRoleMenuItem = screen.getByTestId('delete-role-menu-item');
        fireEvent.click(deleteRoleMenuItem);

        expect(mockOpenDeleteRoleDialog).toHaveBeenCalledWith(testRoleName);
        expect(mockOpenDeleteRoleDialog).toHaveBeenCalledTimes(1);
    });

    it('renders with different role names', () => {
        const differentRoleName = 'admin-role';

        CustomRender(
            <RoleActionMenu
                roleName={differentRoleName}
                openCreateDialog={mockOpenCreateDialog}
                openDeleteRoleDialog={mockOpenDeleteRoleDialog}
            />,
        );

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        const createRuleMenuItem = screen.getByTestId('create-rule-menu-item');
        fireEvent.click(createRuleMenuItem);

        expect(mockOpenCreateDialog).toHaveBeenCalledWith(differentRoleName);
    });
});
