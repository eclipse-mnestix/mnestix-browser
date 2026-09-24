import { expect } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';
import { HeaderLogo } from 'layout/HeaderLogo';

const mockPush = jest.fn();

jest.mock('../i18n/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
    }),
}));
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));

describe('HeaderLogo', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('navigates to the home page through the locale-aware router', () => {
        CustomRender(<HeaderLogo />);

        fireEvent.click(screen.getByTestId('header-logo'));

        expect(mockPush).toHaveBeenCalledWith('/');
    });
});
