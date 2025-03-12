import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Internationalization } from 'lib/i18n/Internationalization';

// Mock next-intl module
jest.mock('next-intl', () => ({
    useLocale: jest.fn().mockReturnValue('en'),
}));

interface WrapperProps {
    children: ReactNode;
}

/**
 * Custom Render method for UI Component testing.
 * Wraps the component with needed Providers.
 * This can be removed when all localization is handled by next-intl.
 * @param ui
 * @param renderOptions
 */
export const CustomRenderReactIntl = (ui: ReactNode, { ...renderOptions } = {}) => {
    const Wrapper: React.FC<WrapperProps> = ({ children }) => <Internationalization>{children}</Internationalization>;

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};
