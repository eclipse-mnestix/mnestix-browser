'use client';

import { Box, Card, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ListHeader from 'components/basics/ListHeader';
import AasListDataWrapper from 'app/[locale]/list/_components/AasListDataWrapper';
import { useTranslations } from 'next-intl';
import { CatalogConfiguration } from 'app/[locale]/marketplace/catalogConfiguration';
import Image from 'next/image';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { getCatalogBreadcrumbs } from 'app/catalog/breadcrumbs';

export default function Page() {
    const params = useSearchParams();
    const t = useTranslations('pages.catalog');
    const manufacturer = params.get('manufacturer');

    if (!manufacturer) {
        return <>No Manufacturer found</>;
    }

    const config = CatalogConfiguration[manufacturer];
    const breadcrumbLinks = getCatalogBreadcrumbs(t, manufacturer);

    return (
        <Box width="90%" margin="auto" marginTop="1rem">
            <Box marginBottom="1em">
                <Breadcrumbs links={breadcrumbLinks} />
            </Box>
            <Box display="flex" justifyContent="space-between">
                <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                {config?.manufacturerLogo && (
                    <Box ml={2} display="flex" alignItems="center">
                        <Image
                            src={config?.manufacturerLogo}
                            alt={`${manufacturer} Logo`}
                            height={48}
                            width={120}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                )}
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" marginBottom="1.5rem">
                <Card
                    sx={{
                        minHeight: 480,
                        minWidth: 250,
                        maxWidth: 340,
                        marginBottom: 'auto',
                        p: 2,
                        boxShadow: 1,
                        borderRadius: 1,
                        mr: 3,
                    }}
                    aria-label={t('filter')}
                >
                    <Typography variant="h6" fontWeight={600}>
                        {t('filter')}
                    </Typography>
                    <Typography color="text.secondary" marginTop={'1rem'}>
                        'Test tefrnejgnrejgergnerj'
                    </Typography>
                </Card>
                <Box flex={1} minWidth={0}>
                    <AasListDataWrapper repositoryUrl={config?.repositoryUrl} hideRepoSelection={true} />
                </Box>
            </Box>
        </Box>
    );
}
