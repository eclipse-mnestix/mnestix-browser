import { alpha, Box, useTheme } from '@mui/material';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslations } from 'next-intl';
import { CO2Unit } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/CarbonFootprintVisualizations';
import { CustomTooltipWithUnit } from '../CustomTooltipWithUnit';

export function CO2EBarchart(props: {
    co2EquivalentsPerLifecycleStage: Partial<Record<ProductLifecycleStage, number>>;
    unit: CO2Unit;
}) {
    const theme = useTheme();
    const t = useTranslations('components.carbonFootprint');

    const data = [{ name: t('equivalents'), ...props.co2EquivalentsPerLifecycleStage }];

    const bars = (Object.keys(props.co2EquivalentsPerLifecycleStage) as ProductLifecycleStage[])
        .sort((a, b) => data[0][b]! - data[0][a]!)
        .map((val, index, arr) => (
            <Bar
                dataKey={val}
                stackId="a"
                fill={getColorByIndex(theme.palette.primary.main, index, arr.length)}
                key={index}
            />
        ));

    return (
        <Box sx={{ width: '100%', height: '400px' }} data-testid="co2e-barchart">
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: `${props.unit} CO2e`, angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                        content={(tooltipProps) => (
                            <CustomTooltipWithUnit
                                active={tooltipProps.active}
                                payload={tooltipProps.payload as Array<{ color: string; name: string; value: string }>}
                                label={tooltipProps.label}
                                unit={props.unit}
                            />
                        )}
                    />
                    <Legend />
                    {bars}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

/**
 * @returns color with opacity between 1 and 0.4, spread according to it's index
 */
function getColorByIndex(baseColor: string, index: number, maxIndex: number): string {
    const opacity = 1 - 0.6 * (index / (maxIndex - 1));
    return alpha(baseColor, opacity);
}
