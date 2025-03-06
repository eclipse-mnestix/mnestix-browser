import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export const RoleSettings = () => {
    const t = useTranslations('settings');

    const tableHeaders = [
        { label: t('roles.tableHeader.name') },
        { label: t('roles.tableHeader.action') },
        { label: t('roles.tableHeader.type') },
        { label: t('roles.tableHeader.aasIds') },
        { label: t('roles.tableHeader.submodelIds') },
        '',
    ];

    return (
        <Box sx={{ p: 3, width: '100%', minHeight: '600px' }}>
            <Typography variant="h3" color="primary">
                {t('roles.title')}
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        {!!tableHeaders &&
                            tableHeaders.map((header: { label: string }, index) => (
                                <TableCell key={index}>
                                    <Typography variant="h5" color="secondary" letterSpacing={0.16} fontWeight={700}>
                                        {header.label}
                                    </Typography>
                                </TableCell>
                            ))}
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>basyx-reader-serialization-two</TableCell>
                            <TableCell>READ</TableCell>
                            <TableCell>aas-environment</TableCell>
                            <TableCell>
                                https://aas2.uni-h.de/lni0729, https://aas2.uni-h.de/lni0729,
                                https://aas2.uni-h.de/lni0729, ...
                            </TableCell>
                            <TableCell>submodel1, submodel2, submodel3, submodel4, submodel5, submodel6, ...</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>basyx-reader-serialization</TableCell>
                            <TableCell>CREATE, UPDATE</TableCell>
                            <TableCell>aas-repo</TableCell>
                            <TableCell>https://aas2.uni-h.de/lni0729, https://aas2.uni-h.de/lni0729, ...</TableCell>
                            <TableCell>submodel1, submodel2, submodel6</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
