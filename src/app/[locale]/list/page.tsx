'use client';

import { Box } from '@mui/material';
import ListHeader from 'components/basics/ListHeader';
import AasListDataWrapper from './_components/AasListDataWrapper';

export default function Page() {
    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <ListHeader namespace={'aas-list'} header={'header'} subHeader={'subHeader'} />
                </Box>
                <AasListDataWrapper />
            </Box>
        </Box>
    );
}
