export enum TimeSeriesTimeFormat {
    TaiTime,
    RelativePointInTime,
    RelativeTimeDuration,
    UtcTime,
}

export const TimeSeriesTimeFormatSemanticIds: Record<string, TimeSeriesTimeFormat> = {
    'https://admin-shell.io/idta/TimeSeries/TaiTime/1/1': TimeSeriesTimeFormat.TaiTime,
    'https://admin-shell.io/idta/TimeSeries/RelativePointInTime/1/1': TimeSeriesTimeFormat.RelativePointInTime,
    'https://admin-shell.io/idta/TimeSeries/RelativeTimeDuration/1/1': TimeSeriesTimeFormat.RelativeTimeDuration,
    'https://admin-shell.io/idta/TimeSeries/UtcTime/1/1': TimeSeriesTimeFormat.UtcTime,
};
