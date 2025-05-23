import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, Grid } from '@mui/material';
import { NestedContentWrapper } from 'components/basics/NestedContentWrapper';
import { ReactNode, useState } from 'react';
import { SubmodelCompareData } from 'lib/types/SubmodelCompareData';
import { useCompareAasContext } from 'components/contexts/CompareAasContext';
import { DataRow } from 'components/basics/DataRow';
import { isCompareData, isCompareDataRecord } from 'lib/util/CompareAasUtil';
import { CompareRecordValueRow } from './CompareRecordValueRow';
import { useTranslations } from 'next-intl';

type SubmodelCompareDataComponentProps = {
    readonly submodelCompareData: SubmodelCompareData;
};

export function CompareRecordCollectionRow(props: SubmodelCompareDataComponentProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const componentList: ReactNode[] = [];
    const { submodelCompareData } = props;
    const { compareAas } = useCompareAasContext();
    const t = useTranslations('pages.compare');

    const columnWidthCount = 12 / compareAas.length;

    if (
        !submodelCompareData.dataRecords ||
        (Array.isArray(submodelCompareData.dataRecords) && !submodelCompareData.dataRecords?.length) ||
        !Object.keys(submodelCompareData.dataRecords).length
    ) {
        return <></>;
    }
    submodelCompareData.dataRecords.forEach((val, dataIndex) => {
        if (isCompareDataRecord(val)) {
            componentList.push(
                <DataRow title={val.idShort} hasDivider={true} key={dataIndex}>
                    <CompareRecordValueRow data={val} columnWidthCount={columnWidthCount} />
                </DataRow>,
            );
        }
        if (isCompareData(val)) {
            return componentList.push(
                <DataRow title={val.idShort} hasDivider={true} key={dataIndex}>
                    <CompareRecordCollectionRow submodelCompareData={val} />{' '}
                </DataRow>,
            );
        }
        return <Grid size={{ xs: columnWidthCount }} key={dataIndex}></Grid>;
    });

    return (
        <Box>
            <Button
                size="small"
                variant="outlined"
                startIcon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                sx={{ my: 1 }}
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid="submodel-dropdown-button"
            >
                {isExpanded
                    ? t('collection.hide')
                    : t('collection.show', { idShort: `${submodelCompareData.idShort ?? '-'}` })}
            </Button>
            {isExpanded && <NestedContentWrapper>{componentList}</NestedContentWrapper>}
        </Box>
    );
}
