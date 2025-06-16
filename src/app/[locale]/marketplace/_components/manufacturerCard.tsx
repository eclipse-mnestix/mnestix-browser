'use client';

import { Box, Card, IconButton, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslations } from 'next-intl';
import { MnestixConnection } from '@prisma/client';
import { useRouter } from 'next/navigation';

type ManufacturerCardProps = {
    connection: MnestixConnection;
};

export function ManufacturerCard({ connection }: ManufacturerCardProps) {
    const theme = useTheme();
    const t = useTranslations('pages.catalog');
    const navigate = useRouter();

    const manufacturer = connection.name || 'unknown';

    const onNavigate = () => {
        if (connection.name) {
            navigate.push(`/marketplace/catalog?manufacturer=${encodeURIComponent(connection.name)}`);
        } else {
            navigate.push(`/marketplace/catalog?repoUrl=${encodeURIComponent(connection.url)}`);
        }
    };

    const getArticleCount = () => {
        // Placeholder for article count logic -> needs to be implemented in the AAS Searcher Backend first
        return  Math.floor(Math.random() * (150 - 10 + 1)) + 10;
    }

    return (
        <Card
            sx={{
                width: 300,
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
                boxShadow: 2,
                borderRadius: 3,
                position: 'relative',
                cursor: 'pointer',
                background: theme.palette.background.paper,
            }}
            onClick={onNavigate}
        >
            {connection.image ? (
                <img
                    src={connection.image}
                    alt={`${manufacturer} Logo`}
                    width={180}
                    height={70}
                    style={{ objectFit: 'contain' }}
                />
            ) : (
                <Typography variant="h6" fontWeight={600}>
                    {connection.url}
                </Typography>
            )}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                <Typography color="text.secondary" fontSize="1.1rem">
                    {t('articleCount', { count: getArticleCount() })}
                </Typography>
                <IconButton
                    onClick={onNavigate}
                    sx={{
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        '&:hover': { bgcolor: theme.palette.primary.main },
                        cursor: 'pointer',
                    }}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Card>
    );
}
