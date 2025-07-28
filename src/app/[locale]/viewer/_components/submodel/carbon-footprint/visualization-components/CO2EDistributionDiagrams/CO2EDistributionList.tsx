import { Grid, Paper, styled } from '@mui/material';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';
import React from 'react';
import { useTranslations } from 'next-intl';
import { CO2Unit } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/CarbonFootprintVisualizations';

export function CO2EList(props: {
    co2EquivalentsPerLifecycleStage: Partial<Record<ProductLifecycleStage, number>>;
    unit: CO2Unit;
}) {
    const t = useTranslations('components.carbonFootprint');
    const { co2EquivalentsPerLifecycleStage } = props;

    const ItemCO2Amount = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(1),
        textAlign: 'right',
        color: '#5e6b7c',
        fontWeight: 'bold',
    }));

    const ItemLifecycleStage = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(1),
        textAlign: 'left',
    }));

    const rows = (Object.keys(co2EquivalentsPerLifecycleStage) as ProductLifecycleStage[])
        .sort((a, b) => co2EquivalentsPerLifecycleStage[b]! - co2EquivalentsPerLifecycleStage[a]!)
        .map((val, index) => (
            <React.Fragment key={index}>
                <Grid key={`grid-item-${index}`} size={{ xs: 3, sm: 2 }}>
                    <ItemCO2Amount elevation={0}>{`${cutDecimalPlaces(
                        co2EquivalentsPerLifecycleStage[val]!,
                        3,
                    )} ${props.unit}`}</ItemCO2Amount>
                </Grid>
                <Grid key={`grid-stage-${index}`} size={{ xs: 9, sm: 10 }}>
                    <ItemLifecycleStage elevation={1}>{t(`stages.${val}`)}</ItemLifecycleStage>
                </Grid>
            </React.Fragment>
        ));

    return (
        <Grid container spacing={1} columns={12} alignItems="stretch" data-testid="co2e-list">
            {rows}
        </Grid>
    );
}
