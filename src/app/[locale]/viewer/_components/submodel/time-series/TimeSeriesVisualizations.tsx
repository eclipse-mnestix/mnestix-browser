import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { TimeSeriesSubmodelElementSemanticIdEnum } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesSubmodelElementSemanticId.enum';
import { InfluxTimeSeries } from './InfluxTimeSeries';
import { InternalTimeSeries } from 'app/[locale]/viewer/_components/submodel/time-series/InternalTimeSeries';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function TimeSeriesVisualizations({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('pages.aasViewer.submodels.timeSeries');

    const timeSeriesSegments = submodel.submodelElements?.find(
        (el) => el.semanticId?.keys[0].value === TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesSegments,
    ) as SubmodelElementCollection | undefined;

    const linkedSegments = timeSeriesSegments?.value?.filter((el) =>
        hasSemanticId(el, TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesLinkedSegment),
    ) as Array<SubmodelElementCollection> | undefined;

    const internalSegments = timeSeriesSegments?.value?.filter((el) =>
        hasSemanticId(el, TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesInternalSegment),
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
