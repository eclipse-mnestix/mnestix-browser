import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';
import { CustomRender } from 'test-utils/CustomRender';
import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';

describe('AuthenticationPrompt', () => {
    it('shows the sign-in flow for the default repository', () => {
        CustomRender(<AuthenticationPrompt isDefaultRepo />, { session: null });

        expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
        expect(screen.queryByTestId('authentication-prompt-contact-admin')).not.toBeInTheDocument();
    });

    it('guides the user to contact the administrator for non-default repositories', () => {
        CustomRender(<AuthenticationPrompt isDefaultRepo={false} />, { session: null });

        expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
        const adminMessage = screen.getByTestId('authentication-prompt-contact-admin');
        expect(adminMessage).toBeInTheDocument();
        expect(adminMessage).toHaveTextContent("This repository isn't using the default authentication.");
    });
});
