'use client';
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Kostal',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'CONNECT_TERMINALS',
            image: '/images/aas-core-logo.png',
        },
        { name: 'CONNECT_HOUSINGS', image: '/images/aas-core-logo.png' },
    ],
}, {
    catalogLogo: '/images/aas-core-logo.png',
    manufacturerName: 'Test',
    sourceRepository: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    rootCategories: [
        {
            name: 'CONNECT_TERMINALS',
            image: '/images/aas-core-logo.png',
        },
        { name: 'CONNECT_HOUSINGS', image: '/images/aas-core-logo.png' },
    ],
}];

export default function Page() {
    const [selectedCatalog, setSelectedCatalog] = useState<CatalogConfiguration | undefined>(undefined);
    const navigate = useRouter();
    const theme = useTheme();
    const t = useTranslations('pages.catalog');

    const loadCategories = () => {
        setSelectedCatalog(hardcodedCatalogConfiguration[0]);
    };

    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <Box marginBottom="2em">
                        <Typography variant="h1">{t('title')}</Typography>
                    </Box>
                    <FormControl variant="standard" sx={{ minWidth: 300, maxWidth: 300 }}>
                        <InputLabel id="aas-repository-select" sx={{ color: 'text.secondary' }}>
                            {t('manufacturerSelect')}
                        </InputLabel>
                        <Select
                            data-testid="repository-select"
                            labelId="aas-repository-select"
                            value={selectedCatalog?.manufacturerName || ''}
                            label={'test'}
                            onChange={loadCategories}
                            variant="outlined"
                        >
                            {hardcodedCatalogConfiguration.map((repo, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={repo.manufacturerName}
                                        data-testid={`repository-select-item-${index}`}
                                    >
                                        {repo.manufacturerName}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
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
