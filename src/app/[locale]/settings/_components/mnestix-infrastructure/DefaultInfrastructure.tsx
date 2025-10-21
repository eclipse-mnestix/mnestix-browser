import { Alert, alpha, Box, Collapse, IconButton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import { useEnv } from 'app/EnvProvider';
import {
    CONNECTION_TYPES,
    ENV_KEY_BY_CONNECTION_ID,
} from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureEnumUtil';
import { getDefaultInfrastructureName } from 'lib/services/database/infrastructureDatabaseActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { HealthCheckIndicator } from 'components/basics/HealthCheckIndicator';
import { useHealthCheckContext } from 'components/contexts/HealthCheckContext';

export function DefaultInfrastructure() {
    const [open, setOpen] = useState(false);
    const t = useTranslations('pages.settings.infrastructure');
    const theme = useTheme();
    const env = useEnv();
    const [defaultInfrastructureName, setDefaultInfrastructureName] = useState('Default');
    const { fetchHealthCheck } = useHealthCheckContext();

    useAsyncEffect(async () => {
        setDefaultInfrastructureName(await getDefaultInfrastructureName());
    }, []);

    // Fetch health check when default infrastructure panel is opened
    useEffect(() => {
        if (open) {
            fetchHealthCheck();
        }
    }, [open]);

    return (
        <Box sx={{ border: `1px solid ${theme.palette.grey['300']}`, mb: 1, borderRadius: 1 }}>
            <Box
                sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    p: 2,
                    '&:hover': {
                        backgroundColor: theme.palette.grey['100'],
                    },
                    cursor: 'default',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {defaultInfrastructureName}
                    </Typography>
                    <IconButton onClick={() => setOpen(!open)} sx={{ color: theme.palette.primary.main }} size="small">
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            </Box>
            <Collapse in={open}>
                <Box
                    sx={{
                        px: 2,
                        pt: 1,
                        pb: 3,
                    }}
                >
                    <Alert severity="info">{t('form.defaultInfrastructureReadonly')}</Alert>

                    {env.MNESTIX_AAS_GENERATOR_API_URL && (
                        <Box display="flex" gap={2} my={2} alignItems="center">
                            <Typography sx={{ minWidth: 320 }} variant="h5">
                                {t('healthCheck.aasGeneratorLabel')}
                            </Typography>
                            <Typography>{env.MNESTIX_AAS_GENERATOR_API_URL}</Typography>
                            <HealthCheckIndicator />
                            <IconButton
                                onClick={fetchHealthCheck}
                                size="small"
                                sx={{ ml: 0 }}
                                title={t('healthCheck.refresh')}
                            >
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    <Typography variant="h3" sx={{ my: 2, color: theme.palette.primary.main }}>
                        {t('form.endpoints')}
                    </Typography>
                    <Box>
                        {CONNECTION_TYPES.map((type) => (
                            <Box key={type.id} display="flex" gap={2} mb={1}>
                                <Typography sx={{ minWidth: 320 }} variant="h5">
                                    {type.label}
                                </Typography>
                                <Typography>{env[ENV_KEY_BY_CONNECTION_ID[type.id]] || '-'}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}
