'use client';
import { Box, Button, Card, Typography, useTheme, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ListHeader from 'components/basics/ListHeader';
import Image from 'next/image';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { getCatalogBreadcrumbs } from 'app/[locale]/marketplace/_components/breadcrumbs';
import React from 'react';
import InsightsIcon from '@mui/icons-material/Insights';
import { ConstructionDialog } from 'components/basics/ConstructionDialog';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';
import {
    getRepositoryConfigurationGroupsAction,
} from 'lib/services/database/connectionServerActions';
import { useEnv } from 'app/EnvProvider';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { MnestixConnection } from '@prisma/client';
import { ManufacturerCard } from 'app/[locale]/marketplace/_components/manufacturerCard';



export default function Page() {
    const [aasRepositories, setAasRepositories] = useState<MnestixConnection[]>([]);
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
            const aasRepositories = await getRepositoryConfigurationGroupsAction();
            if (env.AAS_REPO_API_URL) {
                aasRepositories.push({
                    url: env.AAS_REPO_API_URL,
                    name: null,
                    id: '',
                    typeId: '',
                    aasSearcher: null,
                    image: null,
                });
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
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                    <Button
                        variant="contained"
                        startIcon={<InsightsIcon />}
                        onClick={() => setIsConstructionDialogOpen(true)}
                        sx={{ whiteSpace: 'nowrap', ml: 2 }}
                        aria-label="Chatbot"
                    >
                        Chatbot
                    </Button>
                </Box>
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
                    {aasRepositories.map((connection) => (
                        <ManufacturerCard connection={connection} />
                    ))}
                </Box>
                }
            </Box>
            <ConstructionDialog
                open={isConstructionDialogOpen}
                onClose={() => setIsConstructionDialogOpen(false)}
            />
        </Box>
    );
}
