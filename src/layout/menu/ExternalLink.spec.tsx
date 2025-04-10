import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRenderNextIntl } from 'test-utils/CustomRenderNextIntl';
import { ExternalLink } from 'layout/menu/ExternalLink';

describe('ExternalLink', () => {
    it('should render the component', async () => {
        CustomRenderNextIntl(<ExternalLink href="https://xitaso.com/" descriptor='Welcome to Mnestix' />);
        const component = screen.getByTestId('external-link');
        expect(component).toBeInTheDocument();
    });

    it('should open link in new tab natively', async () => {
        CustomRenderNextIntl(<ExternalLink href="https://xitaso.com/" descriptor='Welcome to Mnestix' />);
        const component = screen.getByTestId('external-link');
        expect(component).toHaveAttribute('href', 'https://xitaso.com/');
        expect(component).toHaveAttribute('target', '_blank');
        expect(component).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should show the translated text', async () => {
        CustomRenderNextIntl(<ExternalLink href="https://xitaso.com/" descriptor='Welcome to Mnestix' />);
        const component = screen.getByTestId('external-link');
        expect(component).toHaveTextContent('Welcome to Mnestix');
    });
});
