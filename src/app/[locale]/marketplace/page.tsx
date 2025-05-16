'use client';
import { Box, Button, Card, CardContent, Checkbox, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Grid, padding } from '@mui/system';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { ConstructionDialog } from 'components/basics/ConstructionDialog';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import InsightsIcon from '@mui/icons-material/Insights';
import { ArrowForward } from '@mui/icons-material';

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
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'TEST_CATEGORY_1',
            image: '/images/aas-core-logo.png',
        },
        { 
            name: 'TEST_CATEGORY_2',
            image: '/images/aas-core-logo.png' 
        },
    ],
}, {
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'TEST_CATEGORY_1',
            image: '/images/aas-core-logo.png',
        },
        { 
            name: 'TEST_CATEGORY_2',
            image: '/images/aas-core-logo.png' 
        },
    ],
}, {
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'TEST_CATEGORY_1',
            image: '/images/aas-core-logo.png',
        },
        { 
            name: 'TEST_CATEGORY_2',
            image: '/images/aas-core-logo.png' 
        },
    ],
}, {
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'TEST_CATEGORY_1',
            image: '/images/aas-core-logo.png',
        },
        { 
            name: 'TEST_CATEGORY_2',
            image: '/images/aas-core-logo.png' 
        },
    ],
}, {
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'TEST_CATEGORY_1',
            image: '/images/aas-core-logo.png',
        },
        { 
            name: 'TEST_CATEGORY_2',
            image: '/images/aas-core-logo.png' 
        },
    ],
}, {
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'TEST_CATEGORY_1',
            image: '/images/aas-core-logo.png',
        },
        { 
            name: 'TEST_CATEGORY_2',
            image: '/images/aas-core-logo.png' 
        },
    ],
}];

export default function Page() {
    const [selectedCatalog, setSelectedCatalog] = useState<CatalogConfiguration | undefined>(undefined);
    const navigate = useRouter();
    const theme = useTheme();
    const t = useTranslations('pages.marketplace');
    const [breadcrumbLinks] = useState<Array<{ label: string, path: string }>>([]);
    const [isConstructionDialogOpen, setIsConstructionDialogOpen] = useState<boolean>(false);
    
    const loadCategories = (manufacturerName: string) => {
        const selected = hardcodedCatalogConfiguration.find(
            (config) => config.manufacturerName === manufacturerName
        );
        setSelectedCatalog(selected);
    };

    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <Box marginBottom="2em">
                      <Breadcrumbs links={breadcrumbLinks} />
                    </Box>
                    <Box marginBottom="2em">
                        <Typography variant="h1">{t('title')}</Typography>
                        <Typography variant="h3">{t('subtitle')}</Typography>
                    </Box>
                    
                    <Box display="flex" flexDirection={"column"} gap={4}>                        <Box mt={3} display={"flex"} alignItems="center" gap={2} width="100%">
                            <ContentPasteSearchIcon sx={{ fontSize: 40 }}/>
                            <Typography variant="h3" >Select a manufacturer</Typography>
                        </Box>
                        <Box display="flex" gap={2} mt={1} width={"100%"} flexWrap={"wrap"}>
                            {hardcodedCatalogConfiguration.map((config, index) => (
                                <Grid size={3}>
                                    <Card sx={{ padding: '2em' }}>
                                        <Box position="relative" width="230px" height="150px">
                                            <Image
                                                src={config.catalogLogo}
                                                alt={`${config.manufacturerName} logo`}
                                                fill
                                                style={{ objectFit: 'contain'}}
                                            />
                                        </Box>
                                          <Button variant='contained'
                                                            endIcon={<ArrowForward />}
                                                            onClick={() => {}}
                                                            data-testid="list-to-detailview-button"
                                                        />
                                    </Card>
                                </Grid>
                            ))}
                                <Grid size={4} display={"flex"} alignItems="center">
                                </Grid>
                            </Box>
                        {selectedCatalog && (
                            <Card sx={{ padding: '1em' }}>
                            <Box position="relative" width="250px" height="50px">
                                <Image
                                    src={selectedCatalog.catalogLogo}
                                    alt={`${selectedCatalog.manufacturerName} logo`}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                            </Card>
                        )}
                    </Box>
                    <Box width="100%" mt={3} display="flex" justifyContent="flex-end" gap={4}>
                        <Button variant="contained" startIcon={<InsightsIcon />} onClick={() => setIsConstructionDialogOpen(true)}>
                            Chatbot
                        </Button>
                    </Box>
                </Box>
            </Box>
            
            <ConstructionDialog 
                open={isConstructionDialogOpen} 
                onClose={() => setIsConstructionDialogOpen(false)} 
            />
        </Box>
    );
}
