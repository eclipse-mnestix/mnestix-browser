'use client';

import { Box } from '@mui/material';
import { AasListViewDeprecated } from 'app/[locale]/list/_components-deprecated/AasListViewDeprecated';
import ListHeader from 'components/basics/ListHeader';
import { useEnv } from 'app/env/provider';
import AasListDataWrapper from './_components/AasListDataWrapper';
import { useTranslations } from 'next-intl';

export default function Page() {
    const env = useEnv();
    const t = useTranslations('aas-list');

    /**
     * Once the new list implementation is done:
     * we can delete the "_component-deprecated" folder
     * we can remove the "AAS_LIST_V2_FEATURE_FLAG" feature flag and the corresponding render condition.
     */
    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <ListHeader header={t('header')} subHeader={t('subHeader')} />
                </Box>
                {env.AAS_LIST_V2_FEATURE_FLAG ? <AasListDataWrapper /> : <AasListViewDeprecated />}
            </Box>
        </Box>
    );
}
