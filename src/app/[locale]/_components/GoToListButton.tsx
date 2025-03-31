'use client';
import { Box, Button, Typography } from '@mui/material';
import { useEnv } from 'app/EnvProvider';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { messages } from 'lib/i18n/localization';
import { useRouter } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

export const GoToListButton = () => {
    const isMobile = useIsMobile();
    const env = useEnv();
    const navigate = useRouter();

    return (
        <>
            {!isMobile && env.AAS_LIST_FEATURE_FLAG && (
                <Box display="flex" flexDirection="column">
                    <Typography color="text.secondary" textAlign="center" sx={{ mb: 2, mt: 6 }}>
                        <FormattedMessage {...messages.mnestix.orSelectFromList} />:
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            data-testid="aasList-Button-Home"
                            onClick={() => navigate.push('/list')}
                        >
                            <FormattedMessage {...messages.mnestix.goToListButton} />
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};
