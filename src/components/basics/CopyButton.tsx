import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { encodeBase64 } from 'lib/util/Base64Util';
import { useTranslations } from 'next-intl';

type CopyButtonProps = {
    value?: string | null;
    isVisible?: boolean;
    withBase64?: boolean;
    dataTestId?: string;
    size?: 'small' | 'medium' | 'large';
};

export function CopyButton({
    value,
    isVisible = true,
    withBase64 = false,
    dataTestId: testId,
    size = 'small',
}: CopyButtonProps) {
    const t = useTranslations('components.copyButton');
    const notificationSpawner = useNotificationSpawner();

    const handleCopyValue = async () => {
        if (!value) return;

        const textToCopy = withBase64 ? encodeBase64(value) : value;

        // Check if Clipboard API is available (requires HTTPS or localhost)
        if (!navigator.clipboard || !window.isSecureContext) {
            console.warn('Clipboard API requires a secure context (HTTPS)');
            notificationSpawner.spawn({
                message: t('requiresHttps'),
                severity: 'warning',
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            notificationSpawner.spawn({
                message: t('copied') + ': ' + textToCopy,
                severity: 'success',
            });
        } catch (err) {
            console.warn('Failed to copy text: ', err);
            notificationSpawner.spawn({
                message: t('copyFailed'),
                severity: 'error',
            });
        }
    };

    if (!value) return null;

    return (
        <Tooltip title={withBase64 ? t('copyBase64') : t('copy')}>
            <IconButton
                onClick={handleCopyValue}
                size={size}
                sx={{ ml: 1, opacity: isVisible ? 1 : 0, alignSelf: 'center' }}
                data-testid={testId || 'copy-button'}
            >
                {withBase64 ? (
                    <Box sx={{ position: 'relative' }}>
                        <ContentCopy fontSize={size} />
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
                                borderRadius: '2px',
                            }}
                        >
                            64
                        </Typography>
                    </Box>
                ) : (
                    <ContentCopy fontSize={size} />
                )}
            </IconButton>
        </Tooltip>
    );
}
