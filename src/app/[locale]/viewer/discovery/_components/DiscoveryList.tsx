import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { IDiscoveryListEntry } from 'lib/types/DiscoveryListEntry';
import { DiscoveryListTableRow } from 'app/[locale]/viewer/discovery/_components/DiscoveryListTableRow';

type AasListProps = {
    data?: IDiscoveryListEntry[];
    tableHeaders: { label: string }[];
};

export default function DiscoveryList(props: AasListProps) {
    const { data, tableHeaders } = props;

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {!!tableHeaders &&
                            tableHeaders.map((header: { label: string }, index) => (
                                <TableCell key={index}>
                                    <Typography variant="h5" color="secondary" letterSpacing={0.16} fontWeight={700}>
                                        {header.label}
                                    </Typography>
                                </TableCell>
                            ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((aasListEntry, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                            }}
                            data-testid={`list-row-${aasListEntry.aasId}`}
                        >
                            <DiscoveryListTableRow aasListEntry={aasListEntry} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
