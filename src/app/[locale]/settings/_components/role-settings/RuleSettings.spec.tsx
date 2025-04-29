import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { RuleSettings } from 'app/[locale]/settings/_components/role-settings/RuleSettings';
import { expect } from '@jest/globals';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { CustomRender } from 'test-utils/CustomRender';
import { mockRbacRoles } from './test-data/mockRbacRoles';
import { act } from 'react';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('./../../../../../lib/hooks/UseBreakpoints', () => ({
    useIsMobile: jest.fn(() => false),
}));

jest.mock('./../../../../../components/basics/CenteredLoadingSpinner', () => ({
    CenteredLoadingSpinner: jest.fn(() => <div>Loading...</div>),
}));

describe('RoleSettings', () => {
    it('renders loading spinner while fetching data', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockImplementation(
            jest.fn(() => {
                return { isSuccess: true, result: mockRbacRoles };
            }),
        );
        CustomRender(<RuleSettings />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders role settings table with content after data is fetched', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });

        await act(async () => {
            CustomRender(<RuleSettings />);
        });

        await waitFor(() => {
            expect(within(screen.getByTestId('role-settings-row-roleId1')).getByText('Admin-Role')).toBeInTheDocument();
            expect(within(screen.getByTestId('role-settings-row-roleId1')).getByText('READ')).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId1')).getByText('aas-environment'),
            ).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId1')).getByText('aasId1, aasId2'),
            ).toBeInTheDocument();

            expect(within(screen.getByTestId('role-settings-row-roleId3')).getByText('User-Role')).toBeInTheDocument();
            expect(within(screen.getByTestId('role-settings-row-roleId3')).getByText('CREATE')).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId3')).getByText('submodelIds:'),
            ).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId3')).getByText('submodelElementIdShortPaths:'),
            ).toBeInTheDocument();
        });
    });

    it('opens RoleDialog when a role is clicked', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });

        await act(async () => {
            CustomRender(<RuleSettings />);
        });

        await waitFor(() => {
            expect(screen.getByTestId('role-settings-row-roleId1')).toBeInTheDocument();
            expect(screen.queryByTestId('role-dialog')).not.toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('role-settings-button-roleId1'));
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('role-dialog')).toBeVisible();
        });
    });
});
