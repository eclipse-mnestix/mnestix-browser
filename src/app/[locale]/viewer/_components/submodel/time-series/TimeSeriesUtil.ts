import {
    MultiLanguageProperty,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { TimeSeriesSubmodelElement } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesSubmodelElementEnum';
import { getTranslationText, hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { IntlShape } from 'react-intl';
import {
    TimeSeriesTimeFormat,
    TimeSeriesTimeFormatSemanticIds,
} from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesTimeFormatSemanticIds.enum';
import { Property } from '@aas-core-works/aas-core3.0-typescript/types';

export type TimeSeriesDataSet = {
    points: DataPoint[];
    names: string[];
};
export type DataPoint = { [key: string]: number | string };

export function extractValueBySemanticId(
    submodelElementCollection: SubmodelElementCollection,
    semanticId: TimeSeriesSubmodelElement,
) {
    return submodelElementCollection.value?.find((v) => hasSemanticId(v, semanticId));
}

export function extractIntlValueBySemanticId(
    submodelElementCollection: SubmodelElementCollection,
    semanticId: TimeSeriesSubmodelElement,
    intl: IntlShape,
) {
    const multiLanguageProperty: MultiLanguageProperty | undefined = extractValueBySemanticId(
        submodelElementCollection,
        semanticId,
    ) as MultiLanguageProperty;
    return multiLanguageProperty ? getTranslationText(multiLanguageProperty, intl) : '';
}

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
 * Searches in the record for the timestamp semantic id and returns the id string
 * @param record : Record with timestamp
 */
export function detectRecordTimeSemanticID(record: SubmodelElementCollection): string | null {
    if (!record.value || !record.value.length) return null;
    const variableSemIDs = record.value.map((value) => (value.semanticId?.keys[0].value ?? '') as string);
    if (!variableSemIDs.length) return null;
    const format = variableSemIDs
        .map((id) => TimeSeriesTimeFormatSemanticIds[id])
        .find((a) => a !== undefined) as TimeSeriesTimeFormat;
    if (format === undefined) return null;

    return Object.keys(TimeSeriesTimeFormatSemanticIds)[Object.values(TimeSeriesTimeFormatSemanticIds).indexOf(format)];
}

/**
 * Parses Record structure to DataSet
 * @param segment InternalSegment from TimeSeries submodel
 */
export function parseRecordsFromInternalSegment(segment: SubmodelElementCollection): TimeSeriesDataSet | null {
    // get records
    const recordsElement = segment.value?.find((se) => hasSemanticId(se, TimeSeriesSubmodelElement.TimeSeriesRecords));
    if (!recordsElement) return null;
    const records = (recordsElement as SubmodelElementCollection).value;
    if (!records || !records?.length) return null;

    // semantic id of record timestamps
    const targetSemID = detectRecordTimeSemanticID(records[0] as SubmodelElementCollection);
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
