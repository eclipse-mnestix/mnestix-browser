import { expect } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';
import { LanguageSelector } from 'layout/LanguageSelector';
import { usePathname } from '../i18n/navigation';
import { useSearchParams } from 'next/navigation';

const mockNextIntlRouterReplace = jest.fn();

jest.mock('../i18n/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: mockNextIntlRouterReplace,
    }),
    usePathname: jest.fn(),
}));
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    // Legacy collaborators of the old implementation; present so a
    // non-locale-aware router usage runs and fails on the assertion,
    // not on a crash.
    usePathname: jest.fn(),
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));
jest.mock('../lib/hooks/UseBreakpoints', () => ({
    useIsMobile: () => false,
}));

describe('LanguageSelector', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    function selectLanguage(code: string) {
        fireEvent.mouseDown(screen.getByRole('combobox'));
        fireEvent.click(screen.getByTestId(`language-${code}`));
    }

    it('switches the locale via the locale-aware router, keeping the current path', () => {
        (usePathname as jest.Mock).mockReturnValue('/viewer/abc');
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
        CustomRender(<LanguageSelector />);

        selectLanguage('de');

        expect(mockNextIntlRouterReplace).toHaveBeenCalledWith('/viewer/abc', { locale: 'de' });
    });

    it('keeps the search params when switching the locale', () => {
        (usePathname as jest.Mock).mockReturnValue('/list');
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('repoUrl=https://repo.example'));
        CustomRender(<LanguageSelector />);

        selectLanguage('es');

        expect(mockNextIntlRouterReplace).toHaveBeenCalledWith('/list?repoUrl=https%3A%2F%2Frepo.example', {
            locale: 'es',
        });
    });
});
