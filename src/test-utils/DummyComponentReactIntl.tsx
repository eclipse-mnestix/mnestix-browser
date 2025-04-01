'use client';

import { Box } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';

export function DummyComponentReactIntl() {
    return (
        <Box data-testid="test-text">
            <FormattedMessage {...messages.mnestix.aasId} />
        </Box>
    );
}
