import { expect } from '@jest/globals';
import { Property, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import {
    convertRecordTimeToDate,
    parseRecordsFromInternalSegment,
} from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesUtil';

describe('Parse internal Segment', () => {
    it('Parse example internal segment', async () => {
        const segment = {
            idShort: 'InternalSegment',
            semanticId: {
                type: 'ExternalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: 'https://admin-shell.io/idta/TimeSeries/Segments/InternalSegment/1/1',
                    },
                ],
            },
            value: [
                {
                    category: 'PARAMETER',
                    idShort: 'Name',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/Name/1/1',
                            },
                        ],
                    },
                },
                {
                    category: 'PARAMETER',
                    idShort: 'Description',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/Description/1/1',
                            },
                        ],
                    },
                },
                {
                    category: 'VARIABLE',
                    idShort: 'RecordCount',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/RecordCount/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:long',
                    value: '',
                },
                {
                    category: 'VARIABLE',
                    idShort: 'StartTime',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/StartTime/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:string',
                    value: '',
                },
                {
                    category: 'VARIABLE',
                    idShort: 'EndTime',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/EndTime/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:string',
                    value: '',
                },
                {
                    category: 'VARIABLE',
                    idShort: 'Duration',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/Duration/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:string',
                    value: '',
                },
                {
                    category: 'PARAMETER',
                    idShort: 'SamplingInterval',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/SamplingInterval/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:long',
                    value: '',
                },
                {
                    category: 'PARAMETER',
                    idShort: 'SamplingRate',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/SamplingRate/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:long',
                    value: '',
                },
                {
                    category: 'PARAMETER',
                    idShort: 'State',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/State/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:string',
                    value: '',
                },
                {
                    category: 'VARIABLE',
                    idShort: 'LastUpdate',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Segment/LastUpdate/1/1',
                            },
                        ],
                    },
                    valueType: 'xs:string',
                    value: '',
                },
                {
                    idShort: 'Records',
                    modelType: 'SubmodelElementCollection',
                    semanticId: {
                        type: 'ExternalReference',
                        keys: [
                            {
                                type: 'GlobalReference',
                                value: 'https://admin-shell.io/idta/TimeSeries/Records/1/1',
                            },
                        ],
                    },
                    value: [
                        {
                            idShort: 'Record',
                            modelType: 'SubmodelElementCollection',
                            semanticId: {
                                type: 'ExternalReference',
                                keys: [
                                    {
                                        type: 'GlobalReference',
                                        value: 'https://admin-shell.io/idta/TimeSeries/Record/1/1',
                                    },
                                ],
                            },
                            value: [
                                {
                                    category: 'VARIABLE',
                                    idShort: 'Time',
                                    semanticId: {
                                        type: 'ExternalReference',
                                        keys: [
                                            {
                                                type: 'GlobalReference',
                                                value: 'https://admin-shell.io/idta/TimeSeries/RelativePointInTime/1/1',
                                            },
                                        ],
                                    },
                                    valueType: 'xs:long',
                                    value: '1729164727287',
                                },
                                {
                                    category: 'VARIABLE',
                                    idShort: 'sampleAccelerationX',
                                    valueType: 'xs:long',
                                    value: '2',
                                },
                                {
                                    category: 'VARIABLE',
                                    idShort: 'sampleAccelerationY',
                                    valueType: 'xs:long',
                                    value: '4',
                                },
                                {
                                    category: 'VARIABLE',
                                    idShort: 'sampleAccelerationZ',
                                    valueType: 'xs:long',
                                    value: '6',
                                },
                            ],
                        },
                        {
                            idShort: 'Record',
                            modelType: 'SubmodelElementCollection',
                            semanticId: {
                                type: 'ExternalReference',
                                keys: [
                                    {
                                        type: 'GlobalReference',
                                        value: 'https://admin-shell.io/idta/TimeSeries/Record/1/1',
                                    },
                                ],
                            },
                            value: [
                                {
                                    category: 'VARIABLE',
                                    idShort: 'Time',
                                    semanticId: {
                                        type: 'ExternalReference',
                                        keys: [
                                            {
                                                type: 'GlobalReference',
                                                value: 'https://admin-shell.io/idta/TimeSeries/RelativePointInTime/1/1',
                                            },
                                        ],
                                    },
                                    valueType: 'xs:long',
                                    value: '1729164729987',
                                },
                                {
                                    category: 'VARIABLE',
                                    idShort: 'sampleAccelerationX',
                                    valueType: 'xs:long',
                                    value: '4',
                                },
                                {
                                    category: 'VARIABLE',
                                    idShort: 'sampleAccelerationY',
                                    valueType: 'xs:long',
                                    value: '8',
                                },
                                {
                                    category: 'VARIABLE',
                                    idShort: 'sampleAccelerationZ',
                                    valueType: 'xs:long',
                                    value: '42',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const dataSet = parseRecordsFromInternalSegment(segment as unknown as SubmodelElementCollection);
        expect(dataSet?.points).toHaveLength(2);
        expect(dataSet?.names).toHaveLength(3);
        expect(Object.keys(dataSet?.points[1] ?? {})[0] === 'sampleAccelerationX');
        expect(dataSet?.points[1].sampleAccelerationX).toBe(4);
        expect('1729164729987' === dataSet?.points[1].timestamp);
    });

    it('Parse example timestamps', async () => {
        const propertyStructure = {
            category: 'VARIABLE',
            idShort: 'Time',
            semanticId: {
                type: 'ExternalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: 'https://admin-shell.io/idta/TimeSeries/RelativePointInTime/1/1',
                    },
                ],
            },
            valueType: 'xs:long',
            value: '1729164729987',
            modelType: 'Property',
        };

        const dateFromInt = convertRecordTimeToDate(propertyStructure as unknown as Property);
        expect(dateFromInt).toEqual('2024-10-17T11:32:09.987Z');

        propertyStructure.value = '';
        expect(convertRecordTimeToDate(propertyStructure as unknown as Property)).toBe(null);
        propertyStructure.valueType = '';
        expect(convertRecordTimeToDate(propertyStructure as unknown as Property)).toBe(null);

        propertyStructure.value = '2024-10-01T07:49:10.608Z';
        propertyStructure.valueType = 'xs:dateTime';
        const dateFromString = convertRecordTimeToDate(propertyStructure as unknown as Property);
        expect(dateFromString).toEqual('2024-10-01T07:49:10.608Z');
    });  
});
