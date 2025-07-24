import { SubmodelElementCollection, Property } from 'lib/api/aas/models';
import { TimeSeriesSubmodelElementSemanticIdEnum } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesSubmodelElementSemanticId.enum';
import { findSubmodelElementBySemanticIdsOrIdShort, hasSemanticId } from 'lib/util/SubmodelResolverUtil';

export type TimeSeriesDataSet = {
    points: DataPoint[];
    names: string[];
};
export type DataPoint = { [key: string]: number | string };

/**
 * Parses TimeSeries record variable with timestamp to Date string
 * @param timeProp Record SMC with timestamp
 */
export function convertRecordTimeToDate(timeProp: Property): string | null {
    if (!timeProp.value) return null;

    const format = timeProp.valueType as unknown as string;
    switch (format) {
        case 'xs:long':
            return new Date(Number.parseFloat(timeProp.value)).toISOString();

        case 'xs:dateTime':
        case 'xs:time':
        case 'xs:date':
            return new Date(timeProp.value).toISOString();

        default:
            return null;
    }
}

/**
 * Parses Record structure to DataSet
 * @param segment InternalSegment from TimeSeries submodel
 */
export function parseRecordsFromInternalSegment(segment: SubmodelElementCollection): TimeSeriesDataSet | null {
    // get records
    const recordsElement = findSubmodelElementBySemanticIdsOrIdShort(segment.value, 'Records', [
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesRecords,
    ]);

    if (!recordsElement) return null;
    const records = (recordsElement as SubmodelElementCollection).value;
    if (!records || !records?.length) return null;

    // semantic id of record timestamps
    const target = findSubmodelElementBySemanticIdsOrIdShort(records, 'Time', [
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesTaiTime,
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesTaiTimeAlt,
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesRelativePointInTime,
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesRelativeTimeDuration,
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesRelativeTimeDurationAlt,
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesUtcTime,
        TimeSeriesSubmodelElementSemanticIdEnum.TimeSeriesUtcTimeAlt,
    ]);

    const targetSemID = target?.semanticId?.keys[0].value ?? null;
    if (!targetSemID) return null;

    const namesSet = new Set<string>();

    // parse records
    const points = records
        .map((record: SubmodelElementCollection) => record.value as Property[])
        .map((recordVars) => {
            const timeVar = recordVars.find((value) => hasSemanticId(value, targetSemID));
            const dataVars = recordVars.filter((variable) => variable !== timeVar);
            const point: DataPoint = {};

            dataVars.forEach((variable, index) => {
                const name = variable.idShort ?? index.toString();
                point[name] = Number.parseFloat(variable.value ?? '0');
                namesSet.add(name);
            });
            point['timestamp'] = timeVar ? (convertRecordTimeToDate(timeVar) ?? '') : '';
            return point;
        });

    return { points: points, names: Array.from(namesSet) };
}
