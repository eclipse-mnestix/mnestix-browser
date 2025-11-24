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
        MNESTIX_BACKEND_API_URL: 'http://localhost:5064/backend',
        AUTHENTICATION_FEATURE_FLAG: true,
        EXTERNAL_LINKS: [],
    };
});

const mockEnvVariablesWithExternalLinks = jest.fn(() => {
    return {
        AAS_LIST_FEATURE_FLAG: true,
        MNESTIX_BACKEND_API_URL: 'http://localhost:5064/backend',
        AUTHENTICATION_FEATURE_FLAG: true,
        EXTERNAL_LINKS: [
            {
                label: 'Test External Link',
                url: 'https://example.com',
                icon: 'OpenInNew',
                target: '_blank',
            },
            {
                label: 'Another Link',
                url: 'https://another-example.com',
                icon: 'Link',
            },
        ],
    };
});

const mockEnvVariablesWithI18nExternalLinks = jest.fn(() => {
    return {
        AAS_LIST_FEATURE_FLAG: true,
        MNESTIX_BACKEND_API_URL: 'http://localhost:5064/backend',
        AUTHENTICATION_FEATURE_FLAG: true,
        EXTERNAL_LINKS: [
            {
                label: {
                    en: 'Documentation',
                    de: 'Dokumentation',
                },
                url: 'https://docs.example.com',
                icon: 'MenuBook',
                target: '_blank',
            },
            {
                label: {
                    en: 'Support',
                    de: 'Unterstützung',
                },
                url: 'https://support.example.com',
                icon: 'Help',
            },
        ],
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

    describe('external links', () => {
        it('should render external links from environment configuration', () => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariablesWithExternalLinks);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);
            renderAndOpenMenu();

            const externalLink1 = screen.getByTestId('https://example.com');
            expect(externalLink1).toBeInTheDocument();
            expect(externalLink1).toHaveTextContent('Test External Link');

            const externalLink2 = screen.getByTestId('https://another-example.com');
            expect(externalLink2).toBeInTheDocument();
            expect(externalLink2).toHaveTextContent('Another Link');
        });

        it('should render i18n external links with correct language', () => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariablesWithI18nExternalLinks);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);
            renderAndOpenMenu();

            const docLink = screen.getByTestId('https://docs.example.com');
            expect(docLink).toBeInTheDocument();
            expect(docLink).toHaveTextContent('Documentation'); // English is default in tests

            const supportLink = screen.getByTestId('https://support.example.com');
            expect(supportLink).toBeInTheDocument();
            expect(supportLink).toHaveTextContent('Support');
        });

        it('should not render external links when EXTERNAL_LINKS is empty', () => {
            (useEnv as jest.Mock).mockImplementation(mockEnvVariables);
            (useAuth as jest.Mock).mockImplementation(mockUseAuthAdmin);
            renderAndOpenMenu();

            const externalLink = screen.queryByTestId('https://example.com');
            expect(externalLink).not.toBeInTheDocument();
        });
    });
});
