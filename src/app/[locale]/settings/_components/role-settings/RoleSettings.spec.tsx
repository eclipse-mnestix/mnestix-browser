import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import { RoleSettings } from './RoleSettings';
import { expect } from '@jest/globals';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { RbacRolesFetchResult } from 'lib/services/rbac-service/RbacRulesService';
import { CustomRender } from 'test-utils/CustomRender';

jest.mock('./../../../../../lib/services/rbac-service/RbacActions');
jest.mock('./../../../../../lib/hooks/UseBreakpoints', () => ({
    useIsMobile: jest.fn(() => false),
}));

const mockRbacRoles: RbacRolesFetchResult = {
    roles: [
        {
            idShort: 'roleId1',
            role: 'Admin-Role',
            action: 'READ',
            targetInformation: {
                '@type': 'aas-environment',
                aasIds: ['aasId1', 'aasId2'],
                submodelIds: ['submodelId1'],
            },
        },
        {
            idShort: 'roleId2',
            role: 'User-Role',
            action: 'CREATE',
            targetInformation: {
                '@type': 'submodel',
                submodelElementIdShortPaths: ['*'],
                submodelIds: ['*'],
            },
        },
    ],
    warnings: [],
};

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
        CustomRender(<RoleSettings />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders role settings table with content after data is fetched', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });

        CustomRender(<RoleSettings />);

        await waitFor(() => {
            expect(within(screen.getByTestId('role-settings-row-roleId1')).getByText('Admin-Role')).toBeInTheDocument();
            expect(within(screen.getByTestId('role-settings-row-roleId1')).getByText('READ')).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId1')).getByText('aas-environment'),
            ).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId1')).getByText('aasId1, aasId2'),
            ).toBeInTheDocument();

            expect(within(screen.getByTestId('role-settings-row-roleId2')).getByText('User-Role')).toBeInTheDocument();
            expect(within(screen.getByTestId('role-settings-row-roleId2')).getByText('CREATE')).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId2')).getByText('submodelIds:'),
            ).toBeInTheDocument();
            expect(
                within(screen.getByTestId('role-settings-row-roleId2')).getByText('submodelElementIdShortPaths:'),
            ).toBeInTheDocument();
        });
    });

    it('opens RoleDialog when a role is clicked', async () => {
        (rbacActions.getRbacRules as jest.Mock).mockResolvedValue({ isSuccess: true, result: mockRbacRoles });

        CustomRender(<RoleSettings />);

        await waitFor(() => {
            expect(screen.getByText('Admin-Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('role-settings-button-roleId1'));
        await waitFor(() => {
            expect(screen.getByTestId('role-settings-dialog')).toBeInTheDocument();
        });
    });
});
