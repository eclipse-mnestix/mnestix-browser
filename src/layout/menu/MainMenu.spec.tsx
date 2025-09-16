import { CustomRender } from 'test-utils/CustomRender';
import MainMenu from 'layout/menu/MainMenu';
import { fireEvent, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useAuth } from 'lib/hooks/UseAuth';
import AllowedRoutes, { MnestixRole } from 'components/authentication/AllowedRoutes';
import { useEnv } from 'app/EnvProvider';

jest.mock('next-auth/react');
jest.mock('../../lib/hooks/UseAuth');
jest.mock('../../app/EnvProvider');

const mockEnvVariables = jest.fn(() => {
    return {
        AAS_LIST_FEATURE_FLAG: true,
        MNESTIX_AAS_GENERATOR_API_URL: 'http://localhost:5064/backend',
        AUTHENTICATION_FEATURE_FLAG: true,
    };
});

const mockUseAuthAdmin = jest.fn(() => {
    return {
        getAccount: () => {
            return {
                user: {
                    roles: [],
                    mnestixRole: MnestixRole.MnestixAdmin,
                    allowedRoutes: AllowedRoutes.mnestixAdmin,
                },
            };
        },
        isLoggedIn: true,
    };
});

const mockUseAuthUser = jest.fn(() => {
    return {
        getAccount: () => {
            return {
                user: {
                    roles: [],
                    mnestixRole: MnestixRole.MnestixUser,
                    allowedRoutes: AllowedRoutes.mnestixUser,
                },
            };
        },
        isLoggedIn: true,
    };
});

const mockUseAuthNotLoggedIn = jest.fn(() => {
    return {
        getAccount: () => {},
        isLoggedIn: false,
    };
});

function renderAndOpenMenu() {
    CustomRender(<MainMenu></MainMenu>);
    const burgerMenu = screen.getByTestId('header-burgermenu');
    fireEvent.click(burgerMenu);
}

describe('MainMenu', () => {
    beforeAll(() => {
        (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
    });

    it('should be able to open the menu', () => {
        (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);
        renderAndOpenMenu();

        const mainMenu = screen.getByTestId('main-menu');
        expect(mainMenu).toBeInTheDocument();
    });
    describe('logged in as admin', () => {
        it('should show all allowed admin actions', () => {
            (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);
            renderAndOpenMenu();

            const templates = screen.getByTestId('/templates');
            expect(templates).toBeInTheDocument();

            const settings = screen.getByTestId('/settings');
            expect(settings).toBeInTheDocument();
        });
    });
    describe('logged in user', () => {
        it('should show all allowed user actions', () => {
            (useAuth as jest.Mock).mockImplementation(mockUseAuthUser);
            renderAndOpenMenu();

            const templates = screen.getByTestId('/templates');
            expect(templates).toBeInTheDocument();
        });
    });
    describe('not logged in', () => {
        it('should show all allowed not-logged-in actions', () => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthNotLoggedIn);
            renderAndOpenMenu();

            const templates = screen.getByTestId('/');
            expect(templates).toBeInTheDocument();

            const list = screen.getByTestId('/list');
            expect(list).toBeInTheDocument();
        });
    });
});
