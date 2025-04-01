import { Box } from '@mui/material';
import { DiscoveryListView } from './_components/DiscoveryListView';

export default async function page() {
    return (
        <Box display="flex" flexDirection="column" marginTop="20px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <DiscoveryListView />
            </Box>
        </Box>
    );
}
