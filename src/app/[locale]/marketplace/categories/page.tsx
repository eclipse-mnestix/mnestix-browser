'use client';
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { BreadcrumbLink, Breadcrumbs } from 'components/basics/Breadcrumbs';

/**
 WIP -> needs to be combined with other catalog page configuration
 */
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
}];

export default function Page() {
    const [selectedCatalog, setSelectedCatalog] = useState<CatalogConfiguration | undefined>(undefined);
    const navigate = useRouter();
    const theme = useTheme();
    const t = useTranslations('pages.catalog');
    const [breadcrumbLinks] = useState<BreadcrumbLink[]>([]);
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
                    </Box>
                    <Box display="flex" alignItems="center" gap={4}>
                        <FormControl sx={{ minWidth: 300, maxWidth: 300 }}>
                            <InputLabel id="aas-repository-select">
                                {t('manufacturerSelect')}
                            </InputLabel>
                            <Select
                                data-testid="repository-select"
                                labelId="aas-repository-select"
                                value={selectedCatalog?.manufacturerName ?? ''}
                                label={t('manufacturerSelect')}
                                onChange={(event) => loadCategories(event.target.value)}
                                variant="outlined"
                            >
                                {hardcodedCatalogConfiguration.map((config, index) => (
                                    <MenuItem
                                        key={index}
                                        value={config.manufacturerName}
                                        data-testid={`repository-select-item-${index}`}
                                    >
                                        {config.manufacturerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedCatalog && (
                            <Card sx={{ padding: '1em' }}>
                                <Box position="relative" width="200px" height="60px">
                                    {selectedCatalog.catalogLogo && (
                                        <Image
                                            src={selectedCatalog.catalogLogo}
                                            alt={`${selectedCatalog.manufacturerName} logo`}
                                            fill
                                            style={{
                                                objectFit: 'contain',
                                            }}
                                        />
                                    )}
                                </Box>
                            </Card>
                        )}
                    </Box>
                </Box>
                {selectedCatalog ? <Box>
                    <Typography variant="h3">{t('manufacturerCatalog')}</Typography>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                        {selectedCatalog?.rootCategories.map((category) => (
                            <Card
                                key={category.name}
                                onClick={() => {
                                    navigate.push(`catalog/${category.name}`);
                                }}
                                sx={{
                                    margin: '1em',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: theme.palette.action.hover },
                                }}
                            >
                                <CardContent>
                                    <Box
                                        width="200px"
                                        height="200px"
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        {category.name}
                                        {category.image && (
                                            <Box
                                                position="relative"
                                                width="100%"
                                                height="100%"
                                            >
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    style={{
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box> : <Typography>Please select a manufacturer</Typography>}
            </Box>
        </Box>
    );
}