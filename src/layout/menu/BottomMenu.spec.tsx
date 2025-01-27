import { CustomRender } from 'test-utils/CustomRender';
import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useAuth } from 'lib/hooks/UseAuth';
import BottomMenu from 'layout/menu/BottomMenu';
import { MnestixRole } from 'components/authentication/AllowedRoutes';

jest.mock('../../lib/hooks/useAuth');

const mockUseAuth = jest.fn(() => {
    return {
        getAccount: () => {},
        isLoggedIn: false,
    };
});

describe('BottomMenu', () => {
    beforeAll(() => {
        (useAuth as jest.Mock).mockImplementation(mockUseAuth);
    });

    it('should show the login button for not logged-in user', () => {
        CustomRender(<BottomMenu isLoggedIn={false} name={''} mnestixRole={MnestixRole.MnestixGuest}></BottomMenu>);

        const loginButton = screen.getByTestId('sidebar-button');
        expect(loginButton).toHaveTextContent('Login');
    });

    it('should show the users name and logout button when logged in', () => {
        CustomRender(
            <BottomMenu isLoggedIn={true} name={'test user'} mnestixRole={MnestixRole.MnestixAdmin}></BottomMenu>,
        );

        const logoutButton = screen.getByTestId('sidebar-button');
        expect(logoutButton).toHaveTextContent('Logout');

        const name = screen.getByTestId('user-info-box');
        expect(name).toHaveTextContent('test user');
    });
});
