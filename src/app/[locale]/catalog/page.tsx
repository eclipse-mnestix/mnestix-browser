'use client';
import { Box, Button, Card, Typography, useTheme, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ListHeader from 'components/basics/ListHeader';
import { CatalogConfiguration } from './catalogConfiguration';
import Image from 'next/image';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { getCatalogBreadcrumbs } from 'app/catalog/breadcrumbs';
import React from 'react';
import InsightsIcon from '@mui/icons-material/Insights';
import { ConstructionDialog } from 'components/basics/ConstructionDialog';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';
import { getConnectionDataByTypeAction } from 'lib/services/database/connectionServerActions';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import { useEnv } from 'app/EnvProvider';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';



export default function Page() {
    const [aasRepositories, setAasRepositories] = useState<string[]>([]);
    const navigate = useRouter();
    const theme = useTheme();
    const t = useTranslations('pages.catalog');
    const breadcrumbLinks = getCatalogBreadcrumbs(t);
    const [isConstructionDialogOpen, setIsConstructionDialogOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const env = useEnv();
    const notificationSpawner = useNotificationSpawner();

    useAsyncEffect(async () => {
        try {
            setIsLoading(true);
            const aasRepositories = await getConnectionDataByTypeAction(
                getTypeAction(ConnectionTypeEnum.AAS_REPOSITORY),
            );
            if (env.AAS_REPO_API_URL) {
                aasRepositories.push(env.AAS_REPO_API_URL);
            }
            setAasRepositories(aasRepositories);
        } catch (error) {
            notificationSpawner.spawn({
                message: error,
                severity: 'error',
            });
            return;
        } finally {
            setIsLoading(false);
        }
    }, []);


    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor={theme.palette.background.default}>
            <Box width="90%" margin="auto" marginTop="1rem">
                <Box marginBottom="1em">
                    <Breadcrumbs links={breadcrumbLinks} />
                </Box>
                <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                <Box display="flex" alignItems="center" marginTop="1.5rem" marginBottom="1.5rem">
                    <ContentPasteSearchIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h4" fontWeight={600} component="h2">
                        {t('manufacturerSelect')}
                    </Typography>
                </Box>
                {isLoading ? (
                    <CenteredLoadingSpinner sx={{ my: 10 }} />
                ) : <Box display="flex" flexWrap="wrap" gap={3}>
                    {/* Manufacturer Cards */}
                    {Object.entries(CatalogConfiguration).map(([manufacturer, config]) => (
                        <Card
                            key={manufacturer}
                            sx={{
                                width: 320,
                                minHeight: 160,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                p: 2,
                                boxShadow: 2,
                                borderRadius: 3,
                                position: 'relative',
                                background: theme.palette.background.paper,
                            }}
                        >
                            <Image
                                src={config.manufacturerLogo}
                                alt={`${manufacturer} Logo`}
                                width={120}
                                height={48}
                                style={{ objectFit: 'contain' }}
                            />
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Typography color="text.secondary" fontSize="1.1rem">
                                    {t('articleCount', { count: config.articleCount })}
                                </Typography>
                                <IconButton
                                    onClick={() => navigate.push(`/catalog/${encodeURIComponent(manufacturer)}`)}
                                    sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, '&:hover': { bgcolor: theme.palette.primary.main }, cursor: 'pointer' }}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                    {/* AAS Repository Cards */}
                    {aasRepositories.map((repoUrl) => (
                        <Card
                            key={repoUrl}
                            sx={{
                                width: 320,
                                minHeight: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                p: 2,
                                boxShadow: 2,
                                borderRadius: 3,
                                background: theme.palette.background.paper,
                            }}
                        >
                            <Typography variant="h6" fontWeight={600}>
                                {repoUrl}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
                                <IconButton
                                    sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, '&:hover': { bgcolor: theme.palette.primary.main }, cursor: 'pointer' }}
                                    onClick={() => navigate.push(`/catalog/repository?url=${encodeURIComponent(repoUrl)}`)}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Box>
                }
                <Box width="100%" mt={5} display="flex" justifyContent="flex-end" gap={4}>
                    <Button variant="contained" startIcon={<InsightsIcon />} onClick={() => setIsConstructionDialogOpen(true)}>
                        Chatbot
                    </Button>
                </Box>
            </Box>
            <ConstructionDialog
                open={isConstructionDialogOpen}
                onClose={() => setIsConstructionDialogOpen(false)}
            />
        </Box>
    );
}
