import {
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    SubmodelElementCollection,
    SubmodelElementList,
} from '@aas-core-works/aas-core3.0-typescript/types';
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ParametersComponentProps {
    smElement: SubmodelElementList;
}

/**
 * Component for rendering configuration parameters
 * @param props - Component props containing the submodel element
 * @returns JSX element displaying parameters as JSON
 */
export function ParametersComponent({ smElement }: ParametersComponentProps) {
    const paramList = smElement.value;
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const t = useTranslations('user-plugins.submodels.configuration.parameters-component');
    if (!paramList || paramList.length === 0) {
        return <Typography variant="body2">No parameters available.</Typography>;
    }

    function getPropertyValue(collection: ISubmodelElement, idShort: string): string {
        const property = (collection as SubmodelElementCollection).value?.find(
            (item: ISubmodelElement) => item.idShort === idShort,
        );
        if (!property) return '-';
        switch (getKeyType(property)) {
            case KeyTypes.Property: {
                return (property as Property).value || '-';
            }
            case KeyTypes.MultiLanguageProperty: {
                const mlProperty = property as MultiLanguageProperty;
                return mlProperty.value?.[0]?.text || '-';
            }
            case KeyTypes.SubmodelElementList: {
                return (property as SubmodelElementList).value?.map((item: Property) => item.value).join(', ') || '-';
            }
            default:
                return '-';
        }
    }

    const filteredParams = paramList.filter((param: ISubmodelElement) => {
        const paramId = getPropertyValue(param, 'parameter_id');
        return paramId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const paginatedParams = filteredParams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    function handleChangePage(event: unknown, newPage: number) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
        <Box>
            <TextField
                key={'table-search'}
                label={t('search-parameter-id')}
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                }}
                sx={{ minWidth: 300, my: 1 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>{t('parameters-id')}</strong>
                            </TableCell>
                            <TableCell>
                                <strong>{t('value')}</strong>
                            </TableCell>
                            <TableCell>
                                <strong>{t('description')}</strong>
                            </TableCell>
                            <TableCell>
                                <strong>{t('possible-values')}</strong>
                            </TableCell>
                            <TableCell>
                                <strong>{t('mandatory')}</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedParams.map((param: ISubmodelElement, index: number) => (
                            <TableRow key={param.idShort || index}>
                                <TableCell>{getPropertyValue(param, 'parameter_id')}</TableCell>
                                <TableCell>{getPropertyValue(param, 'value')}</TableCell>
                                <TableCell>{getPropertyValue(param, 'description')}</TableCell>
                                <TableCell>{getPropertyValue(param, 'possible_values')}</TableCell>
                                <TableCell>
                                    {(() => {
                                        const mandatoryValue = getPropertyValue(param, 'mandatory');
                                        if (mandatoryValue === 'true') {
                                            return <Chip label="Yes" color="primary" size="small" />;
                                        }
                                        if (mandatoryValue === 'false') {
                                            return <Chip label="No" color="default" size="small" />;
                                        }
                                        return '-';
                                    })()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredParams.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={t('pagination.rows-per-page')}
                    labelDisplayedRows={({ from, to, count }) => t('pagination.displayed-rows', { from, to, count })}
                    sx={{
                        '& .MuiTablePagination-toolbar': {
                            minHeight: 'auto',
                            paddingLeft: 0,
                            paddingRight: 0,
                        },
                    }}
                />
            </TableContainer>
        </Box>
    );
}
