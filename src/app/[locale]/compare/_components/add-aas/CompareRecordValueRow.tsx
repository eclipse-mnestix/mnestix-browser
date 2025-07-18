﻿import { SubmodelCompareDataRecord } from 'lib/types/SubmodelCompareData';
import { compareRowValues } from 'lib/util/CompareAasUtil';
import { Grid } from '@mui/material';
import { CompareSubmodelElement } from '../CompareSubmodelElement';
import { DifferenceSymbol } from 'components/basics/DifferenceSymbol';
import { useLocale } from 'next-intl';
import { SubmodelElementChoice } from 'lib/api/aas/models';

export function CompareRecordValueRow(props: { data: SubmodelCompareDataRecord; columnWidthCount: number }) {
    const dataRecord = props.data;
    const locale = useLocale();

    const markedIndexes = compareRowValues(dataRecord.submodelElements, locale);

    return (
        <Grid container data-testid={'compare-Record'} justifyContent="space-between" alignItems="center">
            {(dataRecord as SubmodelCompareDataRecord).submodelElements?.map((subElement, valueIndex) => {
                return (
                    <Grid
                        size={{ xs: props.columnWidthCount - 0.5 }}
                        key={valueIndex}
                        data-testid={`compare-value-${valueIndex}`}
                    >
                        {subElement ? (
                            <CompareSubmodelElement
                                submodelElement={subElement as unknown as SubmodelElementChoice}
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
