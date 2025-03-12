import {
    Box,
    Chip,
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RoundedIconButton } from 'components/basics/Buttons';

export type RbacDto = {
    name: string;
    action: rbacAction[];
    targetInformation: {
        type: string;
        aasIds: string[];
        submodelIds: string[];
    };
};

export enum rbacAction {
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
    const MAX_PERMISSIONS_CHARS = 40;

    const tableHeaders = [
        { label: t('roles.tableHeader.name') },
        { label: t('roles.tableHeader.action') },
        { label: t('roles.tableHeader.type') },
        { label: 'Permissions' },
        { label: '' },
    ];

    const dummyData: RbacDto[] = [
        {
            name: 'basyx-reader-serialization-two',
            action: [rbacAction.DELETE, rbacAction.CREATE],
            targetInformation: {
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
        },
        {
            name: 'basyx-reader',
            action: [rbacAction.DELETE, rbacAction.CREATE, rbacAction.EXECUTE],
            targetInformation: {
                type: 'aas-repository',
                aasIds: ['https://aas2.uni-h.de/lhö', 'https://aas2.uni-h.de/hi'],
                submodelIds: ['submodel1', 'submodel2', 'submodel3', 'submodel6'],
            },
        },
        {
            name: 'admin',
            action: [rbacAction.DELETE, rbacAction.CREATE, rbacAction.EXECUTE, rbacAction.UPDATE, rbacAction.UPDATE],
            targetInformation: {
                type: 'aas-repository',
                aasIds: ['*'],
                submodelIds: ['*'],
            },
        },
    ];
    // Test all List implementation and align styling
    // mobile: hide permissions

    const permissionCell = (entry: RbacDto) => {
        const permissions = [];
        for (const elem in entry.targetInformation) {
            if (elem !== 'type') {
                const content = entry.targetInformation[elem].join(', ');
                permissions.push(
                    <Box component="span" key={elem}>
                        <Box component="span" fontWeight="bold">
                            {`${elem}: `}
                        </Box>
                        {content.length > MAX_PERMISSIONS_CHARS
                            ? `${content.slice(0, MAX_PERMISSIONS_CHARS)}...`
                            : content}
                        <br />
                    </Box>,
                );
            }
        }
        return permissions;
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
                                    <TableCell>
                                        {entry.action.map((action) => (
                                            <Chip
                                                sx={{ fontWeight: 'normal', m: 0.5 }}
                                                key={action}
                                                label={rbacAction[action]}
                                            />
                                        ))}
                                    </TableCell>
                                    <TableCell>{entry.targetInformation.type}</TableCell>
                                    <TableCell>{permissionCell(entry)}</TableCell>
                                    <TableCell>
                                        <RoundedIconButton onClick={() => openDetailDialog(entry)} color="primary">
                                            <ArrowForwardIcon />
                                        </RoundedIconButton>
                                    </TableCell>
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
