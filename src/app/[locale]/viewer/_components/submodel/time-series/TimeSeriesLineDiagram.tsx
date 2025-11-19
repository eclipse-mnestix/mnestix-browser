import {
    Brush,
    CartesianGrid,
    Label,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { TimeSeriesDataSet } from 'app/[locale]/viewer/_components/submodel/time-series/TimeSeriesUtil';
import { useTranslations } from 'next-intl';

function formatDate(dateString: string, onlyTime = false) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        year: onlyTime ? undefined : '2-digit',
        month: onlyTime ? undefined : '2-digit',
        day: onlyTime ? undefined : '2-digit',
        hour: '2-digit',
        minute: onlyTime ? '2-digit' : undefined,
        second: onlyTime ? '2-digit' : undefined,
    };
    return date.toLocaleString('en-US', options);
}

function formatDateLabel(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
    });
}

function getDateStamp(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function getUTCMidnightEquivalentTime(dates: string[]) {
    return dates.map((date) => {
        const dt = new Date(`${date}`);
        const utcTime = dt.getTime() + dt.getTimezoneOffset() * 60000;
        return new Date(utcTime).toISOString().slice(0, -5) + 'Z';
    });
}

function CustomTooltip({
    active,
    payload,
    label,
    uniqueDatesCount,
}: {
    active?: boolean;
    payload?: Array<{ color: string; name: string; value: string }>;
    label?: string;
    uniqueDatesCount: number;
}) {
    if (payload && payload.length && label) {
        return (
            <Box
                sx={{
                    bgcolor: 'white',
                    border: '1px solid #CCCCCC',
                    visibility: !active ? 'hidden' : undefined,
                    padding: '10px',
                }}
            >
                <Typography>{formatDate(label, uniqueDatesCount <= 2)}</Typography>
                {payload.map((p, index) => (
                    <Box
                        key={index}
                        sx={{ fontSize: 11, color: p.color, paddingY: '4px' }}
                    >{`${p.name} : ${p.value} `}</Box>
                ))}
            </Box>
        );
    }
    return null;
}

export function TimeSeriesLineDiagram(props: { data: TimeSeriesDataSet; timeframeSelectable?: boolean }) {
    const uniqueDates = [...new Set(props.data.points.map((point) => getDateStamp(point['timestamp'] as string)))];
    const startDayMarkerStamp = uniqueDates.length > 2 ? getUTCMidnightEquivalentTime(uniqueDates) : [];
    const t = useTranslations('pages.aasViewer.submodels.timeSeries');
    const theme = useTheme();
    const color = theme.palette.primary.main;

    return (
        <Box sx={{ width: '100%', height: '250px' }} data-testid="timeseries-line-chart">
            <ResponsiveContainer>
                <LineChart data={props.data.points} margin={{ top: 5, right: 30, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        fontSize={11}
                        dataKey="timestamp"
                        tickFormatter={(v) => formatDate(v, uniqueDates.length <= 2)}
                    />
                    <YAxis fontSize={11} />
                    <Tooltip content={<CustomTooltip uniqueDatesCount={uniqueDates.length} />} />
                    {startDayMarkerStamp.map((marker) => (
                        <ReferenceLine key={marker} x={marker} stroke="blue">
                            <Label
                                value={formatDateLabel(marker)}
                                position="insideRight"
                                dx={-5}
                                angle={-90}
                                style={{ textAnchor: 'middle' }}
                            />
                        </ReferenceLine>
                    ))}
                    {props.data.names.map((name, index) => (
                        <Line
                            type="monotone"
                            key={index}
                            dataKey={name}
                            stroke={color}
                            dot={{ stroke: color, fill: color, strokeWidth: 1, r: 2 }}
                        />
                    ))}
                    {props.timeframeSelectable && (
                        <Brush
                            dataKey="timestamp"
                            height={30}
                            tickFormatter={(v) => formatDate(v, uniqueDates.length <= 2)}
                            stroke={color}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>

            {props.timeframeSelectable && (
                <Typography color="text.secondary" variant="body2" align="center">
                    {t('selectTimeframe')}
                </Typography>
            )}
        </Box>
    );
}
