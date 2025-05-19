'use client'
import { Box, Card, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import ListHeader from 'components/basics/ListHeader';
import AasListDataWrapper from '../../list/_components/AasListDataWrapper';
import { useTranslations } from 'next-intl';

// Mapping manufacturer name to logo path
const manufacturerLogos: Record<string, string> = {
  kostal: '/images/kostal.png',
  coroflex: '/images/coroflex.png',
  komax: '/images/komax.png',
};


export default function Page() {
    const params = useParams<{ category: string }>();
    const t = useTranslations('pages.catalog');
    const manufacturer = params?.category?.toLowerCase();
    const logoSrc = manufacturer && manufacturerLogos[manufacturer] ? manufacturerLogos[manufacturer] : undefined;

    return (
            <Box width="90%" margin="auto" marginTop="2rem" >
                <Box display="flex" justifyContent="space-between">
                    <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                    {logoSrc && (
                        <Box ml={2} display="flex" alignItems="center">
                            <img
                                src={logoSrc}
                                alt={`${manufacturer} Logo`}
                                style={{ height: 48, width: 'auto', objectFit: 'contain'}}
                            />
                        </Box>
                    )}
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" marginBottom="1.5rem">
                    <Card
                        sx={{
                            width: 280,
                            minWidth: 220,
                            minHeight: 480,
                            maxWidth: 340,
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
                    </Card>
                    <Box flex={1} minWidth={0}>
                        <AasListDataWrapper />
                    </Box>
                </Box>
            </Box>
    );
}
