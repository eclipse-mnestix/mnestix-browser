import { Box } from '@mui/material';
import { RegistryListView } from './_components/RegistryListView';

export default async function page() {
    return (
        <Box display="flex" flexDirection="column" marginTop="20px" marginBottom="50px" width="100%">
            <Box width="90%" margin="auto">
                <RegistryListView />
            </Box>
        </Box>
    );
}
