import { Box, Table, TableContainer, TableHead, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export const RoleSettings = () => {
    const t = useTranslations('settings');

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Typography variant="h3" color="primary">
                {t('roles.title')}
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>Role Name</TableHead>
                </Table>
            </TableContainer>
        </Box>
    );
};
