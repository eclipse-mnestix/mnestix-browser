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
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { getKeyType } from 'lib/util/KeyTypeUtil';
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

    return (
        <Box>
            <TextField
                label="Search Parameter ID"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ my: 2, minWidth: 300 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Parameter ID</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Current Value</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Description</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Possible Values</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Mandatory</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredParams.map((param: ISubmodelElement, index: number) => (
                            <TableRow key={param.idShort || index}>
                                <TableCell>{getPropertyValue(param, 'parameter_id')}</TableCell>
                                <TableCell>{getPropertyValue(param, 'value')}</TableCell>
                                <TableCell>{getPropertyValue(param, 'description')}</TableCell>
                                <TableCell>{getPropertyValue(param, 'possible_values')}</TableCell>
                                <TableCell>
                                    {getPropertyValue(param, 'mandatory') === 'true' ? (
                                        <Chip label="Yes" color="primary" size="small" />
                                    ) : (
                                        <Chip label="No" color="default" size="small" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
