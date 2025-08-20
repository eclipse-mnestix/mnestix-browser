import { Alert, alpha, Box, Collapse, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import { useEnv } from 'app/EnvProvider';

import {
    CONNECTION_TYPES,
    ENV_KEY_BY_CONNECTION_ID,
} from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureEnumUtil';

export function DefaultInfrastructure() {
    const [open, setOpen] = useState(false);
    const t = useTranslations('pages.settings.infrastructure');
    const theme = useTheme();
    const env = useEnv();

    return (
        <>
            <Box
                sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    p: 2,
                    '&:hover': {
                        backgroundColor: theme.palette.grey['100'],
                    },
                    cursor: 'default',
                    mb: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Default Infrastructure
                    </Typography>
                    <IconButton onClick={() => setOpen(!open)} sx={{ color: theme.palette.primary.main }} size="small">
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            </Box>
            <Collapse in={open}>
                <Box
                    sx={{
                        p: 3,
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        mb: 2,
                    }}
                >
                    <Alert severity="info">{t('form.defaultInfrastructureReadonly')}</Alert>
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
        </>
    );
}
