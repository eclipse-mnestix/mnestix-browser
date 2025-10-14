import { Box, Chip, CircularProgress, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslations } from 'next-intl';
import { useHealthCheckContext } from 'components/contexts/HealthCheckContext';

/**
 * Displays the health status and version of the AAS backend
 */
export function HealthCheckIndicator() {
    const { healthStatus, isLoading, hasError } = useHealthCheckContext();
    const t = useTranslations('pages.settings.infrastructure');

    if (isLoading && !healthStatus) {
        return (
            <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} />
                <Typography variant="body2">{t('healthCheck.checking')}</Typography>
            </Box>
        );
    }

    if (hasError || !healthStatus) {
        return (
            <Tooltip title={t('healthCheck.unreachable')}>
                <Chip icon={<ErrorIcon />} label={t('healthCheck.offline')} color="error" size="small" />
            </Tooltip>
        );
    }

    const applicationData = healthStatus.entries.application_info.data;
    const formattedBuildDate = new Date(applicationData.buildDate).toLocaleString();

    return (
        <Tooltip title={`${t('healthCheck.buildDate')}: ${formattedBuildDate}`}>
            <Chip
                icon={healthStatus.status === 'Healthy' ? <CheckCircleIcon /> : <ErrorIcon />}
                label={
                    <Box component="span" display="inline-flex" alignItems="center" gap={0.5}>
                        <span>
                            {t('healthCheck.applicationVersion')}: {applicationData.applicationVersion}
                        </span>
                        <Box component="span" sx={{ opacity: 0.7, fontSize: '0.9em' }}>
                            {' | '}
                        </Box>
                        <span>
                            {t('healthCheck.version')} {applicationData.apiVersion}
                        </span>
                    </Box>
                }
                color={healthStatus.status === 'Healthy' ? 'success' : 'error'}
                size="small"
            />
        </Tooltip>
    );
}
