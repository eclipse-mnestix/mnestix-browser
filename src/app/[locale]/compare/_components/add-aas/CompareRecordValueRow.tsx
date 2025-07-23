import { SubmodelCompareDataRecord } from 'lib/types/SubmodelCompareData';
import { compareRowValues } from 'lib/util/CompareAasUtil';
import { Grid } from '@mui/material';
import { CompareSubmodelElement } from '../CompareSubmodelElement';
import { DifferenceSymbol } from 'components/basics/DifferenceSymbol';
import { useLocale } from 'next-intl';

export function CompareRecordValueRow(props: { data: SubmodelCompareDataRecord; columnWidthCount: number }) {
    const dataRecord = props.data;
    const locale = useLocale();

    const markedIndexes = compareRowValues(dataRecord.submodelElements, locale);

    return (
        <Grid container data-testid={'compare-Record'} justifyContent="space-between" alignItems="center">
            {(dataRecord).submodelElements?.map((subElement, valueIndex) => {
                return (
                    <Grid
                        size={{ xs: props.columnWidthCount - 0.5 }}
                        key={valueIndex}
                        data-testid={`compare-value-${valueIndex}`}
                    >
                        {subElement ? (
                            <CompareSubmodelElement
                                submodelElement={subElement}
                                isMarked={markedIndexes.includes(valueIndex)}
                            />
                        ) : (
                            markedIndexes.includes(valueIndex) && <DifferenceSymbol />
                        )}
                    </Grid>
                );
            })}
        </Grid>
    );
}
