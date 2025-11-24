'use client';

import { Box, Card, IconButton, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslations } from 'next-intl';
import { MnestixConnection } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { searchProducts } from 'lib/api/graphql/catalogActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import Image from 'next/image';

type ManufacturerCardProps = {
    connection: MnestixConnection;
};

export function ManufacturerCard({ connection }: ManufacturerCardProps) {
    const theme = useTheme();
    const t = useTranslations('pages.catalog');
    const navigate = useRouter();
    const [resultCount, setResultCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useAsyncEffect(async () => {
        setIsLoading(true);
        try {
            if (connection && connection.aasSearcher) {
                const data = await searchProducts(connection.aasSearcher);
                setResultCount(Array.isArray(data.result) ? data.result.length : 0);
            }
        } catch (error) {
            console.error('Error fetching article count:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const manufacturer = connection.name || 'unknown';

    const onNavigate = () => {
        if (connection.name) {
            navigate.push(`/marketplace/catalog?manufacturer=${encodeURIComponent(connection.name)}`);
        } else {
            navigate.push(`/marketplace/catalog?repoUrl=${encodeURIComponent(connection.url)}`);
        }
    };

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
                <Image
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
                {isLoading ? (
                    <CenteredLoadingSpinner />
                ) : resultCount !== null ? (
                    <Typography color="text.secondary" fontSize="1.1rem">
                        {t('articleCount', { count: resultCount ?? 0 })}
                    </Typography>
                ) : (
                    <Typography color="text.secondary" fontSize="1.1rem">
                        {t('articleCountUnavailable')}
                    </Typography>
                )}
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
