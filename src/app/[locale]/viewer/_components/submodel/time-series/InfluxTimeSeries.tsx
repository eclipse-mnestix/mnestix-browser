import { Property, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { Box, Typography } from '@mui/material';
import { StyledDataRow } from 'components/basics/StyledDataRow';
import { InfluxTimeSeriesDiagram } from './InfluxTimeSeriesDiagram';
import { useEffect, useState } from 'react';
import { TimeFrameSelection as TimeFrameSelection } from './TimeFrameSelection';
import { useIntl } from 'react-intl';
import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';
import { isValidUrl } from 'lib/util/UrlUtil';
import { useEnv } from 'app/EnvProvider';
import {
    extractIntlValueBySemanticId,
    extractValueBySemanticId,
} from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesUtil';

export function InfluxTimeSeries(props: { submodelElement: SubmodelElementCollection }) {
    const intl = useIntl();
    const env = useEnv();
    let endpoint = (
        extractValueBySemanticId(
            props.submodelElement,
            SubmodelElementSemanticId.TimeSeriesLinkedSegmentEndpoint,
        ) as Property
    )?.value;

    if (endpoint && env.MNESTIX_BACKEND_API_URL && !isValidUrl(endpoint)) {
        // TODO is this safe to do? MNES-979
        endpoint = env.MNESTIX_BACKEND_API_URL + endpoint;
    }

    const queryInAas = (
        extractValueBySemanticId(
            props.submodelElement,
            SubmodelElementSemanticId.TimeSeriesLinkedSegmentQuery,
        ) as Property
    )?.value;

    const name = extractIntlValueBySemanticId(
        props.submodelElement,
        SubmodelElementSemanticId.TimeSeriesSegmentName,
        intl,
    );
    const description = extractIntlValueBySemanticId(
        props.submodelElement,
        SubmodelElementSemanticId.TimeSeriesSegmentDescription,
        intl,
    );

    const [selectedTimeFrame, setSelectedTimeFrame] = useState('1d');
    const [query, setQuery] = useState(replaceTimeFrameInQuery(queryInAas, selectedTimeFrame));
    const showTimeSelection = env.LOCK_TIMESERIES_PERIOD_FEATURE_FLAG;

    useEffect(() => {
        setQuery(replaceTimeFrameInQuery(queryInAas, selectedTimeFrame));
    }, [queryInAas, selectedTimeFrame]);

    return endpoint && query ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid="timeseries-influx-wrapper">
            <StyledDataRow title={name}>
                <Box sx={{ marginTop: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Typography
                        sx={{ color: 'primary.main', fontSize: 24, fontWeight: 600, lineHeight: 1 }}
                        component="span"
                    >
                        {description}
                    </Typography>
                </Box>
                {showTimeSelection && (
                    <Box sx={{ marginTop: 2 }}>
                        <TimeFrameSelection
                            selectedTimeFrame={selectedTimeFrame}
                            setSelectedTimeFrame={setSelectedTimeFrame}
                            selectableTimeFrames={['1m', '6h', '12h', '1d', '7d']}
                        />
                    </Box>
                )}
                <Box sx={{ marginTop: 2 }}>
                    <InfluxTimeSeriesDiagram endpoint={endpoint} query={query} />
                </Box>
            </StyledDataRow>
        </Box>
    ) : (
        <></>
    );
}

const influxDbRangeParamRegEx = new RegExp(/range\([A-z]+: -?\d+[A-z]+\)/);

function replaceTimeFrameInQuery(query: string | undefined | null, timeFrame: string) {
    return query?.replace(influxDbRangeParamRegEx, `range(start: -${timeFrame})`);
}
