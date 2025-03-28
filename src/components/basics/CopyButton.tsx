import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { encodeBase64 } from 'lib/util/Base64Util';

type CopyButtonProps = {
    value?: string | null;
    isVisible?: boolean;
    withBase64?: boolean;
    'data-testid'?: string;
};

export function CopyButton({ value, isVisible = true, withBase64 = false, 'data-testid': testId }: CopyButtonProps) {
    const intl = useIntl();
    const notificationSpawner = useNotificationSpawner();

    const handleCopyValue = () => {
        if (value) {
            const textToCopy = withBase64 ? encodeBase64(value) : value;
            navigator.clipboard.writeText(textToCopy);
            notificationSpawner.spawn({
                message: intl.formatMessage(messages.mnestix.copied) + ": " + textToCopy,
                severity: 'success',
            });
        }
    };

    if (!value) return null;

    return (
        <Tooltip title={intl.formatMessage(messages.mnestix.copy)}>
            <IconButton
                onClick={handleCopyValue}
                size="small"
                sx={{ ml: 1, opacity: isVisible ? 1 : 0 }}
                data-testid={testId || "copy-button"}
            >
                {withBase64 ? (
                    <Box sx={{ position: 'relative' }}>
                        <ContentCopy fontSize="small" />
                        <Typography
                            sx={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                fontSize: '0.5rem',
                                fontWeight: 'bold',
                                backgroundColor: 'background.paper',
                                lineHeight: 1,
                                padding: '1px',
                                borderRadius: '2px'
                            }}
                        >
                            64
                        </Typography>
                    </Box>
                ) : (
                    <ContentCopy fontSize="small" />
                )}
            </IconButton>
        </Tooltip>
    );
}