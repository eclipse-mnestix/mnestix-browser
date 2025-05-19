'use client';
import { Box, Card, Typography, useTheme, IconButton, SvgIcon } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ListHeader from 'components/basics/ListHeader';

/**
 * Configuration we need to display the catalog.
 * Could be configurable through settings and saved in the database later.
 */
type CatalogConfiguration = {
    catalogLogo: string;
    manufacturerName: string;
    articleCount: number;
    sourceRepository: string;
};

const hardcodedCatalogConfiguration: CatalogConfiguration[] = [
    {
        catalogLogo: '/images/kostal.png',
        manufacturerName: 'kostal',
        articleCount: 2345,
        sourceRepository: 'http://92.205.177.115:8080',
    },
    {
        catalogLogo: '/images/coroflex.png',
        manufacturerName: 'coroflex',
        articleCount: 295,
        sourceRepository: 'https://api.mnestix.xitaso.net/repo',
    },
    {
        catalogLogo: '/images/komax.png',
        manufacturerName: 'komax',
        articleCount: 645,
        sourceRepository: 'https://c1.api.wago.com/smartdata-aas-env',
    },
];


export default function Page() {
    const navigate = useRouter();
    const theme = useTheme();
    const t = useTranslations('pages.catalog');

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor={theme.palette.background.default}>
            <Box width="90%" margin="auto" marginTop="2rem">
                <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                <Box display="flex" alignItems="center" marginTop="2.5rem" marginBottom="1.5rem">
                    <ContentPasteSearchIcon fontSize="large" color="primary" sx={{mr: 1}} />
                    <Typography variant="h4" fontWeight={600} component="h2">
                        {t('manufacturerSelect', {namespace: 'pages.catalog'})}
                    </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={3}>
                    {hardcodedCatalogConfiguration.map((repo) => (
                        <Card
                            key={repo.manufacturerName}
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
                            <Box display="flex" alignItems="center" gap={2}>
                                <img
                                    src={repo.catalogLogo}
                                    alt={`${repo.manufacturerName} Logo`}
                                    style={{ height: 48, width: 'auto', objectFit: 'contain' }}
                                />
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Typography color="text.secondary" fontSize="1.1rem">
                                    {t('articleCount', {count: repo.articleCount})}
                                </Typography>
                                <IconButton
                                    onClick={() => navigate.push(`/catalog/${encodeURIComponent(repo.manufacturerName)}`)}
                                    sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, '&:hover': { bgcolor: theme.palette.primary.main } }}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Box>          
            </Box>
        </Box>
    );
}
