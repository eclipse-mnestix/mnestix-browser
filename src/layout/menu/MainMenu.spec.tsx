import { CustomRender } from 'test-utils/CustomRender';
import MainMenu from 'layout/menu/MainMenu';
import { fireEvent, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useAuth } from 'lib/hooks/UseAuth';
import AllowedRoutes, { MnestixRole } from 'components/authentication/AllowedRoutes';
import { useEnv } from 'app/env/provider';

jest.mock('next-auth/react');
jest.mock('../../lib/hooks/useAuth');
jest.mock('../../app/env/provider');

const mockEnvVariables = jest.fn(() => {
    return {
        AAS_LIST_FEATURE_FLAG: true,
        MNESTIX_BACKEND_API_URL: 'http://localhost:5064/backend',
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

describe('MainMenu', () => {
    it('Should be able to open the menu', () => {
        (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
        (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);
        CustomRender(<MainMenu></MainMenu>);
        const burgerMenu = screen.getByTestId('header-burgermenu');
        fireEvent.click(burgerMenu);
        const mainMenu = screen.getByTestId('main-menu');
        expect(mainMenu).toBeInTheDocument();
    });
    describe('logged in as admin', () => {
        beforeAll(() => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);

            CustomRender(<MainMenu></MainMenu>);
            const burgerMenu = screen.getByTestId('header-burgermenu');
            fireEvent.click(burgerMenu);
        });
        it('should show all allowed admin actions', () => {
            const templates = screen.getByTestId('/templates');
            expect(templates).toBeInTheDocument();

            const settings = screen.getByTestId('/settings');
            expect(settings).toBeInTheDocument();
        });
    });
    describe('logged in user', () => {
        beforeAll(() => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthUser);

            CustomRender(<MainMenu></MainMenu>);
            const burgerMenu = screen.getByTestId('header-burgermenu');
            fireEvent.click(burgerMenu);
        });
        it('should show all allowed user actions', () => {
            const templates = screen.getByTestId('/templates');
            expect(templates).toBeInTheDocument();
        });
    });
    describe('not logged in', () => {
        beforeAll(() => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthNotLoggedIn);

            CustomRender(<MainMenu></MainMenu>);
            const burgerMenu = screen.getByTestId('header-burgermenu');
            fireEvent.click(burgerMenu);
        });
        it('should show all allowed not-logged-in actions', () => {
            const templates = screen.getByTestId('/');
            expect(templates).toBeInTheDocument();

            const settings = screen.getByTestId('/list');
            expect(settings).toBeInTheDocument();
        });
    });
});
