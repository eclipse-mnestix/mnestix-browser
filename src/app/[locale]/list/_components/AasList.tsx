import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { AasListTableRow } from 'app/[locale]/list/_components/AasListTableRow';
import { AasListDto } from 'lib/services/list-service/ListService';
import { useTranslations } from 'next-intl';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

type AasListProps = {
    repositoryUrl: RepositoryWithInfrastructure;
    connectionType?: 'repository' | 'registry';
    shells: AasListDto | undefined;
};

export default function AasList(props: AasListProps) {
    const { repositoryUrl, connectionType, shells } = props;
    const t = useTranslations('pages.aasList');

    const tableHeaders = [
        { label: t('listHeader.picture') },
        { label: t('listHeader.manufacturer') },
        { label: t('listHeader.productDesignation') },
        { label: t('listHeader.assetId') },
        { label: t('listHeader.aasId') },
        '',
    ];

    return (
        <>
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
                                            sx={{
                                                letterSpacing: 0.16,
                                                fontWeight: 700
                                            }}>
                                            {header.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shells &&
                            shells.entities?.map((aasListEntry) => (
                                <TableRow key={aasListEntry.aasId} data-testid={`list-row-${aasListEntry.aasId}`}>
                                    <AasListTableRow
                                        repository={repositoryUrl}
                                        connectionType={connectionType}
                                        aasListEntry={aasListEntry}
                                    />
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
