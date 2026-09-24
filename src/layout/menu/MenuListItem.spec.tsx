import { expect } from '@jest/globals';
import { screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';
import { MenuListItem } from 'layout/menu/MenuListItem';

jest.mock('next/navigation', () => ({
    usePathname() {
        return null;
    },
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: () => null,
        };
    },
    useParams() {
        return {};
    },
}));

describe('MenuListItem', () => {
    it('renders the internal target href with the current locale prefix', () => {
        CustomRender(<MenuListItem to="/list" label="AAS List" />, { locale: 'de' });

        expect(screen.getByTestId('/list')).toHaveAttribute('href', '/de/list');
    });

    it('renders the home target with only the locale as href', () => {
        CustomRender(<MenuListItem to="/" label="Dashboard" />, { locale: 'de' });

        expect(screen.getByTestId('/')).toHaveAttribute('href', '/de');
    });

    it('renders an external target as a plain anchor without locale prefix', () => {
        CustomRender(<MenuListItem to="https://mnestix.io/" label="mnestix.io" external target="_blank" />, {
            locale: 'de',
        });

        expect(screen.getByTestId('https://mnestix.io/')).toHaveAttribute('href', 'https://mnestix.io/');
    });
});
