import {
    Box,
    Button,
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
import { RoleDialog } from 'app/[locale]/settings/_components/role-settings/RoleDialog';
import { useState } from 'react';

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
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RbacDto | undefined>(undefined);
    const MAX_IDS = 3;
    const MAX_IDS_CHARS = 50;

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
                'https://aas2.uni-h.de/lnidsafdsafdfasdfsdfadfdsfdsfadsfdsfdsfsdafdsfdassdfsdfs0721',
                'https://aas2.uni-h.de/lni0722',
                'https://aas2.uni-h.de/lni0dsafdsafdas723',
                'https://aas2.uni-h.de/lni0ddsafdf724',
                'https://aas2.uni-h.de/lni0725',
                'https://aas2.uni-h.de/lni0726',
                'https://aas2.uni-h.de/lni0727',
                'https://aas2.uni-h.de/lni0728',
                'https://aas2.uni-h.de/lni07210',
                'https://aas2.uni-h.de/lni072911',
                'https://aas2.uni-h.de/lni07212',
                'https://aas2.uni-h.de/lni07214',
            ],
            submodelIds: ['submodel1', 'submodel2', 'submodel3', 'submodel4', 'submodel5', 'submodel6'],
        },
        {
            name: 'basyx-reader',
            action: [rbacAction.DELETE, rbacAction.CREATE, rbacAction.EXECUTE],
            type: 'aas-repository',
            aasIds: ['https://aas2.uni-h.de/lhö', 'https://aas2.uni-h.de/hi'],
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
    // "more" dialog for aas Ids and submodel Ids, 3 rows max
    // 1 id per row -> ... per id
    // action pills
    // Test all List implementation and align styling
    // mobile: hide aas Ids + submodel Ids

    const idTableCell = (ids: string[], entry: RbacDto) => {
        const showMore = ids.length > MAX_IDS;

        const elementsToShow = ids.slice(0, MAX_IDS);
        return (
            <span>
                {elementsToShow.map((id) => (
                    <Box component="span" key={id} sx={{ whiteSpace: 'nowrap' }}>
                        {id.length > MAX_IDS_CHARS ? `${id.slice(0, MAX_IDS_CHARS)}...` : id} <br />
                    </Box>
                ))}
                {showMore && (
                    <Button size="small" onClick={() => openDetailDialog(entry)}>
                        show more
                    </Button>
                )}
            </span>
        );
    };

    const openDetailDialog = (entry: RbacDto) => {
        setSelectedRole(entry);
        setRoleDialogOpen(true);
    };

    return (
        <>
            <Box sx={{ p: 3, width: '100%', minHeight: '600px' }}>
                <CardHeading title={t('roles.title')} subtitle={t('roles.subtitle')}></CardHeading>
                <Divider sx={{ my: 2 }} />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {!!tableHeaders &&
                                    tableHeaders.map((header: { label: string }, index) => (
                                        <TableCell key={index}>
                                            <Typography
                                                variant="h5"
                                                color="secondary"
                                                letterSpacing={0.16}
                                                fontWeight={700}
                                            >
                                                {header.label}
                                            </Typography>
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dummyData.map((entry) => (
                                <TableRow key={entry.name}>
                                    <TableCell>
                                        <Typography fontWeight="bold">{entry.name}</Typography>
                                    </TableCell>
                                    <TableCell>{entry.action.map((action) => rbacAction[action]).join(', ')}</TableCell>
                                    <TableCell>{entry.type}</TableCell>
                                    <TableCell>{idTableCell(entry.aasIds, entry)}</TableCell>
                                    <TableCell>{idTableCell(entry.submodelIds, entry)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <RoleDialog
                onClose={() => {
                    setRoleDialogOpen(false);
                }}
                open={roleDialogOpen}
                role={selectedRole}
            ></RoleDialog>
        </>
    );
};
