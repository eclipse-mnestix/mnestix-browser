import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRenderReactIntl } from 'test-utils/CustomRenderReactIntl';
import { ExternalLink } from 'layout/menu/ExternalLink';
import { messages } from 'lib/i18n/localization';

describe('ExternalLink', () => {
    it('should render the component', async () => {
        CustomRenderReactIntl(<ExternalLink href="https://xitaso.com/" descriptor='Welcome to Mnestix' />);
        const component = screen.getByTestId('external-link');
        expect(component).toBeInTheDocument();
    });

    it('should open link in new tab natively', async () => {
        CustomRenderReactIntl(<ExternalLink href="https://xitaso.com/" descriptor='Welcome to Mnestix' />);
        const component = screen.getByTestId('external-link');
        expect(component).toHaveAttribute('href', 'https://xitaso.com/');
        expect(component).toHaveAttribute('target', '_blank');
        expect(component).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should show the translated text', async () => {
        CustomRenderReactIntl(<ExternalLink href="https://xitaso.com/" descriptor='Welcome to Mnestix' />);
        const component = screen.getByTestId('external-link');
        expect(component).toHaveTextContent('Welcome to Mnestix');
    });
});
