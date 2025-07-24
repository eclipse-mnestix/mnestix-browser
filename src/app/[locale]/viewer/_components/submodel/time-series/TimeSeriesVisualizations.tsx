import { SubmodelElementCollection } from 'lib/api/aas/models';
import { TimeSeriesSubmodelElementSemanticIdEnum } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesSubmodelElementSemanticId.enum';
import { InfluxTimeSeries } from './InfluxTimeSeries';
import { InternalTimeSeries } from 'app/[locale]/viewer/_components/submodel/time-series/InternalTimeSeries';
import {
    findAllSubmodelElementsBySemanticIdsOrIdShortPrefix,
    findSubmodelElementBySemanticIdsOrIdShort,
} from 'lib/util/SubmodelResolverUtil';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function TimeSeriesVisualizations({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('pages.aasViewer.submodels.timeSeries');

    const timeSeriesSegments = findSubmodelElementBySemanticIdsOrIdShort(submodel.submodelElements, 'Segments', [
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesSegments,
    ]) as SubmodelElementCollection | undefined;

    if (!timeSeriesSegments || !timeSeriesSegments.value || timeSeriesSegments.value.length === 0) {
        return <Typography>{t('noTimeSeriesSegments')}</Typography>;
    }

    const linkedSegments = findAllSubmodelElementsBySemanticIdsOrIdShortPrefix(
        timeSeriesSegments.value,
        'LinkedSegment',
        [TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesLinkedSegment],
    ) as Array<SubmodelElementCollection> | undefined;

    const internalSegments = findAllSubmodelElementsBySemanticIdsOrIdShortPrefix(
        timeSeriesSegments.value,
        'InternalSegment',
        [TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesInternalSegment],
    ) as Array<SubmodelElementCollection> | undefined;

    return (
        <>
            {linkedSegments && linkedSegments.length > 0 && (
                <>
                    <Typography>{t('linkedSegments')}</Typography>
                    {linkedSegments.map((segment, index) => {
                        return <InfluxTimeSeries submodelElement={segment} key={index} />;
                    })}
                </>
            )}

            {internalSegments && internalSegments.length > 0 && (
                <>
                    <Typography>{t('internalSegments')}</Typography>
                    {internalSegments?.map((segment, index) => {
                        return <InternalTimeSeries submodelElement={segment} key={index} />;
                    })}
                </>
            )}
        </>
    );
}
