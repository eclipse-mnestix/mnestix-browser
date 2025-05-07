import { FluxResultObserver, InfluxDB } from '@influxdata/influxdb-client-browser';
import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import { TimeSeriesLineDiagram } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesLineDiagram';
import { TimeSeriesDataSet } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesUtil';
import { useTranslations } from 'next-intl';

export function InfluxTimeSeriesDiagram(props: { query: string; endpoint: string }) {
    const t = useTranslations('pages.aasViewer');
    const { query, endpoint } = props;
    const [data, setData] = useState<TimeSeriesDataSet>({ points: [], names: [] });
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const responseData: TimeSeriesDataSet = { points: [], names: ['y'] };
        const parsedUrl = new URL(endpoint);
        const org = parsedUrl.searchParams.get('org') ?? '';
        const token = parsedUrl.searchParams.get('token') ?? '';
        const pathName = parsedUrl.pathname;
        // To maintain backward compatibility in configuration,
        // we add the /influx endpoint to route data requests through the Mnestix Proxy.
        // This approach securely manages the access token using environment variables,
        // ensuring that sensitive information remains hidden.
        const url = parsedUrl.origin + (pathName.includes('/influx/') ? '/influx' : '');

        const influx = new InfluxDB({
            url,
            headers: { Authorization: 'Token ' + token },
        }).getQueryApi(org);
        const observer: FluxResultObserver<string[]> = {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                responseData.points.push({ timestamp: o._time, y: o._value });
            },
            error(e) {
                setError(e);
                setIsLoading(false);
            },
            complete() {
                setData(responseData);
                setIsLoading(false);
            },
        };

        return influx.queryRows(query, observer);
    }, [endpoint, query]);

    if (isLoading) return <CircularProgress />;

    if (error)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                <Alert icon={false} severity="warning">
                    {t('errors.influxError')}
                </Alert>
            </Box>
        );

    return <TimeSeriesLineDiagram data={data} />;
}
