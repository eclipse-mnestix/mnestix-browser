import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../locale/en.json';

interface WrapperProps {
    children: ReactNode;
}

/**
 * Custom Render method for UI Component testing.
 * Wraps the component with next-intl Provider.
 * @param ui Component to render
 * @param renderOptions Additional render options
 */
export const CustomRenderNextIntl = (ui: ReactNode, { ...renderOptions } = {}) => {
    const Wrapper: React.FC<WrapperProps> = ({ children }) => (
        <NextIntlClientProvider messages={messages} locale="en">
           {children}
        </NextIntlClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};
