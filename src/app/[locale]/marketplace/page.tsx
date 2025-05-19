'use client';
import { Box, Button, Card, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Grid } from '@mui/system';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { ConstructionDialog } from 'components/basics/ConstructionDialog';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import InsightsIcon from '@mui/icons-material/Insights';
import { ArrowForward } from '@mui/icons-material';
import { SquaredSmallIconButton } from 'components/basics/Buttons';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import { useEnv } from 'app/EnvProvider';
import { getConnectionDataByTypeAction } from 'lib/services/database/connectionServerActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';

/**
 * Configuration we need to display the catalog.
 * Could be configurable through settings and saved in the database later.
 */
type CatalogConfiguration = {
    catalogLogo: string;
    sourceRepository: string;
    manufacturerName: string;
    rootCategories: {
        name: string;
        image: string;
    }[];
};

const hardcodedCatalogConfiguration: CatalogConfiguration[] = [{
    catalogLogo: '/images/catalog/manufacturers/kostal/Kostal_logo.png',
    manufacturerName: 'Kostal',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'Alle anzeigen',
            image: '/images/catalog/manufacturers/kostal/showAll.png',
        },
        {
            name: 'Kontakte',
            image: '/images/catalog/manufacturers/kostal/Dichtungen.png',
        },
        {
            name: 'Steckverbinder',
            image: '/images/catalog/manufacturers/kostal/Steckverbinder.png',
        },
        {
            name: 'Steckverbinder für Elektromobilität',
            image: '/images/catalog/manufacturers/kostal/Steckverbindung.png',
        },
        {
            name: 'Steckerleisten',
            image: '/images/catalog/manufacturers/kostal/Steckerleisten.png',
        },
        {
            name: 'Oil Performance Connectors',
            image: '/images/catalog/manufacturers/kostal/OilConnectors.png',
        },
        {
            name: 'Dichtungen',
            image: '/images/catalog/manufacturers/kostal/Dichtungen.png',
        },
    ],
}, {
    catalogLogo: '/images/catalog/manufacturers/komax/komax_logo.svg',
    manufacturerName: 'Komax',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: []
}, {
    catalogLogo: '/images/catalog/manufacturers/coroflex/coroflex_logo.png',
    manufacturerName: 'Coroflex',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: []
}];


export default function Page() {
    const [aasRepositories, setAasRepositories] = useState<string[]>([]);
    const [breadcrumbLinks] = useState<Array<{ label: string, path: string }>>([]);
    const [isConstructionDialogOpen, setIsConstructionDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const env = useEnv();
    const navigate = useRouter();
    const theme = useTheme();
    const t = useTranslations('pages.marketplace');
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
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            {isLoading ? (
                <CenteredLoadingSpinner sx={{ my: 10 }} />
            ) : <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <Box marginBottom="2em">
                        <Breadcrumbs links={breadcrumbLinks} />
                    </Box>
                    <Box marginBottom="2em">
                        <Typography variant="h1">{t('title')}</Typography>
                        <Typography variant="h3">{t('subtitle')}</Typography>
                    </Box>

                    <Box display="flex" flexDirection={"column"} gap={4}>
                        <Box mt={3} display={"flex"} alignItems="center" gap={2} width="100%">
                            <ContentPasteSearchIcon sx={{ fontSize: 40 }} />
                            <Typography variant="h3">{t('manufacturerSelect')}</Typography>
                        </Box>
                        <Box display="flex" gap={2} mt={1} width={"100%"} flexWrap={"wrap"}>
                            {hardcodedCatalogConfiguration.map((config, index) => (
                                <Grid size={3} key={index}>
                                    <Card
                                        onClick={() => {
                                            // TODO navigate with manufacturer as query param
                                            navigate.push(`productList/?manufacturer={${config.manufacturerName}`)
                                        }}
                                        sx={{
                                            padding: '1em', width: '270px', height: '170px',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: theme.palette.action.hover },
                                        }}>
                                        <Box display="flex" flexDirection="column" width={'65%'} height={'70%'}>
                                            <Box position="relative"
                                                display="flex"
                                                flexDirection="column"
                                                height={'100%'}
                                                width={'100%'}
                                                justifyContent={'flex-start'}
                                                alignItems={'flex-start'}>
                                                <Image
                                                    src={config.catalogLogo}
                                                    alt={`${config.manufacturerName} logo`}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box height="100%" display="flex" flexDirection="column" alignItems="flex-end">
                                            <SquaredSmallIconButton variant='outlined' onClick={() => { }}>
                                                <ArrowForward />
                                            </SquaredSmallIconButton>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                            {aasRepositories.map((repo, index) => (
                                <Grid size={3} key={index}>
                                    <Card
                                        onClick={() => {
                                            // TODO navigate with repository as query param
                                            navigate.push(`productList/?dataSource={${repo}`)
                                        }}
                                        sx={{
                                            padding: '1em', width: '270px', height: '170px',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: theme.palette.action.hover },
                                        }}>
                                        <Box display="flex" flexDirection="column" width={'65%'} height={'70%'}>
                                            <Box position="relative"
                                                display="flex"
                                                flexDirection="column"
                                                height={'100%'}
                                                width={'100%'}
                                                justifyContent={'center'}>
                                                {repo}
                                            </Box>
                                        </Box>
                                        <Box height="100%" display="flex" flexDirection="column" alignItems="flex-end">
                                            <SquaredSmallIconButton variant='outlined' onClick={() => { }}>
                                                <ArrowForward />
                                            </SquaredSmallIconButton>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                            <Grid size={4} display={"flex"} alignItems="center">
                            </Grid>
                        </Box>
                    </Box>
                    <Box width="100%" mt={5} display="flex" justifyContent="flex-end" gap={4}>
                        <Button variant="contained" startIcon={<InsightsIcon />} onClick={() => setIsConstructionDialogOpen(true)}>
                            Chatbot
                        </Button>
                    </Box>
                </Box>
            </Box>}

            <ConstructionDialog
                open={isConstructionDialogOpen}
                onClose={() => setIsConstructionDialogOpen(false)}
            />
        </Box>
    );
}
