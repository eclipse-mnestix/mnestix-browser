'use client'
import { Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams<{ category: string }>();

    return (
        <Box display="flex" flexDirection="column" marginTop="0px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <Box marginTop="2rem" marginBottom="2.25rem">
                    <Typography variant="h1" >Catalog Category: { params.category }</Typography>
                </Box>
                <Box>
                    <Typography variant="h3">List of all AAS with Category... </Typography>
                </Box>
            </Box>
        </Box>
    );
}
