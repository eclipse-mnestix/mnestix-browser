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

    const handleCopyValue = () => {
        if (value) {
            const textToCopy = withBase64 ? encodeBase64(value) : value;
            navigator.clipboard.writeText(textToCopy);
            notificationSpawner.spawn({
                message: t('copied') + ': ' + textToCopy,
                severity: 'success',
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
