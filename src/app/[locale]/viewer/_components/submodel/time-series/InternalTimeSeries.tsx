import { Alert, Box, Typography } from '@mui/material';
import { TimeSeriesLineDiagram } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesLineDiagram';
import { parseRecordsFromInternalSegment } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesUtil';
import { SubmodelElementCollection } from 'lib/api/aas/models';
import { StyledDataRow } from 'components/basics/StyledDataRow';
import { TimeSeriesSubmodelElementSemanticIdEnum } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesSubmodelElementSemanticId.enum';
import { useLocale, useTranslations } from 'next-intl';
import { findValueByIdShort } from 'lib/util/SubmodelResolverUtil';

export function InternalTimeSeries(props: { submodelElement: SubmodelElementCollection }) {
    const t = useTranslations();
    const locale = useLocale();

    const data = parseRecordsFromInternalSegment(props.submodelElement);
    const error = !data;

    const name = findValueByIdShort(
        props.submodelElement.value,
        'Name',
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesSegmentName,
        locale,
    );

    const description = findValueByIdShort(
        props.submodelElement.value,
        'Description',
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesSegmentDescription,
        locale,
    );

    if (error)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                <Alert icon={false} severity="warning">
                    {t('pages.aasViewer.errors.influxError')}
                </Alert>
            </Box>
        );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid="timeseries-internal-wrapper">
            <StyledDataRow title={name ? name : ''}>
                <Box sx={{ marginTop: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Typography
                        sx={{ color: 'primary.main', fontSize: 24, fontWeight: 600, lineHeight: 1 }}
                        component="span"
                    >
                        {description ? description : ''}
                    </Typography>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <TimeSeriesLineDiagram data={data} timeframeSelectable={true} />
                </Box>
            </StyledDataRow>
        </Box>
    );
}
