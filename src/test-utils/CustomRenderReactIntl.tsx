import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Internationalization } from 'lib/i18n/Internationalization';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../locale/en.json';

interface WrapperProps {
    children: ReactNode;
}

/**
 * Custom Render method for UI Component testing.
 * Wraps the component with both react-intl and next-intl Providers
 * for transition period.
 * @param ui Component to render
 * @param renderOptions Additional render options
 */
export const CustomRenderReactIntl = (ui: ReactNode, { ...renderOptions } = {}) => {
    const Wrapper: React.FC<WrapperProps> = ({ children }) => (
        <NextIntlClientProvider messages={messages} locale="en">
            <Internationalization>{children}</Internationalization>
        </NextIntlClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};
