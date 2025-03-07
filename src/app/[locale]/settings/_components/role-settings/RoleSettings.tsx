import {
    Box,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { CardHeading } from 'components/basics/CardHeading';
import { useTranslations } from 'next-intl';

export type RbacDto = {
    name: string;
    action: rbacAction[];
    type: string;
    aasIds: string[];
    submodelIds: string[];
};

enum rbacAction {
    CREATE,
    READ,
    UPDATE,
    DELETE,
    EXECUTE,
}

export const RoleSettings = () => {
    const t = useTranslations('settings');

    const tableHeaders = [
        { label: t('roles.tableHeader.name') },
        { label: t('roles.tableHeader.action') },
        { label: t('roles.tableHeader.type') },
        { label: t('roles.tableHeader.aasIds') },
        { label: t('roles.tableHeader.submodelIds') },
    ];

    const dummyData: RbacDto[] = [
        {
            name: 'basyx-reader-serialization-two',
            action: [rbacAction.DELETE, rbacAction.CREATE],
            type: 'aas-environment',
            aasIds: [
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
                'https://aas2.uni-h.de/lni0729',
            ],
            submodelIds: ['submodel1', 'submodel2', 'submodel3', 'submodel4', 'submodel5', 'submodel6'],
        },
        {
            name: 'basyx-reader',
            action: [rbacAction.DELETE, rbacAction.CREATE, rbacAction.EXECUTE],
            type: 'aas-repository',
            aasIds: ['https://aas2.uni-h.de/lni0729', 'https://aas2.uni-h.de/lni0729'],
            submodelIds: ['submodel1', 'submodel2', 'submodel3', 'submodel6'],
        },
        {
            name: 'admin',
            action: [rbacAction.DELETE, rbacAction.CREATE, rbacAction.EXECUTE, rbacAction.UPDATE, rbacAction.UPDATE],
            type: 'aas-repository',
            aasIds: ['*'],
            submodelIds: ['*'],
        },
    ];
    // TODO add subheader
    // "more" dialog for aas Ids and submodel Ids, 3 rows max
    // action pills
    // role bold

    return (
        <Box sx={{ p: 3, width: '100%', minHeight: '600px' }}>
            <CardHeading title={t('roles.title')} subtitle={t('roles.subtitle')}></CardHeading>
            <Divider sx={{ my: 2 }} />

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
                        {dummyData.map((entry) => (
                            <TableRow key={entry.name}>
                                <TableCell>{entry.name}</TableCell>
                                <TableCell>{entry.action.map((action) => rbacAction[action]).join(', ')}</TableCell>
                                <TableCell>{entry.type}</TableCell>
                                <TableCell>{entry.aasIds.join(', ')}</TableCell>
                                <TableCell>{entry.submodelIds.join(', ')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
// TODO: Batches for Action? Length of AASIDS and SubmodelIDS, how can I view a huge List?
// Test all List implementation and align styling