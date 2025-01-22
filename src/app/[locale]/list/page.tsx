'use client';

import { Box } from '@mui/material';
import ListHeader from 'components/basics/ListHeader';
import AasListDataWrapper from './_components/AasListDataWrapper';
import { useTranslations } from 'next-intl';

export default function Page() {
    const t = useTranslations('aas-list');
    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <ListHeader header={t('header')} subHeader={t('subHeader')} />
                </Box>
                <AasListDataWrapper />
            </Box>
        </Box>
    );
}
