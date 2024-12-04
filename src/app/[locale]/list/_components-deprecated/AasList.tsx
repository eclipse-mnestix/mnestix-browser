import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { AasListEntry } from 'lib/api/generated-api/clients.g';
import { AasListTableRow } from 'app/[locale]/list/_components-deprecated/AasListTableRow';

type AasListProps = {
    shells: AasListEntry[];
    tableHeaders: { label: string }[];
    comparisonFeatureFlag?: boolean;
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
};

export default function AasList(props: AasListProps) {
    const { shells, tableHeaders, selectedAasList, updateSelectedAasList, comparisonFeatureFlag } = props;
    const theme = useTheme();
    const MAX_SELECTED_ITEMS = 3;

    /**
     * Decides if the current checkbox should be disabled or not.
     */
    const checkBoxDisabled = (aasId: string | undefined) => {
        if (!aasId) return false;
        return selectedAasList && selectedAasList.length >= MAX_SELECTED_ITEMS && !selectedAasList.includes(aasId);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            color: 'primary',
                            lineHeight: '150%',
                            letterSpacing: '0.16px',
                            fontSize: '16px',
                        }}
                    >
                        {comparisonFeatureFlag && (
                            <TableCell align="center" width="50px">
                                <Tooltip
                                    title={<FormattedMessage {...messages.mnestix.aasList.compareTooltip} />}
                                    arrow
                                >
                                    <CompareArrowsIcon
                                        sx={{ width: '35px', height: '35px', verticalAlign: 'middle' }}
                                    />
                                </Tooltip>
                            </TableCell>
                        )}
                        {!!tableHeaders &&
                            tableHeaders.map((header: { label: string }, index) => (
                                <TableCell key={index}>
                                    <Typography fontWeight="bold">{header.label}</Typography>
                                </TableCell>
                            ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shells?.map((aasListEntry) => (
                        <TableRow
                            key={aasListEntry.aasId}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                backgroundColor: theme.palette?.common?.white,
                                '&:hover': { backgroundColor: theme.palette.action.hover },
                            }}
                            data-testid={`list-row-${aasListEntry.aasId}`}
                        >
                            <AasListTableRow
                                aasListEntry={aasListEntry}
                                comparisonFeatureFlag={comparisonFeatureFlag}
                                checkBoxDisabled={checkBoxDisabled}
                                selectedAasList={selectedAasList}
                                updateSelectedAasList={updateSelectedAasList}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
